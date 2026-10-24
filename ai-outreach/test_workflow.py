"""Offline tests: run python -m unittest discover -s ai-outreach -v."""
import unittest
from workflow import approve, demo_generate, evaluate, prompt_for, run, validate_prospect

PROSPECT = {"name": "Jordan", "company": "Example Studio", "role": "Founder",
            "context": "your public team announcement",
            "offering": "a content review workflow"}


class WorkflowTests(unittest.TestCase):
    def test_input_validation(self):
        with self.assertRaises(ValueError):
            validate_prospect({"name": "Jordan"})

    def test_prompt_includes_verified_facts(self):
        prompt = prompt_for(PROSPECT)
        self.assertIn("Example Studio", prompt)
        self.assertIn("your public team announcement", prompt)

    def test_deterministic_draft_and_scoring(self):
        record = run(PROSPECT)
        self.assertEqual(record["status"], "pending_human_review")
        self.assertTrue(record["evaluation"]["passes_gate"])
        self.assertEqual(record["evaluation"]["score"], 1.0)

    def test_missing_required_fields_fails(self):
        score = evaluate({"subject": "Hi", "body": "Hello", "rationale": ""}, PROSPECT)
        self.assertFalse(score["passes_gate"])

    def test_link_fails_policy(self):
        draft = demo_generate(PROSPECT)
        draft["body"] += " https://example.org"
        self.assertFalse(evaluate(draft, PROSPECT)["checks"]["no_links"])

    def test_approval_requires_reviewer(self):
        record = run(PROSPECT)
        with self.assertRaises(ValueError):
            approve(record, "", True)
        self.assertEqual(approve(record, "Reviewer A", True)["status"], "approved")

    def test_failed_draft_cannot_be_approved(self):
        record = run(PROSPECT, generate=lambda _: {"subject": "X", "body": "", "rationale": ""})
        with self.assertRaises(ValueError):
            approve(record, "Reviewer A", True)


if __name__ == "__main__":
    unittest.main()
