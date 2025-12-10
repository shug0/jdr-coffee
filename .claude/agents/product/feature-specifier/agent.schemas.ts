import { z } from 'zod'

// Feature Specifier Input Schema
export const FeatureSpecifierInputSchema = z.object({
  validatedRequirements: z.string().describe('Validated requirements from requirements analyzer'),
  technicalConstraints: z.array(z.string()).optional(),
  existingArchitecture: z.string().optional()
})

// User Story Schema
export const UserStorySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
  priority: z.enum(['low', 'medium', 'high']),
  estimatedPoints: z.number().optional()
})

// API Contract Schema
export const ApiContractSchema = z.object({
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  requestSchema: z.record(z.unknown()).optional(),
  responseSchema: z.record(z.unknown()).optional(),
  description: z.string()
})

// Feature Specifier Output Schema
export const FeatureSpecifierOutputSchema = z.object({
  userStories: z.array(UserStorySchema),
  apiContracts: z.array(ApiContractSchema),
  uiComponentSpecs: z.array(z.object({
    name: z.string(),
    description: z.string(),
    props: z.record(z.unknown()).optional(),
    states: z.array(z.string()).optional()
  })),
  specificationDocument: z.string(),
  technicalNotes: z.string().optional()
})

// Type exports
export type FeatureSpecifierInput = z.infer<typeof FeatureSpecifierInputSchema>
export type FeatureSpecifierOutput = z.infer<typeof FeatureSpecifierOutputSchema>
export type UserStory = z.infer<typeof UserStorySchema>
export type ApiContract = z.infer<typeof ApiContractSchema>