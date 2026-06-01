# Lecta AI Slide Engine — Block Guide

This document catalogs the **28 premium block types** supported by the Lecta AI registry-first architecture, including safe property zones, compatible layouts, and behavioral characteristics.

---

## 1. Content Blocks

### `title`
- **Category**: Content
- **Description**: Big bold opener/hero slide.
- **Safe Props**: `heading`, `subtitle`, `badge`
- **Aesthetic Tip**: Ideal for opening chapter slides. Matches well with the `wipe-right` transition.

### `bullets`
- **Category**: Content
- **Description**: Standard lists with details.
- **Safe Props**: `heading`, `icon`, `items` (Array of `{ text, detail }`)
- **Constraint**: Max 7 items. Too many items will be auto-archived to presenter notes.

### `timeline-horizontal`
- **Category**: Content
- **Description**: Chronological horizontal track card layout.
- **Safe Props**: `heading`, `icon`, `events` (Array of `{ year, title, desc }`)
- **Default Animation**: `stagger` stagger-reveal.

### `quote-card`
- **Category**: Content
- **Description**: Full-screen testimonials or featured quotes.
- **Safe Props**: `heading`, `quote`, `author`, `role`, `avatarUrl`
- **Aesthetic Tip**: Best used with `fade` or `zoom-in` transition.

---

## 2. Interaction Blocks

### `accordion`
- **Category**: Interaction
- **Description**: Collapsible accordion panels for deep-dive examples.
- **Safe Props**: `heading`, `icon`, `items` (Array of `{ title, content, example }`)
- **Limit**: Max 6 tabs.

### `quiz` & `advanced-quiz`
- **Category**: Interaction
- **Description**: Assessment questions with instant options grading and overlay feedback.
- **Safe Props**: `heading`, `icon`, `questions` (Array of `{ question, options, correct, explanation }`)
- **Constraint**: `correct` option index must be a numeric integer index matching options array indices (0-based).

### `checklist`
- **Category**: Interaction
- **Description**: Task checklist tracker.
- **Safe Props**: `heading`, `items` (Array of `{ id, text, completed }`)

---

## 3. Data & Structure Blocks

### `chart`
- **Category**: Data
- **Description**: Interactive SVG chart renderer.
- **Safe Props**: `heading`, `chartType` (`bar`, `line`, `pie`), `labels`, `datasets`

### `bento`
- **Category**: Structure
- **Description**: Beautiful grid block cards in grid layouts.
- **Safe Props**: `heading`, `gridTemplate`, `items` (Array of `{ title, content, size, icon, badge, bgGradient }`)

### `split`
- **Category**: Structure
- **Description**: Double column container housing sub-blocks.
- **Safe Props**: `heading`, `left` (Sub-block), `right` (Sub-block)
- **Supported Sub-blocks**: `text`, `bullets`, `code`, `image`, `math`, `mermaid`.
