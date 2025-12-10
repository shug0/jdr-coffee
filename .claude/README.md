# Claude Agents Architecture

Complete transformation to orchestrator-based multi-agent system.

## Structure

```
.claude/
├── agents/
│   ├── orchestrator.md              # Main coordinator (Sonnet)
│   ├── research/                    # Historical research domain
│   │   ├── planner.md              # Strategic planning (Sonnet)
│   │   ├── corpus-searcher.md      # Knowledge base search (Haiku)
│   │   ├── web-researcher.md       # Web search/fetch (Haiku)
│   │   ├── source-validator.md     # Cross-validation (Haiku)
│   │   └── corpus-enricher.md      # Corpus updates (Haiku)
│   ├── frontend/                    # React/TypeScript development
│   │   ├── planner.md              # Implementation planning (Sonnet)
│   │   ├── code-writer.md          # Code generation (Haiku)
│   │   ├── quality-checker.md      # TypeScript/linting/build (Haiku)
│   │   └── test-writer.md          # Test generation (Haiku)
│   ├── product/                     # Product management domain
│   │   ├── planner.md              # PM workflow coordination (Sonnet)
│   │   ├── requirements-analyzer.md # Critical requirements analysis (Sonnet)
│   │   ├── feature-specifier.md    # Technical specification writing (Haiku)
│   │   ├── feasibility-assessor.md # Technical feasibility analysis (Haiku)
│   │   └── acceptance-definer.md   # Test scenarios and acceptance criteria (Haiku)
│   ├── documentation-manager.md     # Central documentation coordinator (Sonnet)
│   └── resources/                   # Shared knowledge
│       ├── shared/
│       │   ├── error-handling.md   # Standard error schemas
│       │   └── best-practices-feedbacks.md  # Real-world best practices
│       ├── research/
│       │   ├── sources-reference.md
│       │   └── taxonomy.md
│       └── frontend/
│           └── standards-reference.md
├── schemas/                         # Zod IO contracts & validation
│   ├── common.ts                   # Shared types (AgentError, Source)
│   ├── research.schemas.ts         # Research agent IO
│   ├── frontend.schemas.ts         # Frontend agent IO
│   ├── product.schemas.ts          # Product management agent IO
│   ├── validation.ts               # Schema validation system
│   ├── orchestrator-validator.ts   # Orchestrator validation wrapper
│   ├── index.ts                    # Barrel export
│   └── __tests__/                  # Integration tests
│       ├── research.schemas.test.ts
│       ├── frontend.schemas.test.ts
│       ├── validation.test.ts
│       └── orchestrator-integration.test.ts
├── validation-monitor.ts            # Validation activity monitoring
├── validation-test-runner.ts        # Integration testing tool
├── state/                           # Session persistence
│   ├── research-sessions/
│   └── frontend-sessions/
└── settings.local.json              # Permissions

```

## Agent Count

- **Before**: 2 monolithic agents (400+ lines each)
- **After**: 17 focused agents
  - 1 Orchestrator (Sonnet)
  - 5 Research subagents (1 Sonnet + 4 Haiku)
  - 4 Frontend subagents (1 Sonnet + 3 Haiku)
  - 5 Product subagents (2 Sonnet + 3 Haiku)
  - 2 Shared utilities (agent-creator, documentation-manager, both Sonnet)

## Key Features

### Schema Validation & Type Safety
- **Zod schemas** for all agent inputs/outputs with runtime validation
- **Integrated validation** in orchestrator workflow with schema compliance checking
- **Validation monitoring** system to track schema adherence across agent executions
- **Error recovery** with detailed schema violation reporting

### Parallel Execution
Independent tasks (corpus search + web search) run in parallel for better performance.

### Cost Optimization
- Sonnet only for strategic planning
- Haiku for all execution tasks (much cheaper)

### Error Handling
Standardized error schema with retryable flags and actionable suggestions.

### State Persistence
File-based session state for resuming long workflows.

## Usage Examples

### Research-Only Task
```
User: "What was the price of a medieval sword?"

Flow: orchestrator → research-planner → [corpus-searcher || web-researcher] →
      source-validator → corpus-enricher → user
```

### Frontend-Only Task
```
User: "Create a Button component with variants"

Flow: orchestrator → frontend-planner → code-writer → quality-checker → user
```

### Product-Only Task
```
User: "I need a user authentication feature"

Flow: orchestrator → product-planner → requirements-analyzer → feature-specifier → 
      feasibility-assessor → acceptance-definer → user
```

## Validation Integration

### Schema Validation System

The orchestrator includes comprehensive schema validation for all agent interactions:

**Validation Layers:**
1. **Input Validation**: All agent inputs validated against Zod schemas before dispatch
2. **Output Validation**: All agent outputs validated after execution
3. **Error Recovery**: Schema violations provide actionable error details
4. **Monitoring**: Validation activity tracked for debugging and quality assurance

**Integration Approach:**
- Orchestrator includes validation directives in natural language instructions
- Schema contracts defined for every agent input/output
- Validation integration guide provides practical implementation patterns
- Monitoring system tracks validation compliance across all agent executions

### Testing Validation Integration

**Run integration tests:**
```bash
npx ts-node .claude/validation-test-runner.ts
```

**Check validation status:**
```typescript
import { getValidationReport, isValidationWorking } from './.claude/validation-monitor'

// Check if validation is active
const status = isValidationWorking()
console.log('Validation active:', status.isActive)

// Get comprehensive validation report  
const report = getValidationReport()
console.log('Validation stats:', report.summary)
```

**Verify orchestrator integration:**
- Orchestrator includes schema validation directives
- Validation integration guide provides implementation patterns
- Schema contracts documented for all agents
- Monitoring system tracks validation compliance

**Key Files:**
- `.claude/agents/orchestrator.md` - Enhanced with validation directives
- `.claude/agents/resources/shared/validation-integration-guide.md` - Implementation patterns
- `.claude/validation-monitor.ts` - Activity monitoring system
- `.claude/validation-test-runner.ts` - Integration testing tool

### Multi-Domain Task (Product + Frontend)
```
User: "Add a dark mode toggle to the app"

Flow: orchestrator →
      [Product: planner → requirements-analyzer → feature-specifier → feasibility-assessor → acceptance-definer] →
      [Frontend: planner → code-writer → quality-checker] →
      documentation-manager →
      user
```

### Multi-Domain Task (Research + Frontend)
```
User: "Research medieval weapons and build a UI to display them"

Flow: orchestrator →
      [Research: planner → searcher → validator → enricher] →
      [Frontend: planner → code-writer → quality-checker] →
      documentation-manager →
      user
```

### Documentation-Only Task
```
User: "Update all documentation to reflect our new authentication system"

Flow: orchestrator → documentation-manager → user
```

## Testing

Run schema integration tests:
```bash
npx vitest run
```

## Adding New Subagents

### Manual Process
1. Create agent file in appropriate domain directory
2. Define Zod schemas in `schemas/{domain}.schemas.ts`
3. Add tests in `schemas/__tests__/`
4. Register in orchestrator's available subagents list

### Using agent-creator (Recommended)
Use the `agent-creator` agent to interactively design and implement new agents:
- Guides through requirements gathering
- Analyzes existing agents for patterns
- Validates against best practices
- Generates all necessary files
- Updates integration points automatically

Invoke directly or via orchestrator: "Create a new agent for [purpose]"

### documentation-manager (Recommended for documentation tasks)
Use the `documentation-manager` agent to maintain project documentation:
- Updates documentation after feature development
- Maintains consistency across all project docs
- Tracks documentation freshness and completeness
- Handles README, API docs, guides, and architecture documentation

Invoke directly for documentation tasks or automatically via orchestrator after domain workflows.

## Migration Notes

Old agents archived in `.claude/agents/_archive/`:
- `historical-research.md.bak`
- `frontend-expert.md.bak`
- `resources/` (old structure)

Can be deleted once confident in new architecture.

## Success Metrics

Target performance:
- Corpus search: <1s
- Research workflow: <60s
- Frontend code generation: <30s
- Product specification workflow: <120s
- Token usage: ≤150% of old agents

Quality metrics:
- Requirements clarity score: >8/10
- Specification completeness: >95%
- Implementation success rate: >90%

## Architecture Documentation

See `/Users/tomo/.claude/plans/iridescent-whistling-wreath.md` for complete architecture analysis and implementation plan.

---

**Version**: 2.0.0
**Last Updated**: 2025-12-09
**Architecture**: Orchestrator + Subagents
