# Claude Agents Architecture

Complete transformation to orchestrator-based multi-agent system.

## Structure

```
.claude/
├── agents/
│   ├── shared/                      # Shared utility agents
│   │   ├── orchestrator/
│   │   │   └── main-orchestrator.agent.md  # Main coordinator (Sonnet)
│   │   ├── session-intelligence/
│   │   │   └── session-intelligence.agent.md   # Session strategy (Sonnet)
│   │   ├── documentation-manager/
│   │   │   └── documentation-manager.agent.md  # Documentation coordinator (Sonnet)
│   │   └── agent-creator/          # Agent creation system (3 agents)
│   ├── research/                    # Historical research domain
│   │   ├── planner/
│   │   │   └── research-planner.agent.md       # Strategic planning (Sonnet)
│   │   ├── corpus-searcher/
│   │   │   └── corpus-searcher.agent.md        # Knowledge base search (Haiku)
│   │   ├── web-researcher/
│   │   │   └── web-researcher.agent.md         # Web search/fetch (Haiku)
│   │   ├── source-validator/
│   │   │   └── source-validator.agent.md       # Cross-validation (Haiku)
│   │   └── corpus-enricher/
│   │       └── corpus-enricher.agent.md        # Corpus updates (Haiku)
│   ├── frontend/                    # React/TypeScript development
│   │   ├── planner/
│   │   │   └── frontend-planner.agent.md       # Implementation planning (Sonnet)
│   │   ├── code-writer/
│   │   │   └── code-writer.agent.md            # Code generation (Haiku)
│   │   ├── quality-checker/
│   │   │   └── quality-checker.agent.md        # TypeScript/linting/build (Haiku)
│   │   └── test-writer/
│   │       └── test-writer.agent.md            # Test generation (Haiku)
│   ├── product/                     # Product management domain
│   │   ├── requirements-analyzer/
│   │   │   └── product-requirements-analyzer.agent.md  # Critical analysis (Sonnet)
│   │   ├── feature-specifier/
│   │   │   └── product-feature-specifier.agent.md      # Technical specs (Sonnet)
│   │   └── acceptance-definer/
│   │       └── product-acceptance-definer.agent.md     # Test scenarios (Haiku)
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
- **After**: 15 focused agents
  - 1 Main Orchestrator (Sonnet)
  - 5 Research agents (1 Sonnet + 4 Haiku)
  - 4 Frontend agents (1 Sonnet + 3 Haiku)
  - 3 Product agents (2 Sonnet + 1 Haiku)
  - 2 Shared utilities (session-intelligence, documentation-manager, both Sonnet)
  - 3 Agent-creator system agents

## Key Features

### Workflow Coordination & Validation
- **Agent schemas** define input/output contracts for each agent (.schemas.ts files)
- **Mandatory workflow sequences** prevent shortcuts and ensure quality
- **User validation gates** for technical choice approval in frontend workflows
- **Comprehensive logging** and monitoring with performance metrics

### Parallel Execution
Independent tasks (corpus search + web search) run in parallel for better performance.

### Cost Optimization
- Sonnet only for strategic planning
- Haiku for all execution tasks (much cheaper)

### Error Handling & Recovery
- Standardized error patterns with retryable flags
- Graceful degradation and fallback strategies
- Clear error reporting with actionable suggestions

### State Persistence & Session Management
- File-based session state for resuming long workflows
- Development session checkpoints for complex features
- Comprehensive workflow tracing and performance monitoring

## Usage Examples

### Research-Only Task
```
User: "What was the price of a medieval sword?"

Flow: main-orchestrator → research-planner → [corpus-searcher || web-researcher] →
      source-validator → corpus-enricher → user
```

### Frontend-Only Task
```
User: "Create a Button component with variants"

Flow: main-orchestrator → frontend-planner → [USER VALIDATION GATE] → 
      code-writer → quality-checker → test-writer → user
```

### Product-Only Task
```
User: "I need a user authentication feature"

Flow: main-orchestrator → product-requirements-analyzer → product-feature-specifier → 
      product-acceptance-definer → user
```

## Multi-Domain Workflows

### Product + Frontend Integration
The system supports complete feature development from specification to implementation:

```
User: "Add a dark mode toggle to the app"

Flow: main-orchestrator →
      [Product: requirements-analyzer → feature-specifier → acceptance-definer] →
      [Frontend: planner → USER VALIDATION → code-writer → quality-checker → test-writer] →
      documentation-manager →
      user
```

### Multi-Domain Task (Research + Frontend)
```
User: "Research medieval weapons and build a UI to display them"

Flow: main-orchestrator →
      [Research: research-planner → [corpus-searcher || web-researcher] → source-validator → corpus-enricher] →
      [Frontend: frontend-planner → USER VALIDATION → code-writer → quality-checker → test-writer] →
      documentation-manager →
      user
```

### Documentation-Only Task
```
User: "Update all documentation to reflect our new authentication system"

Flow: main-orchestrator → documentation-manager → user
```

## Workflow Monitoring & Logging

The system includes comprehensive logging and monitoring for all workflow executions.

### 📊 Viewing Workflow Execution Logs

After running any feature workflow, you can analyze the complete execution:

#### **1. Timeline View (Recommended)**
```bash
# View detailed timeline of a specific workflow
node scripts/workflow-trace.js timeline "WORKFLOW_ID"
```

**Example output:**
```
📊 Workflow Timeline: Dark Mode Feature Implementation
============================================================
Status: success | Domains: product,frontend
Duration: 45,230ms

PRODUCT PHASE:
✅ product-requirements-analyzer - Requirements analysis - 2,100ms
✅ product-feature-specifier - Feature specification - 3,400ms  
✅ product-acceptance-definer - Acceptance criteria - 1,200ms

USER VALIDATION GATE:
⏸️ frontend-planner - Waiting for user approval - (manual)

FRONTEND PHASE:
✅ code-writer - Component implementation - 8,500ms
✅ quality-checker - Code quality validation - 2,100ms
✅ test-writer - Test generation - 1,800ms

DOCUMENTATION:
✅ documentation-manager - Documentation update - 1,200ms
```

#### **2. Performance Analysis**
```bash
# Detailed performance analysis with bottlenecks
node scripts/workflow-trace.js analyze "WORKFLOW_ID"
```

#### **3. List Recent Workflows**
```bash
# Show last 10 workflows with IDs
node scripts/workflow-trace.js list 10
```

#### **4. Raw Logs**
```bash
# View chronological log file
cat .claude/state/workflow.log

# Filter specific workflow
grep "WORKFLOW_ID" .claude/state/workflow.log
```

### 🔍 Finding Your Workflow ID

**During execution**: The main-orchestrator displays the workflow ID:
```
🚀 Starting workflow: wf-frontend-1234567890
```

**After execution**: List recent workflows to find the ID you want to analyze.

### 📈 System Health Monitoring

Check overall system health and active workflows:

```bash
# Quick system status
node scripts/health-monitor.js quick

# Full system health report  
node scripts/health-monitor.js check

# Monitor workflows status
node scripts/health-monitor.js workflows
```

### 🎯 Automatic Logging

- **Agent execution** is automatically logged via hooks
- **Workflow tracing** depends on main orchestrator following directives
- **Resource coordination** tracks parallel execution
- **Performance metrics** measure each step duration

## Testing

Run schema integration tests:
```bash
npx vitest run
```

## Adding New Subagents

### Manual Process
1. Create agent file with `.agent.md` suffix in appropriate domain directory
2. Define TypeScript schemas in `agent.schemas.ts` file alongside agent
3. Add agent to main-orchestrator's available subagents list
4. Test agent integration with existing workflows

### Using agent-creator (Recommended)
Use the `agent-creator` agent to interactively design and implement new agents:
- Guides through requirements gathering
- Analyzes existing agents for patterns
- Validates against best practices
- Generates all necessary files
- Updates integration points automatically

Invoke directly or via main-orchestrator: "Create a new agent for [purpose]"

### documentation-manager (Recommended for documentation tasks)
Use the `documentation-manager` agent to maintain project documentation:
- Updates documentation after feature development
- Maintains consistency across all project docs
- Tracks documentation freshness and completeness
- Handles README, API docs, guides, and architecture documentation

Invoke directly for documentation tasks or automatically via main-orchestrator after domain workflows.

## System Architecture

This system follows the "Scripts Attached to Skills" pattern recommended by Anthropic:

- **Agent coordination** via main-orchestrator with mandatory sequences
- **Resource management** with conflict prevention and locking mechanisms  
- **Comprehensive logging** for debugging and performance analysis
- **Session management** for complex multi-domain features
- **User validation gates** ensuring control over technical decisions

## Performance Metrics

Based on actual workflow execution data:

**Research workflows**: ~650ms average
- research-planner: ~124ms  
- corpus-searcher: ~84ms
- web-researcher: ~253ms
- source-validator: ~112ms
- corpus-enricher: ~63ms

**System health**: Monitored via `scripts/health-monitor.js`
**Debugging**: Complete workflow traces via `scripts/workflow-trace.js`

## Scripts & Infrastructure

Key operational scripts in `/scripts/`:
- `workflow-trace.js` - Complete workflow execution logging
- `health-monitor.js` - System health monitoring
- `resource-check.js` - Agent conflict prevention
- `corpus-lock.js` - Concurrent access management
- `session-checkpoint.js` - Long workflow session management

---

**Version**: 2.1.0
**Last Updated**: 2025-12-11
**Architecture**: Multi-Agent Orchestrator with Scripts
