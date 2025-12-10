import { z } from 'zod'

// Dependencies from common taxonomy
export const ThemeSchema = z.enum([
  'economy', 'warfare', 'technology', 'culture', 'society',
  'architecture', 'religion', 'politics', 'science', 'daily-life'
])

// Research Planner Input Schema
export const ResearchPlannerInputSchema = z.object({
  question: z.string().min(5),
  context: z.string().optional(),
  domain_hint: ThemeSchema.optional()
})

// Research Planner Output Schema  
export const ResearchPlannerOutputSchema = z.object({
  strategy: z.enum(['corpus_only', 'corpus_first', 'web_only', 'comparative']),
  steps: z.array(z.object({
    agent: z.string(),
    parallel_with: z.array(z.string()).optional(),
    inputs: z.record(z.string(), z.unknown())
  })),
  estimated_reliability: z.enum(['high', 'medium', 'low']),
  parallel_opportunities: z.array(z.string())
})

// Type exports
export type ResearchPlannerInput = z.infer<typeof ResearchPlannerInputSchema>
export type ResearchPlannerOutput = z.infer<typeof ResearchPlannerOutputSchema>
export type Theme = z.infer<typeof ThemeSchema>