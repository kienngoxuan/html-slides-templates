# Lecta AI — Blocks Quick Reference

## Overview
This document lists the required fields and schema definitions for all available block types in the Lecta AI slide presentation template system. Use this as a reference when generating or modifying slide JSON data.

## Canonical Block Types

### 1. `title` / `splash`
- **Purpose**: Main slide title or section header.
- **Required**: `heading` (or `title` for splash)
- **Optional**: `subtitle`, `badge`, `icon`

### 2. `bullets`
- **Purpose**: Standard bullet points with optional icons.
- **Required**: `heading`, `items` (Array of objects)
- **Item properties**: `text`, `icon` (optional)

### 3. `accordion`
- **Purpose**: Expandable content sections for dense information.
- **Required**: `heading`, `items` (Array of objects)
- **Item properties**: `title`, `content`

### 4. `tabs`
- **Purpose**: Tabbed navigation for categorizing related content.
- **Required**: `heading`, `tabs` (Array of objects)
- **Item properties**: `title`, `content`

### 5. `stepper`
- **Purpose**: Vertical or horizontal step-by-step processes.
- **Required**: `heading`, `steps` (Array of objects)
- **Item properties**: `title`, `description`

### 6. `cards`
- **Purpose**: Grid of informative cards.
- **Required**: `heading`, `cards` (Array of objects)
- **Item properties**: `title`, `description`, `icon`

### 7. `quiz` / `advanced-quiz`
- **Purpose**: Interactive multiple-choice questions.
- **Required**: `heading`, `questions` (Array of objects)
- **Item properties**: `question`, `options` (Array of strings), `correct` (integer index, 0-based), `explanation` (optional)

### 8. `compare`
- **Purpose**: Side-by-side comparison (pros/cons, before/after).
- **Required**: `heading`, `left` (Object), `right` (Object)
- **Left/Right properties**: `title`, `items` (Array of strings), `theme` (e.g. "success", "danger")

### 9. `timeline` / `timeline-horizontal`
- **Purpose**: Chronological sequence of events.
- **Required**: `heading`, `events` (Array of objects)
- **Item properties**: `year` or `date`, `title`, `description`

### 10. `summary`
- **Purpose**: High-level recap with visual distinction.
- **Required**: `heading`, `items` (Array of objects)
- **Item properties**: `title`, `description`, `icon`

### 11. `image`
- **Purpose**: Full-bleed or contained image block.
- **Required**: `url`
- **Optional**: `caption`, `heading`

### 12. `chart`
- **Purpose**: Data visualization (Bar, Line, Doughnut).
- **Required**: `chartType` (e.g. "bar", "line", "doughnut")
- **Optional**: `heading`, `labels` (Array of strings), `datasets` (Array of objects: `{ label, data, color }`)

### 13. `table`
- **Purpose**: Tabular data presentation.
- **Required**: `columns` (Array of `{key, label}`), `rows` (Array of objects matching keys)

### 14. `bento`
- **Purpose**: Asymmetrical grid layout (Bento box style).
- **Required**: `heading`, `items` (Array of objects)
- **Item properties**: `title`, `value` or `content`, `icon`, `colSpan`, `rowSpan`, `color`

### 15. `flow`
- **Purpose**: Node-based flowchart diagram.
- **Required**: `heading`, `nodes` (Array of `{id, label, x, y, type}`), `connections` (Array of `{from, to, label}`)

### 16. `split`
- **Purpose**: 50/50 split layout combining two different block types.
- **Required**: `heading`, `left` (Object), `right` (Object)
- **Left/Right properties**: `type` (any valid block type), `data` (corresponding block payload)

### 17. `math`
- **Purpose**: LaTeX math rendering.
- **Required**: `latex` (String)

### 18. `mermaid`
- **Purpose**: Mermaid syntax diagrams.
- **Required**: `code` (String)

### 19. `video`
- **Purpose**: Video player wrapper.
- **Required**: `heading`, `url` (or `embedUrl`)

### 20. `quote-card`
- **Purpose**: Highlighted blockquote.
- **Required**: `quote`
- **Optional**: `author`, `role`

### 21. `definition-card`
- **Purpose**: Technical term definition.
- **Required**: `term`, `definition`

### 22. `analogy`
- **Purpose**: Comparing a technical concept to a real-world analogy.
- **Required**: `technicalConcept`, `analogy`
- **Optional**: `explanation`

### 23. `stats`
- **Purpose**: Large animated statistic counters.
- **Required**: `heading`, `stats` (Array of `{value, label, icon}`)

### 24. `checklist`
- **Purpose**: Interactive checkable list.
- **Required**: `heading`, `items` (Array of `{text, checked}`)

### 25. `code-diff`
- **Purpose**: Side-by-side code comparison.
- **Required**: `leftCode`, `rightCode`
- **Optional**: `leftTitle`, `leftLang`, `rightTitle`, `rightLang`
