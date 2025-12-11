---
name: Agent Error Handling Standards
---

# Agent Error Handling Standards

## Standard Error Schema

All agents should return errors in this format:

```typescript
{
  status: 'error',
  kind: 'error_kind',
  detail: 'Human-readable explanation',
  suggestions: ['Action 1', 'Action 2'],  // optional
  retryable: true | false,
  context: { ... }  // optional additional info
}
```

## Error Kinds

### Tool Failures
- **`tool_failure`**: Tool execution failed (network, permission, etc.)
  - **Retryable**: Usually yes
  - **Example**: WebFetch timeout, file read permission denied

### Specification Issues
- **`spec_ambiguous`**: User request is too vague or unclear
  - **Retryable**: No (need user clarification)
  - **Example**: "Research prices" without time period or item

- **`invalid_input`**: Input doesn't match expected schema
  - **Retryable**: No (need correct input)
  - **Example**: Missing required fields, wrong data types

### Rate Limiting
- **`rate_limited`**: API or service rate limit hit
  - **Retryable**: Yes (after wait)
  - **Example**: Too many web searches in short time

### Domain-Specific Errors
- **`corpus_error`**: Issue with historical corpus
  - **Retryable**: Depends on cause
  - **Example**: Corpus index malformed, entry file missing

- **`validation_failed`**: Source validation didn't meet criteria
  - **Retryable**: Maybe (with lower standards)
  - **Example**: Only 1 source found, need minimum 2

- **`network_error`**: Network connectivity issue
  - **Retryable**: Yes
  - **Example**: WebSearch failed due to DNS

- **`build_failed`**: Frontend build/compile error
  - **Retryable**: No (need code fix)
  - **Example**: TypeScript errors, missing dependencies

- **`test_failed`**: Test execution failed
  - **Retryable**: No (need code fix)
  - **Example**: Component tests failing

## Error Handling Patterns

### In Subagents

```typescript
// When tool fails
return {
  status: 'error',
  kind: 'tool_failure',
  detail: 'Failed to read corpus index file',
  suggestions: ['Check if docs/historical-corpus/index.json exists'],
  retryable: true,
  context: { file: 'docs/historical-corpus/index.json', error: 'ENOENT' }
}

// When specification unclear
return {
  status: 'error',
  kind: 'spec_ambiguous',
  detail: 'Question lacks time period specification',
  suggestions: [
    'Add time period (e.g., medieval, ancient, 1300-1400)',
    'Specify region for better results'
  ],
  retryable: false
}

// When validation fails
return {
  status: 'error',
  kind: 'validation_failed',
  detail: 'Only found 1 source, need minimum 2 for reliability',
  suggestions: ['Lower min_reliability to "low"', 'Try different search terms'],
  retryable: true,
  context: { sources_found: 1, min_required: 2 }
}
```

### In Orchestrator

```typescript
// Retry pattern
if (result.status === 'error' && result.retryable) {
  if (result.kind === 'rate_limited') {
    wait(5000) // 5 seconds
    retry()
  } else if (result.kind === 'tool_failure') {
    retry_once()
  }
}

// Ask user pattern
if (result.status === 'error' && result.kind === 'spec_ambiguous') {
  askUser(result.detail, result.suggestions)
}

// Graceful degradation
if (result.status === 'error' && result.kind === 'corpus_error') {
  // Skip corpus, use web research only
  continueWithWebOnly()
}

// Partial results
if (corpus_enricher_failed) {
  // Still return research findings to user
  returnPartialResults({
    answer: validated_answer,
    sources: sources,
    note: 'Corpus update failed but research completed successfully'
  })
}
```

## Best Practices

### For Subagents
1. **Always include detail**: Explain what went wrong
2. **Provide actionable suggestions**: Tell user how to fix
3. **Set retryable correctly**: Be honest about whether retry will help
4. **Add context when useful**: Error codes, file paths, etc.
5. **Don't fabricate data**: Return error instead of making up answers

### For Orchestrator
1. **Retry intelligently**: Not all errors benefit from retry
2. **Wait before retry**: Especially for rate limits
3. **Ask user when needed**: Don't guess on ambiguous specs
4. **Provide partial results**: Don't fail completely if some steps succeeded
5. **Log errors**: Keep track for debugging and improvement

## Error Messages Style

✅ **Good error messages**:
- "Failed to read corpus index at docs/historical-corpus/index.json: file not found"
- "Question too vague: need time period specification (e.g., medieval, 1300-1400)"
- "Only found 1 academic source, but need minimum 2 for high reliability"

❌ **Bad error messages**:
- "Error occurred"
- "Something went wrong"
- "Invalid input"

## Examples by Domain

### Research Errors
```typescript
// Corpus not found
{
  status: 'error',
  kind: 'corpus_error',
  detail: 'Corpus index file not found at docs/historical-corpus/index.json',
  suggestions: ['Initialize corpus with empty index', 'Check file path'],
  retryable: false
}

// No sources found
{
  status: 'error',
  kind: 'validation_failed',
  detail: 'Web search found 0 academic sources for "medieval dragon prices"',
  suggestions: [
    'Try more realistic search terms',
    'Check if topic is historical (dragons are mythical)'
  ],
  retryable: false
}
```

### Frontend Errors
```typescript
// TypeScript errors
{
  status: 'error',
  kind: 'build_failed',
  detail: 'TypeScript compilation failed with 3 type errors',
  suggestions: ['Fix type errors in button.tsx:42, card.tsx:15, app.tsx:8'],
  retryable: false,
  context: {
    errors: [
      { file: 'button.tsx', line: 42, message: "Type 'string' not assignable to 'number'" }
    ]
  }
}

// Biome check failed
{
  status: 'error',
  kind: 'build_failed',
  detail: 'Biome linting found 5 unused variables',
  suggestions: ['Run `biome check --write .` to auto-fix'],
  retryable: true  // Auto-fix available
}
```
