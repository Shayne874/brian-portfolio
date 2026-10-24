# AI Personalized Outreach Generator

Portfolio demonstration of an LLM-powered workflow for permission-based, personalized outreach. The pipeline validates structured inputs, builds a controlled prompt, generates JSON drafts, scores them against reproducible checks, and requires manual review. **It does not send emails.**

## Architecture

Prospect JSON -> validation -> prompt template -> LLM or offline fixture -> JSON draft -> rubric checks -> pending human review -> approval/rejection.

The live integration uses the OpenAI Chat Completions API with `response_format: json_object`. The default mode is deterministic and offline, so reviewers can inspect the workflow without credentials or API costs.

## Run

Requires Python 3.9+ and no third-party packages.

```bash
cd ai-outreach
python workflow.py sample-prospect.json --output draft-review.json
python -m unittest discover -s . -v
```

Live LLM run, after obtaining an API key:

```bash
export OPENAI_API_KEY="your-key-here"
python workflow.py sample-prospect.json --live
```

Set `OPENAI_MODEL` to a supported chat-completions model if needed. Keep API keys out of the repository.

## Sample input

See `sample-prospect.json`. All company and person data are fictional.

## Evaluation criteria

The `evaluate` function checks: required JSON fields, presence of a personalized reference, body at most 110 words, a question as call to action, and absence of links. The resulting score is the proportion of passed checks. These are basic deterministic rubric checks, **not** guarantees of factual accuracy, message quality, deliverability, or safety.

Run automated offline tests in `test_workflow.py`. Compare alternative prompts against an unchanged set of inputs to identify regressions. A later iteration should incorporate labeled human assessments for relevance, factual grounding, tone, and bias, plus API mock tests and error handling for rate limits.

## Human review gate

Every draft starts as `pending_human_review`. An operator must inspect its claims, context, recipients' preferences, and suitability before invoking `approve(record, reviewer, accepted=True)` in Python. Programmatic approval only changes a local record; there is no delivery integration.

## Boundaries

- No address scraping, unsolicited sending, bulk-delivery features, or use of sensitive personal attributes.
- The demo generator is explicitly an offline fixture, not an LLM.
- Live API requests require a user-provided API key and incur provider charges.
- The repository has not performed a live API run. Inspect manual review outcomes before describing production readiness.

## Next iterations

1. Add golden-dataset evaluations across multiple prospect scenarios.
2. Add mock-server/API unit tests for malformed responses and retryable failures.
3. Add a real reviewer interface and audit log.
4. Compare prompt variants against human-labeled factual-grounding criteria.
