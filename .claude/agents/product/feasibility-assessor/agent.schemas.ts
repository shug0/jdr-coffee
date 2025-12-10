import { z } from 'zod'

// Feasibility Assessor Input Schema
export const FeasibilityAssessorInputSchema = z.object({
  specificationDocument: z.string().describe('Specification from feature-specifier'),
  technicalConstraints: z.array(z.string()).optional(),
  timeConstraints: z.string().optional(),
  resourceConstraints: z.string().optional()
})

// Feasibility Assessor Output Schema
export const FeasibilityAssessorOutputSchema = z.object({
  overallFeasibility: z.enum(['feasible', 'feasible-with-changes', 'not-feasible']),
  complexity: z.enum(['low', 'medium', 'high']),
  estimatedEffort: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  technicalChallenges: z.array(z.string()),
  suggestedAlternatives: z.array(z.string()).optional(),
  implementationStrategy: z.object({
    approach: z.string(),
    phases: z.array(z.string()),
    dependencies: z.array(z.string()),
    mitigationStrategies: z.array(z.string())
  }),
  resourceRequirements: z.object({
    developers: z.number(),
    timeframe: z.string(),
    specializedSkills: z.array(z.string()).optional()
  })
})

// Type exports
export type FeasibilityAssessorInput = z.infer<typeof FeasibilityAssessorInputSchema>
export type FeasibilityAssessorOutput = z.infer<typeof FeasibilityAssessorOutputSchema>