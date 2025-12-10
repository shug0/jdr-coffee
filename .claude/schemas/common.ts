import { z } from 'zod'

// Standard error schema for all agents
export const AgentErrorSchema = z.object({
  status: z.literal('error'),
  kind: z.enum([
    'tool_failure',
    'spec_ambiguous',
    'rate_limited',
    'invalid_input',
    'corpus_error',
    'validation_failed',
    'network_error',
    'build_failed',
    'test_failed'
  ]),
  detail: z.string(),
  suggestions: z.array(z.string()).optional(),
  retryable: z.boolean(),
  context: z.record(z.string(), z.unknown()).optional()
})

export type AgentError = z.infer<typeof AgentErrorSchema>

// Success wrapper
export const AgentSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal('success'),
    data: dataSchema
  })

// Source citation
export const SourceSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  author: z.string().optional(),
  date: z.string().optional(),
  reliability: z.enum(['high', 'medium', 'low'])
})

export type Source = z.infer<typeof SourceSchema>

// Agent Creator Input/Output schemas
export const AgentCreatorInputSchema = z.object({
  purpose: z.string().describe('Primary purpose of the agent'),
  domain: z.enum(['research', 'frontend', 'shared', 'new']).describe('Domain the agent belongs to'),
  newDomainName: z.string().optional().describe('Name of new domain if domain="new"'),
  complexity: z.enum(['simple', 'moderate', 'complex']).optional().describe('Task complexity level'),
  invocation: z.enum(['orchestrator', 'direct', 'both']).default('both').describe('How agent should be invoked'),
  tools: z.array(z.string()).optional().describe('Required tools if known'),
  needsResources: z.boolean().optional().describe('Whether agent needs resource files'),
  context: z.string().optional().describe('Additional context or requirements')
})

export const AgentFileInfoSchema = z.object({
  path: z.string(),
  type: z.enum(['agent', 'schema', 'resource', 'test', 'documentation']),
  created: z.boolean()
})

export const AgentCreatorOutputSchema = z.object({
  status: z.enum(['success', 'error', 'pending_approval']),
  agentName: z.string().optional(),
  model: z.enum(['sonnet', 'haiku']).optional(),
  filesCreated: z.array(AgentFileInfoSchema).optional(),
  filesUpdated: z.array(AgentFileInfoSchema).optional(),
  nextSteps: z.array(z.string()).optional(),
  design: z.object({
    name: z.string(),
    domain: z.string(),
    model: z.enum(['sonnet', 'haiku']),
    tools: z.array(z.string()),
    role: z.string(),
    inputs: z.string(),
    outputs: z.string(),
    needsResources: z.boolean()
  }).optional(),
  error: z.string().optional()
})

export type AgentCreatorInput = z.infer<typeof AgentCreatorInputSchema>
export type AgentCreatorOutput = z.infer<typeof AgentCreatorOutputSchema>
export type AgentFileInfo = z.infer<typeof AgentFileInfoSchema>

// Documentation Manager Input/Output schemas
export const WorkCompletionSummarySchema = z.object({
  domain: z.enum(['research', 'frontend', 'product']).describe('Domain that completed work'),
  workType: z.string().describe('Type of work completed (e.g., component_creation, corpus_enrichment)'),
  summary: z.string().describe('Brief summary of work completed'),
  filesCreated: z.array(z.string()).optional().describe('List of new files created'),
  filesModified: z.array(z.string()).optional().describe('List of files modified'),
  features: z.array(z.string()).optional().describe('New features or capabilities added'),
  context: z.record(z.string(), z.unknown()).optional().describe('Additional work context')
})

export const DocumentationUpdateSchema = z.object({
  file: z.string().describe('Path to documentation file updated'),
  type: z.enum(['created', 'modified']).describe('Type of update performed'),
  reason: z.string().describe('Why this documentation was updated'),
  summary: z.string().describe('Brief description of changes made')
})

export const DocumentationManagerInputSchema = z.object({
  task: z.enum(['work_completion', 'audit', 'specific_update']).describe('Type of documentation task'),
  workCompletion: WorkCompletionSummarySchema.optional().describe('Work completion summary for work_completion task'),
  specificFiles: z.array(z.string()).optional().describe('Specific files to update for specific_update task'),
  updateReason: z.string().optional().describe('Reason for specific update'),
  auditScope: z.enum(['full', 'domain', 'files']).optional().describe('Scope for audit task'),
  targetDomain: z.enum(['research', 'frontend', 'product']).optional().describe('Target domain for domain audit')
})

export const DocumentationManagerOutputSchema = z.object({
  status: z.enum(['success', 'partial', 'error']),
  updatesPerformed: z.array(z.string()).describe('List of documentation updates performed'),
  filesModified: z.array(z.string()).describe('List of documentation files modified'),
  detailedChanges: z.array(DocumentationUpdateSchema).optional().describe('Detailed breakdown of changes'),
  warnings: z.array(z.string()).optional().describe('Any warnings or issues encountered'),
  recommendations: z.array(z.string()).optional().describe('Recommendations for future documentation'),
  auditResults: z.object({
    totalFiles: z.number(),
    upToDate: z.number(),
    needsUpdate: z.number(),
    missing: z.array(z.string())
  }).optional().describe('Results from documentation audit'),
  error: z.string().optional()
})

export type WorkCompletionSummary = z.infer<typeof WorkCompletionSummarySchema>
export type DocumentationUpdate = z.infer<typeof DocumentationUpdateSchema>
export type DocumentationManagerInput = z.infer<typeof DocumentationManagerInputSchema>
export type DocumentationManagerOutput = z.infer<typeof DocumentationManagerOutputSchema>
