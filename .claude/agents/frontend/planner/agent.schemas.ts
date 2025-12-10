import { z } from 'zod'

// Frontend Planner Input Schema
export const FrontendPlannerInputSchema = z.object({
  task: z.string(),
  data_shape: z.record(z.unknown()).optional(),
  stack: z.enum(['vite', 'nextjs']),
  existing_files: z.array(z.string()).optional()
})

// Frontend Planner Output Schema
export const FrontendPlannerOutputSchema = z.object({
  files: z.array(z.object({
    path: z.string(),
    type: z.enum(['component', 'hook', 'page', 'schema', 'type', 'util']),
    action: z.enum(['create', 'modify', 'read'])
  })),
  components: z.array(z.object({
    name: z.string(),
    path: z.string(),
    props: z.record(z.unknown()).optional()
  })),
  hooks: z.array(z.object({
    name: z.string(),
    type: z.enum(['query', 'mutation', 'custom']),
    path: z.string()
  })),
  dependencies: z.array(z.string()).optional(),
  implementation_order: z.array(z.string())
})

// Type exports
export type FrontendPlannerInput = z.infer<typeof FrontendPlannerInputSchema>
export type FrontendPlannerOutput = z.infer<typeof FrontendPlannerOutputSchema>