import { z } from 'zod'

// Import agent schemas for structured outputs

// Research domain
import { ResearchPlannerOutputSchema } from '../../research/planner/agent.schemas'
import { CorpusSearcherOutputSchema } from '../../research/corpus-searcher/agent.schemas'
import { WebResearcherOutputSchema } from '../../research/web-researcher/agent.schemas'
import { SourceValidatorOutputSchema } from '../../research/source-validator/agent.schemas'
import { CorpusEnricherOutputSchema } from '../../research/corpus-enricher/agent.schemas'

// Frontend domain
import { FrontendPlannerOutputSchema } from '../../frontend/planner/agent.schemas'
import { CodeWriterOutputSchema } from '../../frontend/code-writer/agent.schemas'
import { QualityCheckerOutputSchema } from '../../frontend/quality-checker/agent.schemas'
import { TestWriterOutputSchema } from '../../frontend/test-writer/agent.schemas'

// Product domain
import { ProductPlannerOutputSchema } from '../../product/planner/agent.schemas'
import { RequirementsAnalyzerOutputSchema } from '../../product/requirements-analyzer/agent.schemas'
import { FeatureSpecifierOutputSchema } from '../../product/feature-specifier/agent.schemas'
import { FeasibilityAssessorOutputSchema } from '../../product/feasibility-assessor/agent.schemas'
import { AcceptanceDefinerOutputSchema } from '../../product/acceptance-definer/agent.schemas'

// Shared domain
import { 
  SessionCreateOutputSchema, 
  SessionUpdateOutputSchema, 
  SessionResumeOutputSchema 
} from '../session-manager/agent.schemas'

// Orchestrator coordination schemas
export const OrchestrationStepSchema = z.object({
  agent: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  parallel_with: z.array(z.string()).optional(),
  inputs: z.record(z.string(), z.unknown()),
  output: z.unknown().optional(),
  error: z.string().optional(),
  execution_time_ms: z.number().optional()
})

export const OrchestrationResultSchema = z.object({
  workflow_id: z.string(),
  domain: z.enum(['research', 'frontend', 'product', 'multi-domain']),
  steps_completed: z.array(OrchestrationStepSchema),
  final_result: z.unknown(),
  total_execution_time_ms: z.number(),
  parallel_efficiency: z.number().optional(),
  validation_results: z.array(z.object({
    agent: z.string(),
    input_valid: z.boolean(),
    output_valid: z.boolean(),
    schema_errors: z.array(z.string()).optional()
  }))
})

// Schema mapping for structured outputs
export const AGENT_OUTPUT_SCHEMAS = {
  // Research domain
  'research-planner': ResearchPlannerOutputSchema,
  'corpus-searcher': CorpusSearcherOutputSchema,
  'web-researcher': WebResearcherOutputSchema,
  'source-validator': SourceValidatorOutputSchema,
  'corpus-enricher': CorpusEnricherOutputSchema,
  
  // Frontend domain
  'frontend-planner': FrontendPlannerOutputSchema,
  'code-writer': CodeWriterOutputSchema,
  'quality-checker': QualityCheckerOutputSchema,
  'test-writer': TestWriterOutputSchema,
  
  // Product domain
  'product-planner': ProductPlannerOutputSchema,
  'requirements-analyzer': RequirementsAnalyzerOutputSchema,
  'feature-specifier': FeatureSpecifierOutputSchema,
  'feasibility-assessor': FeasibilityAssessorOutputSchema,
  'acceptance-definer': AcceptanceDefinerOutputSchema,
  
  // Shared domain
  'session-manager': SessionCreateOutputSchema // Note: session-manager has multiple output schemas
} as const

// Type exports
export type OrchestrationStep = z.infer<typeof OrchestrationStepSchema>
export type OrchestrationResult = z.infer<typeof OrchestrationResultSchema>
export type AgentName = keyof typeof AGENT_OUTPUT_SCHEMAS