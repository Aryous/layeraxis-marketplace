# Pipeline Gates (LayerAxis V4 Flow)

## Gate A

Before compiler phase:
- `imgs-spec/creative-draft.md` exists and is non-empty.

## Gate B

Before render phase:
- `imgs-spec/plan.lock.yaml` exists.
- `imgs-spec/outline.md` exists.
- at least one `imgs-spec/NN-*.md` exists.
- each `NN-*.md` has non-empty `## English Prompt`.

## Review Mode

If `imgs-spec/review-feedback.yaml` exists in review mode:
- send feedback back to creative phase first
- re-run compiler after creative rewrite
