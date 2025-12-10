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
