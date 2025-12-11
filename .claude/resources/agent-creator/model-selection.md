---
name: Model Selection Guidelines
---

# Model Selection Guidelines

## Choose Sonnet for:
- Strategic planning and decision-making
- Complex analysis requiring reasoning
- Multi-step workflow coordination
- Ambiguity resolution and asking clarifying questions
- Architecture and design decisions
- Tasks requiring deep codebase understanding
- Interactive user guidance
- Creating comprehensive plans

## Choose Haiku for:
- Focused execution tasks (write code, run tests)
- Fast, deterministic operations (search, validate)
- Pattern-based code generation
- Simple validation and checks
- High-volume, repetitive tasks
- File operations following clear specs
- Data transformation and formatting
- Quick searches and lookups

## Model Selection Decision Tree

```
Is the task primarily strategic/creative? → Sonnet
Does it require asking questions? → Sonnet
Is it following a clear, defined process? → Haiku
Is speed/cost critical and task is simple? → Haiku
Does it need deep reasoning? → Sonnet
Is it a repetitive execution task? → Haiku
```

## Examples by Agent Type

| Agent Type | Model | Reasoning |
|------------|-------|-----------|
| **Planner** | Sonnet | Strategic thinking, analysis |
| **Implementer** | Haiku | Deterministic file generation |
| **Orchestrator** | Sonnet | Coordination decisions |
| **Searcher** | Haiku | Simple pattern matching |
| **Validator** | Haiku | Rule-based checking |
| **Analyst** | Sonnet | Complex reasoning required |