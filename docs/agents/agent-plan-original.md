# JDR Coffee - Complete Agent Ecosystem Plan

## Executive Summary

This plan designs a comprehensive Claude Code agent ecosystem for building **JDR Coffee** - a mobile-first RPG assistant for Game Masters. The approach is **Option B**: fresh Next.js app in `/Users/tomo/Dev/jdr/`, strategically extracting best components from the existing monorepo at `/Users/tomo/Dev/jdr-coffee/`.

**Key Strategy**: MVP-focused system that grows incrementally, avoiding over-engineering while maintaining professional quality gates.

---

## 1. AGENT ROSTER

### 1.1 Core Planning Agents

#### `jdr-strategic-planner`
- **Purpose**: Plans features with game design, mobile UX, and RPG economy considerations
- **When to use**: Before implementing any new JDR feature (scenes, items, NPCs, pricing)
- **What it returns**: Implementation plan with data models, UI mockups, pricing formulas, game balance validation
- **Model**: `sonnet` (complex game design reasoning)
- **Location**: `.claude/agents/jdr-strategic-planner.md`

**Prompt Template**:
```markdown
You are the JDR Strategic Planner for JDR Coffee.

CONTEXT:
- Mobile-first (360px width mandatory)
- Pixel art medieval-fantasy aesthetic
- French-speaking GMs
- Solo developer, MVP focus

YOUR ROLE:
1. Validate game design coherence (medieval RPG economy)
2. Plan data models (items, NPCs, scenes, contexts)
3. Design pricing formulas with multipliers
4. Ensure mobile-first UX patterns
5. Check integration with existing static data

When planning a feature, consider:
- How does it fit the medieval-fantasy theme?
- What filters/contexts apply? (period, material, quality, location, economy)
- What's the pricing formula?
- How does it render on 360px mobile?
- What static data can be reused from monorepo?

OUTPUT FORMAT:
## Feature Overview
## Data Model (TypeScript types + Zod schemas)
## Pricing Formula (with multipliers)
## UI Components Needed
## Mobile UX Considerations
## Integration Points
## Tasks Breakdown
```

#### `jdr-migration-specialist`
- **Purpose**: Extracts and adapts code from monorepo (`/Users/tomo/Dev/jdr-coffee/`) to fresh app
- **When to use**: When cherry-picking components, types, or static data from monorepo
- **What it returns**: Adapted code ready for single-app structure, with dependency adjustments
- **Model**: `sonnet` (complex refactoring)
- **Location**: `.claude/agents/jdr-migration-specialist.md`

**Prompt Template**:
```markdown
You are the JDR Migration Specialist.

YOUR ROLE:
Extract code from monorepo at /Users/tomo/Dev/jdr-coffee/ and adapt it for the fresh single Next.js app.

MONOREPO STRUCTURE:
- packages/ui/src/components/ - 53 shadcn components
- packages/static-data/ - materials, currencies, periods, genres
- packages/foundation/ - types, schemas, utils
- packages/features/ - business logic components

MIGRATION RULES:
1. Remove workspace dependencies (@jdr-coffee/ui → local imports)
2. Flatten package structure (packages/ui/src/components → components/ui)
3. Keep TypeScript strict mode
4. Preserve Zod schemas
5. Update import paths
6. Remove Turbo/monorepo configs
7. Keep shadcn components.json config

WHAT TO EXTRACT:
- UI components (selectively, not all 53)
- Static data (materials.ts, currencies.ts, periods.ts)
- Type definitions (Item, NPC, Context, Material)
- Zod schemas (for validation)
- Utility functions (price calculators)

WHAT TO SKIP:
- Monorepo tooling (turbo, pnpm workspaces)
- Multiple apps structure
- Supabase (unless explicitly needed)
- Admin features

OUTPUT:
- List files to copy
- Show adapted imports
- Note dependencies to install
- Provide migration checklist
```

### 1.2 Quality Control Agents

#### `jdr-code-reviewer`
- **Purpose**: Reviews code for React 19, TypeScript, mobile-first, and game design best practices
- **When to use**: After implementing any feature (auto-triggered via hook)
- **What it returns**: Detailed review with issues categorized by severity
- **Model**: `sonnet` (comprehensive review)
- **Location**: `.claude/agents/jdr-code-reviewer.md`

**Prompt Template**:
```markdown
You are the JDR Code Reviewer.

REVIEW CHECKLIST:

**React 19 & TypeScript**
- ✓ Proper TypeScript types (no 'any')
- ✓ React 19 best practices (use client directives, server components)
- ✓ Zod schemas for data validation
- ✓ Proper error boundaries

**Mobile-First (CRITICAL)**
- ✓ Components fit 360px width
- ✓ Touch-friendly tap targets (min 44px)
- ✓ No horizontal overflow
- ✓ Responsive font sizes

**Game Design**
- ✓ Pricing formulas use correct multipliers
- ✓ Medieval-fantasy theme consistency
- ✓ French locale strings (no hardcoded English for UI)
- ✓ Economy balance (prices make sense)

**Performance**
- ✓ No unnecessary re-renders
- ✓ Lazy loading for heavy components
- ✓ Optimized images for mobile

**Code Quality**
- ✓ No over-engineering (KISS principle)
- ✓ Clear variable names
- ✓ No unused imports/variables

OUTPUT FORMAT:
## 🔴 Critical Issues (must fix)
## 🟡 Warnings (should fix)
## 🟢 Suggestions (nice to have)
## ✅ What's Good
```

#### `jdr-build-checker`
- **Purpose**: Runs TypeScript checks and build validation
- **When to use**: Before marking feature complete (auto-triggered via stop hook)
- **What it returns**: Build status, type errors, warnings
- **Model**: `haiku` (simple task)
- **Location**: `.claude/agents/jdr-build-checker.md`

**Prompt Template**:
```markdown
You are the JDR Build Checker.

TASKS:
1. Run `npm run type-check` (or tsc --noEmit)
2. Run `npm run build` (Next.js build)
3. Check for warnings
4. Report any errors with file paths and line numbers

OUTPUT:
## Build Status: ✅ PASS / ❌ FAIL
## Type Errors: [count]
## Warnings: [count]
## Details: [errors with file:line references]
```

#### `jdr-mobile-validator`
- **Purpose**: Validates mobile viewport compliance (360px width)
- **When to use**: After implementing UI components
- **What it returns**: List of components exceeding 360px, overflow issues
- **Model**: `haiku` (simple checks)
- **Location**: `.claude/agents/jdr-mobile-validator.md`

**Prompt Template**:
```markdown
You are the JDR Mobile Validator.

VALIDATION RULES:
1. Max width: 360px
2. No horizontal scroll
3. Touch targets: min 44px × 44px
4. Font size: min 16px (prevents zoom on iOS)

CHECK:
- Component widths in CSS/Tailwind
- Fixed width values (warn if > 360px)
- Absolute positioning issues
- Grid/flex overflow

OUTPUT:
## ✅ Mobile-Safe Components
## ⚠️ Potential Issues
## ❌ Violations (with file:line)
```

### 1.3 Domain Expert Agents

#### `jdr-game-economy-expert`
- **Purpose**: Validates RPG economy, pricing formulas, and game balance
- **When to use**: When implementing pricing systems, items, or services
- **What it returns**: Economy analysis, balance recommendations, formula validation
- **Model**: `sonnet` (complex reasoning)
- **Location**: `.claude/agents/jdr-game-economy-expert.md`

**Prompt Template**:
```markdown
You are the JDR Game Economy Expert.

PRICING FORMULA:
Final Price = Base Price × Material Multiplier × Quality Multiplier × Period Multiplier × Rarity Multiplier × Location Multiplier × Economy Multiplier

VALIDATION TASKS:
1. Check multipliers are reasonable (0.1 to 10x range)
2. Verify medieval economy logic (iron < steel < mithril)
3. Ensure period consistency (Bronze Age < Medieval < Renaissance)
4. Validate rarity scaling (Common to Legendary makes sense)
5. Check location multipliers (rural < urban < capital)
6. Test edge cases (very cheap vs very expensive items)

BALANCE CHECKS:
- Can a peasant afford common items?
- Are legendary items truly rare/expensive?
- Do services scale with item prices?
- Is the economy fun for GMs?

OUTPUT:
## Economy Health: ✅ Balanced / ⚠️ Needs Tuning / ❌ Broken
## Issues Found
## Recommendations
## Test Cases Passed/Failed
```

#### `jdr-data-modeler`
- **Purpose**: Designs data models, types, and Zod schemas for JDR entities
- **When to use**: Before implementing new data structures (items, NPCs, scenes, quests)
- **What it returns**: TypeScript types, Zod schemas, example data
- **Model**: `sonnet` (structured reasoning)
- **Location**: `.claude/agents/jdr-data-modeler.md`

**Prompt Template**:
```markdown
You are the JDR Data Modeler.

DESIGN PRINCIPLES:
1. Type safety (TypeScript + Zod)
2. Context-aware (period, material, quality, location, economy)
3. Extensible (easy to add new filters)
4. Mobile-optimized (small payload)
5. French-friendly (support accented characters)

DATA ENTITIES:
- Item (weapon, armor, potion, equipment, food, service)
- NPC (name, archetype, description, stats)
- Scene (tavern, market, forge, road, dungeon)
- Context (filters that modify items/NPCs/prices)
- Quest (simple quest templates)

FOR EACH ENTITY:
1. TypeScript interface
2. Zod schema (with refinements)
3. Example data (2-3 instances)
4. Default values
5. Validation rules

OUTPUT FORMAT:
## TypeScript Types
## Zod Schemas
## Example Data
## Usage Guide
```

#### `jdr-pixel-ui-specialist`
- **Purpose**: Ensures pixel art aesthetic and mobile-first UI consistency
- **When to use**: When designing UI components
- **What it returns**: Component design recommendations, Tailwind classes, accessibility checks
- **Model**: `haiku` (simple UI guidance)
- **Location**: `.claude/agents/jdr-pixel-ui-specialist.md`

**Prompt Template**:
```markdown
You are the JDR Pixel UI Specialist.

DESIGN SYSTEM:
- Style: Pixel art medieval-fantasy
- Colors: OKLCH-based (from Tailwind config)
- Typography: Monospace for pixel feel (or pixel font)
- Icons: Lucide React (simple, clear)
- Spacing: 8px grid
- Borders: Thick, high-contrast

MOBILE-FIRST RULES:
- Width: max 360px
- Touch targets: min 44px
- Font: min 16px
- Contrast: WCAG AA minimum

COMPONENTS PATTERNS:
- Cards: Bordered, shadowed, compact
- Buttons: Chunky, pixel-style
- Inputs: Large, easy to tap
- Navigation: Bottom bar or drawer
- Scene selector: Large icons/tiles

CHECK:
- Is it readable on mobile?
- Does it feel medieval-fantasy?
- Is the contrast good?
- Are touch targets big enough?

OUTPUT:
## UI Recommendations
## Tailwind Classes
## Accessibility Score
## Mobile UX Notes
```

### 1.4 Testing Agents

#### `jdr-formula-tester`
- **Purpose**: Tests pricing formulas with edge cases
- **When to use**: After implementing/modifying pricing logic
- **What it returns**: Test results, edge cases, formula validation
- **Model**: `haiku` (simple computation)
- **Location**: `.claude/agents/jdr-formula-tester.md`

**Prompt Template**:
```markdown
You are the JDR Formula Tester.

TEST SCENARIOS:
1. Common iron sword (baseline)
2. Legendary mithril sword (high-end)
3. Peasant bread (very cheap)
4. Dragon egg (extremely rare)
5. Service in rural vs capital
6. Different periods (Bronze Age vs Renaissance)

FOR EACH TEST:
- Input values
- Expected multipliers
- Calculated price
- Is it reasonable?

EDGE CASES:
- Zero multipliers
- Negative values (should error)
- Very large multipliers (>100x)
- Missing data (should use defaults)

OUTPUT:
## Test Results: X/Y passed
## Failed Tests
## Edge Cases Handled
## Recommendations
```

#### `jdr-component-tester`
- **Purpose**: Suggests and validates component tests
- **When to use**: After creating new UI components
- **What it returns**: Test file template, test cases, coverage recommendations
- **Model**: `haiku` (simple test generation)
- **Location**: `.claude/agents/jdr-component-tester.md`

**Prompt Template**:
```markdown
You are the JDR Component Tester.

TEST FRAMEWORK: Vitest + React Testing Library

FOR EACH COMPONENT:
1. Render test (does it mount?)
2. Props test (does it accept correct props?)
3. Interaction test (clicks, inputs)
4. Edge cases (empty data, errors)
5. Mobile viewport test (360px)

OUTPUT:
- Test file path (component.test.tsx)
- Test code template
- Test cases list
- Coverage target (80%+ for critical components)
```

### 1.5 Special-Purpose Agents

#### `jdr-french-validator`
- **Purpose**: Validates French localization and grammar
- **When to use**: After adding UI text or content
- **What it returns**: Translation issues, missing accents, grammar errors
- **Model**: `haiku` (simple text check)
- **Location**: `.claude/agents/jdr-french-validator.md`

**Prompt Template**:
```markdown
You are the JDR French Validator.

CHECKS:
1. No hardcoded English in UI strings
2. Proper accents (é, è, ê, à, ç, etc.)
3. French grammar rules
4. Gender agreement (le/la, un/une)
5. Professional tone for GMs

COMMON ERRORS:
- "crée" vs "créé" vs "créée"
- "Evenement" → "Événement"
- Missing accents in capitals (É not E)

OUTPUT:
## Issues Found: [count]
## File:Line references
## Suggested Fixes
```

#### `jdr-npc-generator-expert`
- **Purpose**: Implements Markov chain name generation and NPC archetype system
- **When to use**: When building NPC generator feature
- **What it returns**: Implementation plan for Markov chains, archetype definitions, name databases
- **Model**: `sonnet` (complex algorithm)
- **Location**: `.claude/agents/jdr-npc-generator-expert.md`

**Prompt Template**:
```markdown
You are the JDR NPC Generator Expert.

NPC GENERATION SYSTEM:
1. **Names**: Markov chain based on historical/fantasy name datasets
2. **Archetypes**: Medieval roles (blacksmith, merchant, guard, noble, peasant, wizard, priest)
3. **Descriptions**: Template-based (later: Gemini AI enhancement)

MARKOV CHAIN IMPLEMENTATION:
- Train on medieval French/English name lists
- Generate pronounceable names (2-3 syllables)
- Gender-aware (masculine/feminine patterns)
- Cultural context (period-appropriate names)

ARCHETYPE SYSTEM:
- Define 20+ archetypes
- Each has: role, typical stats, personality traits, common dialogue
- Context-aware (rural vs urban, period-appropriate)

TASKS:
1. Design name generation algorithm
2. Create training datasets
3. Define archetype schemas
4. Build template system
5. Plan Gemini integration (phase 2)

OUTPUT:
## Name Generator Design
## Archetype Definitions
## Data Structures
## Implementation Steps
```

---

## 2. SKILLS CATALOG

Skills are auto-activated guidelines. They provide context-aware best practices when certain triggers are detected.

### 2.1 `jdr-frontend-guidelines`

**Purpose**: React 19, Next.js, mobile-first, pixel art principles

**Triggers**:
- Keywords: "component", "page", "UI", "interface", "render"
- File patterns: `*.tsx`, `app/**/*.tsx`, `components/**/*.tsx`
- Content patterns: `export function`, `"use client"`, `useState`

**Priority**: HIGH (always enforce mobile-first)

**Guidelines** (stored in `.claude/skills/jdr-frontend-guidelines.md`):
```markdown
# JDR Frontend Guidelines

## React 19 Best Practices
- Use "use client" directive for client components
- Server components by default (App Router)
- Async server components for data fetching
- Error boundaries for all routes

## Mobile-First (MANDATORY)
- Max width: 360px (test on iPhone SE size)
- Touch targets: 44px minimum
- Font size: 16px minimum (prevents iOS zoom)
- No horizontal scroll
- Tailwind: mobile-first breakpoints (sm:, md:, lg:)

## Pixel Art Aesthetic
- Monospace fonts or pixel fonts
- Thick borders (border-2 or border-4)
- High contrast colors
- Simple, chunky icons
- 8px spacing grid

## shadcn/ui Components
- Use existing components from components/ui
- Customize with Tailwind classes
- Keep OKLCH color variables

## TypeScript
- Strict mode enabled
- No 'any' types
- Zod schemas for all data
- Proper type inference

## Performance
- Lazy load heavy components
- Optimize images (next/image)
- Minimize client bundle
- Use server components when possible
```

**Enforcement**: Blocking (warns if violated)

### 2.2 `jdr-game-design`

**Purpose**: RPG economy, medieval context, pricing formulas

**Triggers**:
- Keywords: "price", "item", "NPC", "economy", "rarity", "material"
- File patterns: `**/pricing/**/*.ts`, `**/items/**/*.ts`, `**/data/**/*.ts`
- Content patterns: `multiplier`, `basePrice`, `Material`, `Rarity`

**Priority**: HIGH (game balance critical)

**Guidelines** (stored in `.claude/skills/jdr-game-design.md`):
```markdown
# JDR Game Design Guidelines

## Pricing Formula
Final Price = Base Price × Material × Quality × Period × Rarity × Location × Economy

**Multiplier Ranges**:
- Material: 0.5x (wood) to 10x (mithril)
- Quality: 0.5x (poor) to 3x (masterwork)
- Period: 0.8x (Bronze Age) to 2x (Renaissance)
- Rarity: 1x (common) to 100x (legendary)
- Location: 0.7x (rural) to 1.5x (capital)
- Economy: 0.5x (depression) to 2x (boom)

## Medieval Economy Logic
- Peasant daily wage: ~1 silver
- Common meal: ~5 copper
- Basic sword: ~5-10 silver
- Quality armor: ~50-100 silver
- Legendary item: 1000+ gold

## Material Hierarchy
Iron < Steel < Mithril < Adamantite < Dragon materials

## Rarity Scaling
Common → Uncommon (×2) → Rare (×5) → Epic (×20) → Legendary (×100)

## Period Appropriateness
- Bronze Age: Bronze, copper, leather
- Medieval: Iron, steel, chainmail
- Renaissance: Quality steel, firearms (if fantasy allows)

## Balance Checks
- Can peasants afford basic items? (yes)
- Are legendary items truly rare? (yes, 100x+ price)
- Do services scale with item economy? (yes)
```

**Enforcement**: Warning (suggests fixes, doesn't block)

### 2.3 `jdr-data-modeling`

**Purpose**: Item schemas, context filters, type definitions

**Triggers**:
- Keywords: "schema", "type", "interface", "zod", "validation"
- File patterns: `**/types/**/*.ts`, `**/schemas/**/*.ts`, `**/lib/**/*.ts`
- Content patterns: `z.object`, `interface`, `type`, `export type`

**Priority**: HIGH (type safety critical)

**Guidelines** (stored in `.claude/skills/jdr-data-modeling.md`):
```markdown
# JDR Data Modeling Guidelines

## Type Safety Stack
- TypeScript interfaces for structure
- Zod schemas for validation
- Type inference: `z.infer<typeof schema>`

## Context System
Every entity should support these filters:
- **Period**: Bronze Age, Iron Age, Medieval, Renaissance, etc.
- **Material**: Wood, Iron, Steel, Mithril, etc.
- **Quality**: Poor, Common, Quality, Masterwork
- **Rarity**: Common, Uncommon, Rare, Epic, Legendary
- **Location**: Rural, Town, City, Capital
- **Economy**: Depression, Normal, Boom

## Item Schema Template
```typescript
import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  nameTranslations: z.object({
    fr: z.string(),
    en: z.string().optional(),
  }),
  category: z.enum(['weapon', 'armor', 'potion', 'food', 'equipment', 'service']),
  basePrice: z.number().positive(),
  material: z.string(),
  quality: z.enum(['poor', 'common', 'quality', 'masterwork']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  period: z.string(),
  description: z.string().optional(),
});

export type Item = z.infer<typeof ItemSchema>;
```

## Default Values
Always provide sensible defaults:
- quality: 'common'
- rarity: 'common'
- period: 'medieval'
- economy: 'normal'

## Validation Rules
- Prices must be positive
- Names must be non-empty
- Enums for fixed sets (material, rarity, etc.)
- French translations required
```

**Enforcement**: Blocking (type errors must be fixed)

### 2.4 `jdr-code-extraction`

**Purpose**: How to safely migrate code from monorepo

**Triggers**:
- Keywords: "extract", "migrate", "monorepo", "import from monorepo"
- File patterns: N/A (manual trigger)
- Content patterns: `@jdr-coffee/`

**Priority**: MEDIUM (guidance, not enforcement)

**Guidelines** (stored in `.claude/skills/jdr-code-extraction.md`):
```markdown
# JDR Code Extraction Guidelines

## Monorepo Source: /Users/tomo/Dev/jdr-coffee/

## Extraction Workflow

### 1. Identify Target Files
- packages/ui/src/components/ → components/ui/
- packages/static-data/ → lib/data/
- packages/foundation/types/ → lib/types/
- packages/foundation/schemas/ → lib/schemas/

### 2. Update Import Paths
**Before** (monorepo):
```typescript
import { Button } from '@jdr-coffee/ui';
import { materials } from '@jdr-coffee/static-data';
import { ItemSchema } from '@jdr-coffee/foundation/schemas';
```

**After** (single app):
```typescript
import { Button } from '@/components/ui/button';
import { materials } from '@/lib/data/materials';
import { ItemSchema } from '@/lib/schemas/item';
```

### 3. Remove Workspace Dependencies
**package.json** - Remove:
```json
"dependencies": {
  "@jdr-coffee/ui": "workspace:*",
  "@jdr-coffee/static-data": "workspace:*"
}
```

Add actual dependencies if needed:
```json
"dependencies": {
  "@radix-ui/react-accordion": "^1.2.2",
  "lucide-react": "^0.475.0"
}
```

### 4. Flatten Structure
- No packages/ directory
- No apps/ directory
- Everything in root Next.js structure

### 5. Keep Configuration
- components.json (shadcn config)
- Tailwind config (with OKLCH colors)
- TypeScript strict mode

## Cherry-Picking Strategy
**DO Extract**:
- UI components (selectively - only what you use)
- Static data (materials, currencies, periods)
- Type definitions
- Utility functions

**DON'T Extract**:
- Turbo config
- pnpm workspace config
- Multiple apps
- Supabase (unless needed)
- Admin features
```

**Enforcement**: Guidance only

### 2.5 `jdr-mobile-ux`

**Purpose**: Mobile viewport, touch targets, responsive design

**Triggers**:
- Keywords: "mobile", "responsive", "viewport", "touch"
- File patterns: `*.tsx`, `globals.css`
- Content patterns: `w-`, `max-w-`, `@media`

**Priority**: HIGH (mobile-first mandatory)

**Guidelines** (stored in `.claude/skills/jdr-mobile-ux.md`):
```markdown
# JDR Mobile UX Guidelines

## Viewport: 360px × 800px (iPhone SE)

## Critical Rules
1. **Max Width**: 360px
   - Use `max-w-sm` (384px) or `max-w-[360px]`
   - Test on small screens

2. **Touch Targets**: 44px minimum
   - Buttons: `h-11` (44px) or larger
   - Icon buttons: `w-11 h-11`
   - Links: adequate padding

3. **Font Sizes**: 16px minimum
   - Prevents iOS zoom on input focus
   - Body text: `text-base` (16px)
   - Small text: never below 14px

4. **No Horizontal Scroll**
   - Use `overflow-x-hidden` on container
   - Test all breakpoints
   - Watch for fixed widths

## Layout Patterns
- **Navigation**: Bottom tab bar or hamburger
- **Cards**: Full-width, stacked vertically
- **Forms**: One column, large inputs
- **Modals**: Full-screen on mobile

## Testing Checklist
- [ ] Renders at 360px width
- [ ] All buttons are 44px+ tall
- [ ] Text is 16px+ (no zoom)
- [ ] No horizontal overflow
- [ ] Touch targets have spacing (not cramped)
```

**Enforcement**: Blocking (mobile-first is mandatory)

### 2.6 `jdr-testing-standards`

**Purpose**: Testing patterns and coverage expectations

**Triggers**:
- Keywords: "test", "spec", "coverage", "vitest"
- File patterns: `*.test.tsx`, `*.test.ts`, `*.spec.ts`
- Content patterns: `describe`, `it(`, `expect(`

**Priority**: MEDIUM (tests encouraged, not blocking for MVP)

**Guidelines** (stored in `.claude/skills/jdr-testing-standards.md`):
```markdown
# JDR Testing Standards

## Framework: Vitest + React Testing Library

## Coverage Targets
- **Critical paths**: 80%+ (pricing formulas, data validation)
- **UI components**: 60%+ (render + interactions)
- **Utils**: 80%+ (pure functions)

## Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ComponentName', () => {
  it('renders without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const { user } = render(<ComponentName />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

## What to Test
1. **Pricing formulas**: Edge cases, multipliers, validation
2. **Data validation**: Zod schemas with invalid data
3. **Components**: Render, props, interactions
4. **Utils**: Pure functions, transformations

## What NOT to Test (MVP)
- E2E flows (save for later)
- Visual regression (not critical)
- Performance benchmarks (optimize later)
```

**Enforcement**: Guidance only (MVP focus)

---

## 3. HOOKS PIPELINE

Hooks automate quality checks at specific lifecycle events.

### 3.1 `user-prompt-submit` Hook

**Purpose**: Auto-activate skills based on user intent

**When**: Before processing user request

**Configuration** (`.claude/hooks/user-prompt-submit.sh`):
```bash
#!/bin/bash

# Parse user message for keywords
USER_MESSAGE="$1"

# Skill activation logic
if echo "$USER_MESSAGE" | grep -iqE "(component|UI|interface|page|render)"; then
  echo "[SKILL] jdr-frontend-guidelines"
fi

if echo "$USER_MESSAGE" | grep -iqE "(price|pricing|economy|item|material|rarity)"; then
  echo "[SKILL] jdr-game-design"
fi

if echo "$USER_MESSAGE" | grep -iqE "(type|schema|zod|interface|validation)"; then
  echo "[SKILL] jdr-data-modeling"
fi

if echo "$USER_MESSAGE" | grep -iqE "(extract|migrate|monorepo|import.*jdr-coffee)"; then
  echo "[SKILL] jdr-code-extraction"
fi

if echo "$USER_MESSAGE" | grep -iqE "(mobile|responsive|viewport|360px)"; then
  echo "[SKILL] jdr-mobile-ux"
fi

# Exit successfully (non-blocking)
exit 0
```

**Behavior**: Non-blocking (just loads skills)

### 3.2 `stop` Hook

**Purpose**: Quality gates before marking work complete

**When**: User stops Claude or says "done"

**Configuration** (`.claude/hooks/stop.sh`):
```bash
#!/bin/bash

echo "🔍 Running JDR Coffee quality checks..."

# 1. TypeScript check
echo "⚙️  Checking TypeScript..."
npm run type-check 2>&1 | head -n 20
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found. Fix before continuing."
  exit 1
fi

# 2. Build check
echo "🏗️  Running build..."
npm run build 2>&1 | tail -n 10
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Fix errors."
  exit 1
fi

# 3. Mobile viewport check (heuristic)
echo "📱 Checking for mobile violations..."
VIOLATIONS=$(grep -rn "w-\[4[0-9][0-9]\|w-\[5[0-9][0-9]\|w-\[6[0-9][0-9]" app/ components/ 2>/dev/null | grep -v "max-w" | wc -l)
if [ "$VIOLATIONS" -gt 0 ]; then
  echo "⚠️  Warning: Found $VIOLATIONS potential width violations (>360px)"
  grep -rn "w-\[4[0-9][0-9]\|w-\[5[0-9][0-9]\|w-\[6[0-9][0-9]" app/ components/ | grep -v "max-w" | head -n 5
fi

# 4. French locale check
echo "🇫🇷 Checking for hardcoded English..."
ENGLISH_STRINGS=$(grep -rn '"[A-Z][a-z]* [a-z]*"' app/ components/ 2>/dev/null | grep -v "className" | grep -v "import" | wc -l)
if [ "$ENGLISH_STRINGS" -gt 5 ]; then
  echo "⚠️  Warning: Found $ENGLISH_STRINGS potential hardcoded English strings"
fi

echo "✅ Quality checks complete!"
exit 0
```

**Behavior**: Blocking on TS/build errors, warnings for mobile/French

### 3.3 `post-tool-use` Hook (Optional for MVP)

**Purpose**: Track edited files for auto-review

**When**: After Edit/Write tool use

**Configuration** (`.claude/hooks/post-tool-use.sh`):
```bash
#!/bin/bash

TOOL_NAME="$1"
FILE_PATH="$2"

if [ "$TOOL_NAME" = "Edit" ] || [ "$TOOL_NAME" = "Write" ]; then
  echo "📝 File modified: $FILE_PATH" >> .claude/edited-files.log
fi

exit 0
```

**Behavior**: Non-blocking (just logging)

---

## 4. SLASH COMMANDS

Custom workflows for common tasks.

### 4.1 `/jdr-plan`

**Purpose**: Create dev docs for new JDR feature

**Location**: `.claude/commands/jdr-plan.md`

```markdown
Create a comprehensive development plan for this JDR Coffee feature.

STEPS:
1. Use the jdr-strategic-planner agent to analyze the feature
2. Create dev docs in .claude/dev-docs/[feature-name]/
3. Files to create:
   - plan.md (implementation strategy)
   - context.md (relevant files, data models, dependencies)
   - tasks.md (checklist of todos)

OUTPUT:
Return a summary of the plan and link to the dev docs folder.
```

### 4.2 `/extract-from-monorepo`

**Purpose**: Extract code from monorepo to current app

**Location**: `.claude/commands/extract-from-monorepo.md`

```markdown
Extract code from the monorepo at /Users/tomo/Dev/jdr-coffee/ and adapt it for this app.

ARGUMENTS:
- $1: What to extract (e.g., "ui components", "materials data", "item schema")

STEPS:
1. Use the jdr-migration-specialist agent
2. Identify source files in monorepo
3. Copy and adapt code
4. Update import paths
5. Install any missing dependencies
6. Test that it works

Example usage:
/extract-from-monorepo materials data
/extract-from-monorepo button component
```

### 4.3 `/add-scene`

**Purpose**: Generate new scene with items and services

**Location**: `.claude/commands/add-scene.md`

```markdown
Add a new scene to JDR Coffee (e.g., Tavern, Market, Forge).

ARGUMENTS:
- $1: Scene name (French)

STEPS:
1. Create scene data file in lib/data/scenes/
2. Define scene-specific items
3. Define scene-specific services
4. Add scene icon and UI
5. Update scene selector/navigation

Example:
/add-scene Auberge
/add-scene Marché
```

### 4.4 `/add-item`

**Purpose**: Generate new item with all context variants

**Location**: `.claude/commands/add-item.md`

```markdown
Add a new item to JDR Coffee with context-aware pricing.

ARGUMENTS:
- $1: Item name (French)
- $2: Category (weapon, armor, potion, food, equipment, service)

STEPS:
1. Create item definition with base price
2. Define material variants (if applicable)
3. Define quality levels
4. Define rarity
5. Calculate pricing formula
6. Add French description
7. Test pricing across contexts

Example:
/add-item "Épée longue" weapon
/add-item "Potion de soin" potion
```

### 4.5 `/test-pricing`

**Purpose**: Validate pricing formula for item

**Location**: `.claude/commands/test-pricing.md`

```markdown
Test the pricing formula for an item across different contexts.

ARGUMENTS:
- $1: Item ID or name

STEPS:
1. Use jdr-formula-tester agent
2. Run pricing across:
   - All materials
   - All periods
   - All qualities
   - Different locations/economies
3. Show results table
4. Flag any unreasonable prices

Example:
/test-pricing "Épée longue"
```

### 4.6 `/review-mobile-ux`

**Purpose**: Review UI for mobile compliance

**Location**: `.claude/commands/review-mobile-ux.md`

```markdown
Review the app for mobile UX compliance (360px viewport).

STEPS:
1. Use jdr-mobile-validator agent
2. Check all components for:
   - Width violations (>360px)
   - Touch target sizes (<44px)
   - Font sizes (<16px)
   - Horizontal overflow
3. Generate report with violations

OUTPUT:
List of files with mobile UX issues and recommended fixes.
```

### 4.7 `/dev-docs`

**Purpose**: Generate or update dev docs for current work

**Location**: `.claude/commands/dev-docs.md`

```markdown
Create or update dev docs for the current task.

ARGUMENTS:
- $1: Task name (kebab-case)

STEPS:
1. Create .claude/dev-docs/[task-name]/ directory
2. Generate:
   - plan.md (what you're building)
   - context.md (relevant files, dependencies)
   - tasks.md (checklist)
3. Update as you work

Example:
/dev-docs npc-generator
/dev-docs pricing-engine
```

### 4.8 `/check-build`

**Purpose**: Run TypeScript and build checks

**Location**: `.claude/commands/check-build.md`

```markdown
Run TypeScript type checking and Next.js build.

STEPS:
1. Run `npm run type-check`
2. Run `npm run build`
3. Report errors with file:line references
4. Suggest fixes if errors found

This is automatically run by the stop hook, but you can run manually.
```

---

## 5. DEV DOCS STRUCTURE

Dev docs help maintain context across sessions (inspired by PM2 workflow from feedback).

### Directory Structure

```
.claude/
├── dev-docs/
│   ├── npc-generator/
│   │   ├── plan.md
│   │   ├── context.md
│   │   └── tasks.md
│   ├── pricing-engine/
│   │   ├── plan.md
│   │   ├── context.md
│   │   └── tasks.md
│   └── scene-selector/
│       ├── plan.md
│       ├── context.md
│       └── tasks.md
```

### File Templates

#### `plan.md`

```markdown
# [Feature Name] - Implementation Plan

## Overview
Brief description of what this feature does.

## Requirements
- Functional requirements
- Non-functional requirements (performance, mobile, etc.)

## Design
- Data models (TypeScript types)
- UI components
- Pricing formulas (if applicable)

## Implementation Steps
1. Step 1
2. Step 2
3. ...

## Testing
- Unit tests
- Integration tests
- Manual testing scenarios

## Dependencies
- External packages
- Internal modules
- Data sources (from monorepo?)

## Open Questions
- Decisions needed
- Clarifications needed
```

#### `context.md`

```markdown
# [Feature Name] - Context

## Critical Files
- /path/to/file1.ts - Description
- /path/to/file2.tsx - Description

## Data Models
```typescript
// Relevant types/schemas
```

## Related Features
- Links to other features that interact with this one

## External Resources
- Monorepo files to extract
- Documentation links
- API references (Gemini, if applicable)

## Progress
- What's done
- What's in progress
- What's next
```

#### `tasks.md`

```markdown
# [Feature Name] - Task Checklist

## Phase 1: Planning
- [ ] Define data models
- [ ] Design UI mockups
- [ ] Validate pricing formulas

## Phase 2: Implementation
- [ ] Create types and schemas
- [ ] Implement core logic
- [ ] Build UI components
- [ ] Wire up data flow

## Phase 3: Testing
- [ ] Unit tests for formulas
- [ ] Component tests
- [ ] Mobile viewport validation
- [ ] Manual testing

## Phase 4: Polish
- [ ] French translations
- [ ] Error handling
- [ ] Performance optimization
- [ ] Documentation
```

### When to Use Dev Docs

**Create dev docs when**:
- Feature is complex (3+ days of work)
- Multiple sessions needed
- Context needs to be preserved
- Collaboration with future self

**Skip dev docs when**:
- Quick fix or small feature (<1 day)
- Self-contained, no context needed
- Prototype/experiment

---

## 6. DOCUMENTATION STRATEGY

### 6.1 Core Documentation Files

#### `CLAUDE.md` (Root)

**Purpose**: Project-specific Claude Code commands and workflows

```markdown
# JDR Coffee - Claude Code Guide

## Quick Commands
- `/jdr-plan` - Plan new feature with dev docs
- `/extract-from-monorepo [what]` - Extract code from monorepo
- `/add-scene [name]` - Create new scene
- `/add-item [name] [category]` - Create new item
- `/test-pricing [item]` - Validate pricing formula
- `/review-mobile-ux` - Check mobile compliance
- `/check-build` - Run TS + build checks

## Agent Roster
- `jdr-strategic-planner` - Feature planning
- `jdr-migration-specialist` - Extract from monorepo
- `jdr-code-reviewer` - Code quality checks
- `jdr-game-economy-expert` - Pricing validation
- `jdr-data-modeler` - Schema design
- `jdr-mobile-validator` - Mobile UX checks

## Workflow
1. Plan: `/jdr-plan` or use `jdr-strategic-planner`
2. Implement: Write code with auto-activated skills
3. Extract (if needed): `/extract-from-monorepo`
4. Review: `jdr-code-reviewer` agent
5. Validate: `/check-build` or stop hook
6. Test: `/test-pricing` for economy features

## Skills (Auto-Active)
- `jdr-frontend-guidelines` - React 19, mobile-first
- `jdr-game-design` - Pricing formulas, economy
- `jdr-data-modeling` - Types, schemas
- `jdr-code-extraction` - Monorepo migration
- `jdr-mobile-ux` - 360px viewport rules

## Mobile-First Rules (CRITICAL)
- Max width: 360px
- Touch targets: 44px minimum
- Font size: 16px minimum
- No horizontal scroll
```

#### `PROJECT_KNOWLEDGE.md`

**Purpose**: Architecture, data flows, conventions

```markdown
# JDR Coffee - Project Knowledge

## Architecture

### Tech Stack
- Next.js 16 (App Router, React 19)
- TypeScript (strict mode)
- Tailwind CSS (OKLCH colors)
- shadcn/ui components
- Zustand (state management)
- Zod (validation)

### Directory Structure
```
/
├── app/                # Next.js App Router
│   ├── (scenes)/       # Scene routes (tavern, market, etc.)
│   └── layout.tsx
├── components/
│   ├── ui/             # shadcn components
│   └── features/       # Business logic components
├── lib/
│   ├── data/           # Static data (materials, currencies, etc.)
│   ├── types/          # TypeScript types
│   ├── schemas/        # Zod schemas
│   └── utils/          # Utilities
└── hooks/              # Custom React hooks
```

## Data Models

### Item System
- Base item + context variants
- Context filters: period, material, quality, rarity, location, economy
- Dynamic pricing with multipliers

### Pricing Formula
```
Final Price = Base Price × Material × Quality × Period × Rarity × Location × Economy
```

### NPC System
- Markov chain name generation
- Archetype-based (blacksmith, merchant, guard, etc.)
- Optional AI descriptions (Gemini - phase 2)

## Conventions

### Naming
- Files: kebab-case (item-card.tsx)
- Components: PascalCase (ItemCard)
- Functions: camelCase (calculatePrice)
- Constants: UPPER_SNAKE_CASE (DEFAULT_PERIOD)

### Imports
- Absolute imports with @ alias (@/components, @/lib)
- Group imports: external, internal, types

### French Translations
- All UI strings in French
- English fallbacks optional
- Use translation object pattern

## Monorepo Reference
Source: /Users/tomo/Dev/jdr-coffee/

**Extractable Assets**:
- packages/ui → components/ui
- packages/static-data → lib/data
- packages/foundation/types → lib/types
- packages/foundation/schemas → lib/schemas
```

#### `TROUBLESHOOTING.md`

**Purpose**: Common issues and solutions

```markdown
# JDR Coffee - Troubleshooting

## TypeScript Errors

### "Cannot find module '@/...'"
**Cause**: Path alias not configured
**Fix**: Check tsconfig.json has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Type 'X' is not assignable to type 'Y'"
**Cause**: Missing Zod validation or wrong type
**Fix**: Ensure Zod schema matches TypeScript type

## Build Errors

### "Module not found: Can't resolve '...'"
**Cause**: Missing dependency or wrong import path
**Fix**:
1. Check package.json
2. Run `npm install`
3. Verify import path

### "Hydration failed"
**Cause**: Server/client mismatch (common with localStorage)
**Fix**: Use `useEffect` for client-only code

## Mobile UX Issues

### Horizontal scroll on mobile
**Cause**: Element width > 360px
**Fix**: Use `max-w-[360px]` or `max-w-sm`

### Text too small, iOS zooms on input focus
**Cause**: Font size < 16px
**Fix**: Use `text-base` or larger (16px+)

## Pricing Issues

### Prices are unreasonably high/low
**Cause**: Multiplier error
**Fix**:
1. Check multiplier ranges (see jdr-game-design skill)
2. Run `/test-pricing` to validate
3. Use `jdr-game-economy-expert` agent

### Material multiplier not applied
**Cause**: Missing material data
**Fix**: Check lib/data/materials.ts has entry for material

## Monorepo Extraction Issues

### Import errors after extraction
**Cause**: Workspace import paths not updated
**Fix**: Replace `@jdr-coffee/X` with local `@/...` paths

### Missing dependencies
**Cause**: Dependencies were in workspace package
**Fix**: Install explicitly in package.json

## French Locale Issues

### Missing accents
**Cause**: Hardcoded strings without proper encoding
**Fix**: Use UTF-8, add accents (é, è, ê, à, ç)

### English showing in UI
**Cause**: Hardcoded English strings
**Fix**: Replace with French translations
```

### 6.2 Game Design Reference

#### `GAME_DESIGN.md` (Optional, for MVP later)

**Purpose**: RPG economy rules, medieval context, item databases

```markdown
# JDR Coffee - Game Design Reference

## Medieval Economy

### Historical Prices (for reference)
- Peasant daily wage: ~1 silver
- Loaf of bread: ~5 copper
- Chicken: ~10 copper
- Basic meal (tavern): ~5-10 copper
- Room (tavern): ~5 silver/night
- Ale (pint): ~2 copper
- Basic sword: ~5-10 silver
- Quality armor: ~50-100 silver

### Material Values
- Wood: 0.5x (cheap, common)
- Iron: 1x (baseline)
- Steel: 2x (quality)
- Mithril: 5x (fantasy rare)
- Adamantite: 10x (legendary)

### Rarity Economics
- Common: 1x (everyone has access)
- Uncommon: 2x (limited availability)
- Rare: 5x (hard to find)
- Epic: 20x (very rare)
- Legendary: 100x (unique items)

## NPC Archetypes

### Common Roles
1. Blacksmith - Weapon/armor vendor
2. Merchant - General goods
3. Innkeeper - Food, lodging
4. Guard - Security, quests
5. Peasant - Labor, information
6. Noble - Quests, politics
7. Wizard - Magic items, knowledge
8. Priest - Healing, blessings

### Name Generation
- Markov chains trained on medieval French/English names
- Gender-aware patterns
- 2-3 syllables for readability

## Scenes

### Tavern (Auberge)
- Items: Food, drinks
- Services: Lodging, stabling, rumors
- NPCs: Innkeeper, patrons, bard

### Market (Marché)
- Items: Food, clothing, tools, animals
- Services: Trade, information
- NPCs: Merchants, farmers, guards

### Forge (Forgeron)
- Items: Weapons, armor, tools
- Services: Repairs, custom work
- NPCs: Blacksmith, apprentice

### Road (Grand Chemin)
- Items: Travel supplies, maps
- Services: Caravan, guides
- NPCs: Travelers, merchants, bandits
```

---

## 7. IMPLEMENTATION PHASES

### Phase 0: Foundation (Week 1)

**Goal**: Set up agent ecosystem and extract core assets from monorepo

**Tasks**:
1. Create `.claude/` directory structure:
   ```
   .claude/
   ├── agents/       (12 agent files)
   ├── skills/       (6 skill files)
   ├── hooks/        (3 hook scripts)
   ├── commands/     (8 slash command files)
   └── dev-docs/     (empty, created as needed)
   ```

2. Write all agent prompts (`.claude/agents/*.md`)
3. Write all skill guidelines (`.claude/skills/*.md`)
4. Create hook scripts (`.claude/hooks/*.sh`, make executable)
5. Write slash commands (`.claude/commands/*.md`)
6. Create core documentation:
   - `CLAUDE.md`
   - `PROJECT_KNOWLEDGE.md`
   - `TROUBLESHOOTING.md`

7. Extract from monorepo:
   - `/extract-from-monorepo "materials data"`
   - `/extract-from-monorepo "currencies data"`
   - `/extract-from-monorepo "periods data"`
   - `/extract-from-monorepo "button component"` (test extraction)

**Validation**:
- [ ] All agents exist and have correct prompts
- [ ] Skills auto-activate on keyword triggers
- [ ] Hooks run successfully (test with dummy edits)
- [ ] Slash commands work
- [ ] Materials/currencies data extracted and importable
- [ ] TypeScript compiles without errors

### Phase 1: Core Data & Pricing (Week 2)

**Goal**: Implement data models and pricing engine

**Workflow**:
1. `/jdr-plan` → Create dev docs for pricing-engine
2. Use `jdr-data-modeler` agent to design schemas
3. Implement:
   - Item schema (Zod + TypeScript)
   - Context schema (period, material, quality, etc.)
   - Pricing calculator function
4. `/test-pricing` → Validate formulas
5. Use `jdr-game-economy-expert` to review balance
6. `jdr-code-reviewer` for final check

**Deliverables**:
- `lib/types/item.ts`
- `lib/schemas/item.ts`
- `lib/utils/pricing.ts`
- `lib/data/items.json` (base items)
- Unit tests for pricing

**Validation**:
- [ ] Pricing formula works across all contexts
- [ ] Tests pass (`/check-build`)
- [ ] Economy balanced (peasants can afford basics, legendary items are expensive)

### Phase 2: Scene Selector UI (Week 3)

**Goal**: Build scene navigation (mobile-first)

**Workflow**:
1. `/jdr-plan` → Dev docs for scene-selector
2. Use `jdr-strategic-planner` to design UX
3. Use `jdr-pixel-ui-specialist` for design guidance
4. Implement:
   - Scene data (`lib/data/scenes.ts`)
   - Scene selector component (`components/features/scene-selector.tsx`)
   - Scene routes (`app/(scenes)/tavern`, `app/(scenes)/market`, etc.)
5. `/review-mobile-ux` → Validate 360px compliance
6. Test on mobile viewport

**Deliverables**:
- Scene selector UI
- 4 scenes (Tavern, Market, Forge, Road)
- Mobile-optimized navigation

**Validation**:
- [ ] Renders correctly at 360px
- [ ] Touch targets are 44px+
- [ ] Navigation works on mobile
- [ ] Pixel art aesthetic is consistent

### Phase 3: Item Generator (Week 4)

**Goal**: Context-aware item generation with pricing

**Workflow**:
1. `/jdr-plan` → Dev docs for item-generator
2. Use `jdr-strategic-planner` to design feature
3. Implement:
   - Item generator component
   - Context filters UI (period, material, quality selectors)
   - Dynamic pricing display
   - Item list/grid view
4. `/add-item "Épée longue" weapon` → Test command
5. `/test-pricing "Épée longue"` → Validate pricing
6. `jdr-code-reviewer` for review

**Deliverables**:
- Item generator UI
- Context filter controls
- Dynamic pricing display
- 20+ base items with variants

**Validation**:
- [ ] Items generate with correct pricing
- [ ] Filters work (period, material, quality)
- [ ] Mobile-optimized
- [ ] French translations complete

### Phase 4: NPC Generator (Week 5-6)

**Goal**: Markov chain name generation + archetype system

**Workflow**:
1. `/jdr-plan` → Dev docs for npc-generator
2. Use `jdr-npc-generator-expert` agent to design
3. Implement:
   - Markov chain algorithm
   - Name training datasets (French medieval names)
   - Archetype definitions (20+ roles)
   - NPC generator component
   - NPC card display
4. Test with various archetypes
5. `jdr-code-reviewer` for review

**Deliverables**:
- Markov chain name generator
- 20+ NPC archetypes
- NPC generator UI
- Name databases (masculine/feminine)

**Validation**:
- [ ] Names are pronounceable
- [ ] Archetypes are distinct
- [ ] Mobile-optimized
- [ ] Fast generation (<100ms)

### Phase 5: Services & Polish (Week 7)

**Goal**: Scene-specific services, French polish, final QA

**Workflow**:
1. Add services by scene:
   - Tavern: Lodging, meals, stabling
   - Forge: Repairs, custom work
   - Market: Trade
2. French locale validation (`jdr-french-validator`)
3. Mobile UX final pass (`/review-mobile-ux`)
4. Performance optimization
5. Error handling
6. Final build check (`/check-build`)

**Deliverables**:
- Services system
- 100% French UI
- Mobile-optimized
- Error boundaries
- Production build

**Validation**:
- [ ] All services have correct pricing
- [ ] No English strings in UI
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Mobile UX perfect (360px)

### Phase 6: Gemini Integration (Future - Optional)

**Goal**: AI-generated NPC descriptions

**Workflow**:
1. `/jdr-plan` → Dev docs for gemini-integration
2. Implement Gemini API client
3. Create prompt templates for NPC descriptions
4. Add "Generate Description" button to NPC cards
5. Handle API errors gracefully
6. Test with various archetypes

**Note**: This is Phase 2 of the roadmap, not critical for MVP.

---

## 8. SUCCESS METRICS

### Agent Effectiveness
- **Planning**: Dev docs created for all major features
- **Code Quality**: <5 TS errors per feature, all caught by hooks
- **Mobile Compliance**: 100% of components fit 360px
- **Economy Balance**: All pricing formulas validated by expert agent
- **French Quality**: No hardcoded English in UI

### Developer Experience
- **Speed**: Agents reduce planning time by 50%+
- **Context**: Dev docs preserve context across sessions
- **Automation**: Hooks catch 80%+ of errors before manual testing
- **Extraction**: Monorepo code reused successfully

### MVP Completion
- [ ] 4 scenes implemented (Tavern, Market, Forge, Road)
- [ ] 50+ items with context-aware pricing
- [ ] NPC generator with Markov names
- [ ] Services by scene
- [ ] 100% French UI
- [ ] Mobile-perfect (360px viewport)
- [ ] TypeScript strict, zero errors
- [ ] Production build successful

---

## 9. AGENT INVOCATION EXAMPLES

### Example 1: Planning a New Scene

```
User: "I want to add a dungeon scene with treasure generation"

Claude: Let me plan this feature.
[Invokes jdr-strategic-planner agent]

Agent returns:
- Dungeon data model (rooms, monsters, traps)
- Treasure generator design (loot tables, rarity)
- Pricing for dungeon services (guides, maps)
- Mobile UX for dungeon navigation
- Integration with existing item system

Claude: Created dev docs at .claude/dev-docs/dungeon-scene/
Ready to implement. Should I proceed?
```

### Example 2: Extracting from Monorepo

```
User: /extract-from-monorepo "accordion component"

Claude: [Invokes jdr-migration-specialist agent]

Agent returns:
- Source: /Users/tomo/Dev/jdr-coffee/packages/ui/src/components/accordion.tsx
- Dependencies: @radix-ui/react-accordion
- Adapted code with local imports
- Installation command: npm install @radix-ui/react-accordion

Claude: Extracted accordion component to components/ui/accordion.tsx
Updated imports, installed dependencies. Ready to use!
```

### Example 3: Validating Pricing

```
User: /test-pricing "Épée en mithril légendaire"

Claude: [Invokes jdr-formula-tester agent]

Agent returns:
- Base Price: 10 silver (longsword)
- Material: Mithril (×5)
- Quality: Masterwork (×3)
- Rarity: Legendary (×100)
- Period: Medieval (×1)
- Location: Capital (×1.5)
- Economy: Normal (×1)
- Final Price: 22,500 gold

Claude: Pricing validated. Legendary mithril sword is appropriately expensive
for a unique item. Economy balance: ✅ PASS
```

### Example 4: Mobile UX Review

```
User: /review-mobile-ux

Claude: [Invokes jdr-mobile-validator agent]

Agent returns:
- ✅ Scene selector: 360px width, touch targets 48px
- ✅ Item cards: Responsive, no overflow
- ⚠️ NPC modal: Title font is 14px (should be 16px+)
- ❌ Price calculator: Fixed width 400px (exceeds 360px)

Claude: Found 2 issues:
1. components/npc-modal.tsx:23 - Font too small
2. components/price-calculator.tsx:15 - Width exceeds mobile

Fix these before deploying.
```

---

## 10. FINAL NOTES

### Philosophy
- **MVP-focused**: Build just enough, no over-engineering
- **Incremental growth**: System scales as features are added
- **Quality gates**: Automated checks prevent regressions
- **Context preservation**: Dev docs maintain continuity
- **Mobile-first**: Non-negotiable, enforced by hooks

### What Makes This System Special
1. **JDR-specific agents**: Game economy expert, pricing validator, NPC specialist
2. **Monorepo extraction**: Reuse existing work efficiently
3. **Mobile enforcement**: 360px mandatory, validated automatically
4. **French-first**: Locale validation built-in
5. **Solo dev optimized**: No CI/CD complexity, just what's needed

### Growth Path
- **Phase 0-1**: Foundation + pricing (2 weeks)
- **Phase 2-3**: UI + items (2 weeks)
- **Phase 4-5**: NPCs + polish (3 weeks)
- **Phase 6+**: AI integration, multi-universe expansion

### Maintenance
- Update agents when patterns change
- Refine skills based on false positives
- Adjust hooks if they become too strict/loose
- Grow dev docs library as features increase

---

## APPENDIX: Quick Reference

### Most Used Agents
1. `jdr-strategic-planner` - Feature planning
2. `jdr-migration-specialist` - Extract from monorepo
3. `jdr-code-reviewer` - Quality checks
4. `jdr-game-economy-expert` - Pricing validation

### Most Used Commands
1. `/jdr-plan` - Plan feature
2. `/extract-from-monorepo` - Get code from monorepo
3. `/test-pricing` - Validate economy
4. `/check-build` - TS + build check

### Critical Skills
1. `jdr-frontend-guidelines` - Mobile-first rules
2. `jdr-game-design` - Pricing formulas
3. `jdr-data-modeling` - Type safety

### Key Hooks
1. `stop` - Build validation before marking complete
2. `user-prompt-submit` - Auto-activate skills

---

**END OF PLAN**
