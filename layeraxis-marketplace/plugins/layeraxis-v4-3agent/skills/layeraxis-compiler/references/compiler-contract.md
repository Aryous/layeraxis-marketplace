# Compiler Contract (LayerAxis V4 Flow)

## Input Contract

`imgs-spec/creative-draft.md` should contain per-image blocks with:
- image id (NN)
- concept focus
- functional layer and scores
- Chinese scene definition
- English prompt

## Output Contract

### plan.lock.yaml
- density
- style_guide
- negative_prompt
- generation.model
- generation.aspect_ratio
- generation.image_size

### outline.md
- one block per image
- concept focus
- functional layer
- three scores + rationale

### NN-*.md
- required sections:
  - `## 原文`
  - `## 场景设计`
  - `## 上色`
  - `## 概念卡`
  - `## English Prompt`

## Conflict Policy

If draft conflicts with schema, preserve meaning first and normalize format second.
