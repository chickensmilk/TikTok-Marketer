# AI Video Workflow App

**Path:** `/Users/richardvargas/Desktop/Rich's Claude/ai-video-workflow/`
**Created:** 2026-02-24
**Status:** Complete

## Stack
- React 18 + Vite 5
- Tailwind CSS 3 (dark theme, gray-950 base)
- Context API + useReducer (WorkflowContext)
- localStorage via abstracted storage.js service

## Structure
```
src/
  App.jsx                          # Root, wraps WorkflowProvider
  main.jsx
  index.css                        # Tailwind + custom classes
  context/WorkflowContext.jsx      # Global state, all actions + selectors
  services/storage.js              # localStorage abstraction (STORAGE_KEY)
  data/workflow.js                 # All 10 steps, 2 phases, checklists, prompts
  components/
    layout/Sidebar.jsx             # Phase nav + progress
    layout/Header.jsx              # Project name (editable) + stats
    workflow/PhaseCard.jsx         # Collapsible phase container
    workflow/StepCard.jsx          # Step with checklist + guidance + prompts
    workflow/ChecklistItem.jsx     # Checkbox item
    workflow/PromptBlock.jsx       # Copy-to-clipboard prompt template
    workflow/CharacterSheet.jsx    # Add/track character views (front/side/back/3-4)
    workflow/AssetSheet.jsx        # Add/track asset views (front/side/back/top/3-4)
    ui/ProgressBar.jsx
    ui/Badge.jsx
    ui/Tooltip.jsx
```

## Workflow Content
- Phase 1 Planning: 4 steps (Tech Stack, Ideation, Concept Selection, Production Planning)
- Phase 2 Creation: 6 steps (Character Sheets NEW, Asset Sheets NEW, Asset Creation, Storyboarding, Video Generation, Assembly & Audio)
- Steps 5 & 6 have special `type` fields ('character-sheet', 'asset-sheet') that render the builder UIs

## Key State Shape
```js
{
  profileId, projectName, createdAt,
  activePhaseId, activeStepId,
  checklist: { [itemId]: boolean },
  characters: [{ id, name, role, description, notes, views:{front,side,back,threeQuarter}, generationPrompt }],
  assets: [{ id, name, category, description, notes, views:{front,side,back,top,threeQuarter}, generationPrompt }],
  log: []
}
```

## Running
```bash
cd "/Users/richardvargas/Desktop/Rich's Claude/ai-video-workflow"
npm run dev   # → http://localhost:5173
```
