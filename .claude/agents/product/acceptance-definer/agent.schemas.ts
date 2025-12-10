import { z } from 'zod'

// Acceptance Definer Input Schema
export const AcceptanceDefinerInputSchema = z.object({
  specificationDocument: z.string().describe('Specification from feature-specifier'),
  technicalAssessment: z.object({
    complexity: z.enum(['low', 'medium', 'high']),
    riskLevel: z.enum(['low', 'medium', 'high']),
    estimatedEffort: z.string()
  }),
  userStories: z.array(z.object({
    id: z.string(),
    title: z.string(),
    acceptanceCriteria: z.array(z.string())
  })),
  testingRequirements: z.string().optional()
})

// Test Scenario Schema
export const TestScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  preconditions: z.array(z.string()),
  steps: z.array(z.string()),
  expectedResult: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  testType: z.enum(['unit', 'integration', 'e2e', 'manual'])
})

// Acceptance Criteria Schema
export const AcceptanceCriteriaSchema = z.object({
  userStoryId: z.string(),
  criteria: z.array(z.string()),
  validationMethod: z.enum(['automated', 'manual', 'review']),
  successMetrics: z.array(z.string()).optional()
})

// Acceptance Definer Output Schema
export const AcceptanceDefinerOutputSchema = z.object({
  testScenarios: z.array(TestScenarioSchema),
  acceptanceCriteria: z.array(AcceptanceCriteriaSchema),
  definitionOfDone: z.object({
    generalCriteria: z.array(z.string()),
    technicalCriteria: z.array(z.string()),
    qualityCriteria: z.array(z.string()),
    businessCriteria: z.array(z.string())
  }),
  testStrategy: z.string(),
  validationPlan: z.string()
})

// Type exports
export type AcceptanceDefinerInput = z.infer<typeof AcceptanceDefinerInputSchema>
export type AcceptanceDefinerOutput = z.infer<typeof AcceptanceDefinerOutputSchema>
export type TestScenario = z.infer<typeof TestScenarioSchema>
export type AcceptanceCriteria = z.infer<typeof AcceptanceCriteriaSchema>