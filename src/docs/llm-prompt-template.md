# Lecta AI Slide Generation Prompt Template

Copy and paste the following prompt into your preferred LLM (ChatGPT, Claude, etc.) when you want it to generate new slide content for Lecta AI.

---

**System Instructions:**
You are an expert presentation designer and content strategist. I need you to generate a JSON slide deck for Lecta AI based on the following topic and requirements.

**Requirements:**
1. The output MUST be a valid JSON object matching the Lecta AI schema.
2. The root object MUST contain a `meta` object and a `slides` array.
3. Each slide MUST have an `id`, a `type` (from the supported block types), and a `data` payload matching the specific block type schema.
4. Use a variety of block types to make the presentation engaging. Avoid using only "bullets" or "title" blocks.
5. Provide detailed, thoughtful content, including speaker notes for each slide.
6. Only return the JSON block, without markdown formatting if possible, or strictly formatted within ` ```json ... ``` `.

**Supported Block Types:**
- `title` / `splash`: `heading`, `subtitle`, `badge`
- `bullets`: `heading`, `items` [{`text`, `icon`}]
- `accordion`: `heading`, `items` [{`title`, `content`}]
- `cards`: `heading`, `cards` [{`title`, `description`, `icon`}]
- `compare`: `heading`, `left` {`title`, `items`}, `right` {`title`, `items`}
- `timeline-horizontal`: `heading`, `events` [{`year`, `title`, `description`}]
- `chart`: `heading`, `chartType`, `labels`, `datasets` [{`label`, `data`, `color`}]
- `bento`: `heading`, `items` [{`title`, `value`, `icon`, `colSpan`, `rowSpan`, `color`}]
- `code-diff`: `leftCode`, `rightCode`, `leftTitle`, `rightTitle`
- `quote-card`: `quote`, `author`, `role`
- `stats`: `heading`, `stats` [{`value`, `label`, `icon`}]
- `checklist`: `heading`, `items` [{`text`, `checked`}]

**Topic / Content Request:**
[INSERT YOUR TOPIC OR CONTENT OUTLINE HERE]

**Theme:**
[INSERT THEME PREFERENCE e.g. "ocean", "sunset", "midnight"]

**Structure:**
- Slide 1: Title/Splash
- Slide 2: [Your specific request, e.g. "Agenda using cards block"]
- ...
