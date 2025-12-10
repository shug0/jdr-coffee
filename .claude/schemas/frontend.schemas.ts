import { z } from 'zod'

// --- Frontend Planner ---
export const FrontendPlannerInputSchema = z.object({
  task: z.string(),
  data_shape: z.record(z.unknown()).optional(),
  stack: z.enum(['vite', 'nextjs']),
  existing_files: z.array(z.string()).optional()
})

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

// --- Code Writer ---
export const CodeWriterInputSchema = z.object({
  plan: FrontendPlannerOutputSchema,
  standards: z.enum(['orguin', 'la-gallerie', 'needacoffee']).default('orguin'),
  existing_code_context: z.array(z.object({
    file: z.string(),
    content: z.string()
  })).optional()
})

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

// --- Quality Checker ---
export const QualityCheckerInputSchema = z.object({
  files: z.array(z.string()),
  checks: z.array(z.enum(['tsc', 'biome', 'build', 'unused'])),
  auto_fix: z.boolean().default(false)
})

export const QualityCheckerOutputSchema = z.object({
  passed: z.boolean(),
  errors: z.array(z.object({
    check: z.string(),
    file: z.string().optional(),
    line: z.number().optional(),
    message: z.string(),
    severity: z.enum(['error', 'warning'])
  })),
  fixed_automatically: z.array(z.string()).optional(),
  suggestions: z.array(z.string()).optional()
})

// --- Test Writer ---
export const TestWriterInputSchema = z.object({
  components: z.array(z.string()),
  hooks: z.array(z.string()),
  coverage_target: z.number().min(0).max(1).default(0.7),
  test_type: z.enum(['unit', 'integration']).default('integration')
})

export const TestWriterOutputSchema = z.object({
  test_files: z.array(z.object({
    path: z.string(),
    tests_count: z.number()
  })),
  coverage: z.number().min(0).max(1),
  missing_coverage: z.array(z.string()).optional()
})
