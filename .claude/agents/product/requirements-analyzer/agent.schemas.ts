import { z } from 'zod'

// Requirements Analyzer Input Schema
export const RequirementsAnalyzerInputSchema = z.object({
  userRequest: z.string().describe('Original user request or feature description'),
  context: z.string().optional().describe('Additional context'),
  domainHint: z.string().optional().describe('Specific domain or area'),
  stakeholders: z.array(z.string()).optional().describe('Key stakeholders')
})

// Requirement Gap Schema
export const RequirementGapSchema = z.object({
  category: z.enum(['functional', 'non-functional', 'technical', 'user-experience']),
  description: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  questions: z.array(z.string()),
  suggestions: z.array(z.string()).optional()
})

// Requirements Analyzer Output Schema
export const RequirementsAnalyzerOutputSchema = z.object({
  status: z.enum(['complete', 'needs_clarification', 'error']),
  validatedRequirements: z.string().optional(),
  identifiedGaps: z.array(RequirementGapSchema),
  clarifyingQuestions: z.array(z.string()),
  businessLogicValidation: z.object({
    passed: z.boolean(),
    issues: z.array(z.string()),
    recommendations: z.array(z.string())
  }),
  readyForSpecification: z.boolean()
})

// Type exports
export type RequirementsAnalyzerInput = z.infer<typeof RequirementsAnalyzerInputSchema>
export type RequirementsAnalyzerOutput = z.infer<typeof RequirementsAnalyzerOutputSchema>
export type RequirementGap = z.infer<typeof RequirementGapSchema>