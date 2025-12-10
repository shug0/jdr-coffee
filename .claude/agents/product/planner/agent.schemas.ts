import { z } from 'zod'

// Product Planner Input Schema
export const ProductPlannerInputSchema = z.object({
  request: z.string().describe('User request or feature description'),
  context: z.string().optional().describe('Additional context'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
})

// Workflow Step Schema
export const WorkflowStepSchema = z.object({
  agent: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()).optional(),
  estimatedTime: z.string().optional()
})

// Product Planner Output Schema
export const ProductPlannerOutputSchema = z.object({
  workflowType: z.enum(['simple', 'standard', 'complex']),
  workflow: z.array(WorkflowStepSchema),
  estimatedDuration: z.string(),
  riskLevel: z.enum(['low', 'medium', 'high']),
  recommendations: z.array(z.string()),
  nextAgent: z.string()
})

// Type exports
export type ProductPlannerInput = z.infer<typeof ProductPlannerInputSchema>
export type ProductPlannerOutput = z.infer<typeof ProductPlannerOutputSchema>
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>