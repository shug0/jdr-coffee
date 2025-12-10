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
│   └── resources/                   # Shared knowledge
│       ├── shared/
│       │   ├── error-handling.md   # Standard error schemas
│       │   └── best-practices-feedbacks.md  # Real-world best practices
│       ├── research/
│       │   ├── sources-reference.md
│       │   └── taxonomy.md
│       └── frontend/
│           └── standards-reference.md
├── schemas/                         # Zod IO contracts
│   ├── common.ts                   # Shared types (AgentError, Source)
│   ├── research.schemas.ts         # Research agent IO
│   ├── frontend.schemas.ts         # Frontend agent IO
│   ├── index.ts                    # Barrel export
│   └── __tests__/                  # Integration tests
│       ├── research.schemas.test.ts
│       └── frontend.schemas.test.ts
├── state/                           # Session persistence
│   ├── research-sessions/
│   └── frontend-sessions/
└── settings.local.json              # Permissions

```

## Agent Count

- **Before**: 2 monolithic agents (400+ lines each)
- **After**: 11 focused agents
  - 1 Orchestrator (Sonnet)
  - 5 Research subagents (1 Sonnet + 4 Haiku)
  - 4 Frontend subagents (1 Sonnet + 3 Haiku)
  - 1 Shared utility (agent-creator, Sonnet)

## Key Features

### Typed IO Contracts
All agent inputs/outputs are validated with Zod schemas for type safety and runtime validation.

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

### Multi-Domain Task
```
User: "Research medieval weapons and build a UI to display them"

Flow: orchestrator →
      [Research: planner → searcher → validator → enricher] →
      [Frontend: planner → code-writer → quality-checker] →
      user
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
- Token usage: ≤150% of old agents

## Architecture Documentation

See `/Users/tomo/.claude/plans/iridescent-whistling-wreath.md` for complete architecture analysis and implementation plan.

---

**Version**: 2.0.0
**Last Updated**: 2025-12-09
**Architecture**: Orchestrator + Subagents
