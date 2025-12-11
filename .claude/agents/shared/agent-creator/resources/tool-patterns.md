# Tool Selection Patterns

## Common Tool Patterns

| Agent Type | Typical Tools | Example |
|------------|---------------|---------|
| **Planner** | Read, Glob | research-planner, frontend-planner |
| **Executor** | Write, Edit | code-writer, corpus-enricher |
| **Searcher** | Read, Grep, Glob | corpus-searcher |
| **Validator** | Read | source-validator, quality-checker |
| **Coordinator** | Task | orchestrator |
| **Hybrid** | Read, Write, Glob | documentation-manager |

## Tool Selection Rules

- **Start minimal**: Only include tools the agent actually needs
- **Read is common**: Almost all agents need to read files
- **Write/Edit for output**: Only if agent creates/modifies files
- **Glob for discovery**: When agent needs to find files by pattern
- **Grep for search**: When agent searches file contents
- **Task for delegation**: Only for coordinator agents
- **Bash sparingly**: Only if agent needs to run commands

## Tool Combinations

### Analysis Pattern
```
Read + Glob + Grep
- Read: specific files
- Glob: find files by pattern
- Grep: search content
```

### Creation Pattern
```
Read + Write + Edit
- Read: understand existing
- Write: create new files
- Edit: modify existing
```

### Coordination Pattern
```
Task + Read
- Task: delegate to sub-agents
- Read: understand context
```

## Guidelines

- **Minimize tools**: Each tool adds complexity
- **Match purpose**: Tools should align with agent role
- **Consider cost**: More tools = larger context
- **Think workflow**: What does agent actually do?