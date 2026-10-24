"""LLM outreach workflow: validate inputs, generate, evaluate, and gate approval.

Uses the OpenAI Chat Completions HTTP API without external dependencies.
No messages are sent to prospects; approved results are saved locally only.
"""
import argparse
import json
import os
from pathlib import Path
import re
from urllib import request, error

SYSTEM = """You write concise, professional, permission-based outreach.
Use only supplied prospect facts. Never fabricate results or familiarity.
Return JSON with keys subject, body, and rationale.
The body must contain a personalized reference, a clear purpose, and one question.
No manipulative urgency, private attributes, or unverified claims."""
REQUIRED = {"name", "company", "role", "context", "offering"}


def validate_prospect(prospect):
    if not isinstance(prospect, dict) or any(
        not isinstance(prospect.get(k), str) or not prospect[k].strip() for k in REQUIRED
    ):
        raise ValueError("Prospect requires nonempty name, company, role, context, offering")
    return {k: prospect[k].strip() for k in sorted(REQUIRED)}


def prompt_for(prospect):
    return (
        "Write a tailored B2B introduction for this verified input. "
        "Do not infer details not listed. Keep the body under 110 words.\n"
        + json.dumps(validate_prospect(prospect), ensure_ascii=False, sort_keys=True)
    )


def openai_generate(prospect, model=None):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("Set OPENAI_API_KEY before using the live model")
    payload = {
        "model": model or os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt_for(prospect)},
        ],
    }
    req = request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=45) as response:
            message = json.load(response)["choices"][0]["message"]["content"]
    except error.HTTPError as exc:
        raise RuntimeError("LLM API request failed with HTTP " + str(exc.code)) from exc
    return json.loads(message)


def demo_generate(prospect):
    """Deterministic offline fixture, NOT an actual LLM response."""
    p = validate_prospect(prospect)
    return {
        "subject": "Idea for " + p["company"],
        "body": (
            f"Hi {p['name']}, I noticed {p['context']}. "
            f"I help teams with {p['offering']}. "
            "Would you be open to a brief conversation about whether this fits your priorities?"
        ),
        "rationale": "References the supplied context, with no invented facts.",
    }


def evaluate(output, prospect):
    """Transparent heuristic checks; human factual review still required."""
    p = validate_prospect(prospect)
    checks = {
        "required_fields": isinstance(output, dict) and all(
            isinstance(output.get(k), str) and bool(output[k].strip())
            for k in ("subject", "body", "rationale")
        ),
        "personalization": isinstance(output, dict) and (
            p["name"].lower() in str(output.get("body", "")).lower()
            or p["company"].lower() in str(output.get("body", "")).lower()
            or p["context"].lower() in str(output.get("body", "")).lower()
        ),
        "length_under_110_words": len(str(output.get("body", "")).split()) <= 110,
        "call_to_action": "?" in str(output.get("body", "")),
        "no_links": not bool(re.search(r"https?://", str(output.get("body", "")))),
    }
    return {"checks": checks, "score": round(sum(checks.values()) / len(checks), 2),
            "passes_gate": all(checks.values())}


def run(prospect, generate=demo_generate):
    p = validate_prospect(prospect)
    output = generate(p)
    report = evaluate(output, p)
    return {"prospect": p, "draft": output, "evaluation": report,
            "status": "pending_human_review"}


def approve(record, reviewer, accepted=False):
    if not reviewer.strip():
        raise ValueError("Reviewer name is required")
    if not record["evaluation"]["passes_gate"]:
        raise ValueError("Draft failed automatic checks")
    record = dict(record)
    record["status"] = "approved" if accepted else "rejected"
    record["reviewer"] = reviewer.strip()
    return record


def main():
    parser = argparse.ArgumentParser(description="Generate draft outreach for human approval")
    parser.add_argument("input", help="JSON file containing prospect data")
    parser.add_argument("--live", action="store_true", help="Call configured OpenAI API")
    parser.add_argument("--output", default="draft-review.json")
    args = parser.parse_args()
    prospect = json.loads(Path(args.input).read_text(encoding="utf-8"))
    record = run(prospect, generate=openai_generate if args.live else demo_generate)
    Path(args.output).write_text(json.dumps(record, indent=2), encoding="utf-8")
    print(json.dumps({"status": record["status"], "evaluation": record["evaluation"],
                      "output": args.output}, indent=2))


if __name__ == "__main__":
    main()
