---
name: Agent Creation Best Practices
---

# Agent Creation Best Practices

## Anthropic Official Guidelines

### Format & Structure
- **Markdown format**: Optimal for Claude agents (40% fewer tokens than XML)
- **Token efficiency**: Markdown ratio 1.0, JSON 1.05, XML 1.80
- **Focused scope**: Keep agent files < 200 lines for clarity
- **Progressive disclosure**: Main file < 500 lines, use resource files for extensive details
- **Structured metadata**: YAML frontmatter for config
- **Clear sections**: Consistent Role → Input → Output → Directives pattern

### File Size Guidelines
| Agent Type | Main File Size | Resource Files | Total |
|------------|----------------|----------------|-------|
| **Simple executor** | 50-100 lines | 0-1 files | < 200 lines |
| **Standard agent** | 100-200 lines | 1-2 files | < 500 lines |
| **Complex planner** | 150-300 lines | 2-5 files | < 800 lines |

### Agent Architecture Patterns
- **Separation of concerns**: Each agent has single, focused responsibility
- **Token compression**: Sub-agents distill findings, parent receives condensed output
- **Parallel execution**: Independent tasks run concurrently for speed
- **Context isolation**: Each sub-agent maintains own context to avoid pollution

### Quality Standards
- **Clarity**: Agent purpose clear from first 3 lines
- **Specificity**: Directives use imperative language (ALWAYS/NEVER/PREFER)
- **Examples**: Include 1-3 concrete usage examples
- **Validation**: Clear input/output contracts

## Real-World Practices

- **Planning is king**: Use planning mode for complex tasks
- **Specialized agents**: Small army of focused agents > monolithic agents
- **Model optimization**: Sonnet for strategy, Haiku for execution
- **Hooks system**: Auto-activation, build checking, quality reminders

## Directory Structure

### Agent File Placement
```
.claude/agents/
├── shared/                      # Cross-domain utilities
│   └── {module}/
│       ├── {name}.agent.md
│       └── resources/
├── research/                    # Historical research domain
├── frontend/                    # React/TypeScript domain
├── product/                     # Product management domain
└── resources/
    ├── shared/
    ├── research/
    ├── frontend/
    └── product/
```

### Naming Conventions
- **Domain specialists**: `{domain}-{purpose}` (e.g., `frontend-planner`)
- **Action-based**: `{action}-{object}` (e.g., `corpus-searcher`, `code-writer`)
- **Coordinators**: `{role}` (e.g., `orchestrator`)
- **Module components**: `{module}-{role}` (e.g., `agent-creator-planner`)