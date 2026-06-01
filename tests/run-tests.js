/**
 * LECTA AI — Automated Test Suite
 * Validates the core engine modules: Alias Resolution, Schema Validation,
 * Constraint Engine, Auto-Repair system, and DSL Compilers.
 */

const assert = require('assert');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const { resolveAliases } = require('../src/core/alias-resolver');
const { validateSlideSchema } = require('../src/core/schema-validator');
const { checkConstraints, analyzePresentation } = require('../src/agent/constraint-engine');
const { repairSlide, repairPresentation } = require('../src/agent/auto-repair');
const { compileDSL } = require('../src/agent/recipe-dsl');

let passedTests = 0;
let failedTests = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(` ✅ PASS: ${desc}`);
    passedTests++;
  } catch (err) {
    console.error(` ❌ FAIL: ${desc}`);
    console.error(err);
    failedTests++;
  }
}

console.log('🧪 Starting Lecta AI Test Runner...\n');

/* ─── 1. Test DSL Compiler ─── */
it('should compile declarative DSL slides to canonical deck JSON', () => {
  const dsl = {
    title: 'DSL Test Deck',
    theme: 'terminal',
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        props: {
          title: 'Hello Lecta',
          subtitle: 'Welcome to agent DSL compiler',
          badge: 'Beta'
        }
      }
    ]
  };

  const compiled = compileDSL(dsl);
  assert.strictEqual(compiled.meta.theme, 'terminal');
  assert.strictEqual(compiled.slides[0].type, 'title'); // Compiled 'hero' -> 'title'
  assert.strictEqual(compiled.slides[0].data.heading, 'Hello Lecta');
});

/* ─── 2. Test Constraint Engine ─── */
it('should flag slides that exceed bullet list item constraints', () => {
  const bloatedSlide = {
    id: 's-bloat',
    type: 'bullets',
    data: {
      heading: 'Bloated Slide',
      items: [
        { text: 'Bullet 1' },
        { text: 'Bullet 2' },
        { text: 'Bullet 3' },
        { text: 'Bullet 4' },
        { text: 'Bullet 5' },
        { text: 'Bullet 6' },
        { text: 'Bullet 7' },
        { text: 'Bullet 8' } // Limit is 7
      ]
    }
  };

  const violations = checkConstraints(bloatedSlide);
  const tooManyItems = violations.find(v => v.type === 'EXCESSIVE_ITEMS');
  assert.ok(tooManyItems, 'Should violate item constraint count');
});

/* ─── 3. Test Auto-Repair ─── */
it('should auto-repair bloated slides and dump extras into speakerNotes', () => {
  const bloatedSlide = {
    id: 's-bloat',
    type: 'bullets',
    data: {
      heading: 'Bloated Slide',
      items: [
        { text: 'Bullet 1' },
        { text: 'Bullet 2' },
        { text: 'Bullet 3' },
        { text: 'Bullet 4' },
        { text: 'Bullet 5' },
        { text: 'Bullet 6' },
        { text: 'Bullet 7' },
        { text: 'Bullet 8' }
      ],
      speakerNotes: 'Original notes.'
    }
  };

  const repaired = repairSlide(bloatedSlide);
  assert.strictEqual(repaired.data.items.length, 7); // Clamped to 7
  assert.ok(repaired.data.speakerNotes.includes('Bullet 8'), 'Removed items backed up to notes');
});

/* ─── 4. Test Schema Validator ─── */
it('should reject invalid block definitions missing required props', () => {
  const invalidSlideDeck = {
    meta: { title: 'Invalid' },
    slides: [
      {
        id: 's-invalid',
        type: 'image',
        data: {} // 'url' is required for image blocks in registry!
      }
    ]
  };

  assert.throws(() => {
    validateSlideSchema(invalidSlideDeck, 'test-dummy.json', ROOT);
  }, /missing required prop "url"/);
});

console.log(`\n📊 TEST REPORT: ${passedTests} passed | ${failedTests} failed.`);
process.exit(failedTests > 0 ? 1 : 0);
