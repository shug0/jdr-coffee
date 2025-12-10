import { z } from 'zod'

// Import FrontendPlanner output schema for reference
const FrontendPlannerOutputSchema = z.object({
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

// Code Writer Input Schema
export const CodeWriterInputSchema = z.object({
  plan: FrontendPlannerOutputSchema,
  standards: z.enum(['orguin', 'la-gallerie', 'needacoffee']).default('orguin'),
  existing_code_context: z.array(z.object({
    file: z.string(),
    content: z.string()
  })).optional()
})

// Code Writer Output Schema
export const CodeWriterOutputSchema = z.object({
  files_created: z.array(z.object({
    path: z.string(),
    lines: z.number()
  })),
  files_modified: z.array(z.object({
    path: z.string(),
    changes: z.string()
  })),
  imports_added: z.array(z.string()),
  summary: z.string()
})

// Type exports
export type CodeWriterInput = z.infer<typeof CodeWriterInputSchema>
export type CodeWriterOutput = z.infer<typeof CodeWriterOutputSchema>