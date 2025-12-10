import { z } from 'zod'

// Test Writer Input Schema
export const TestWriterInputSchema = z.object({
  components: z.array(z.string()),
  hooks: z.array(z.string()),
  coverage_target: z.number().min(0).max(1).default(0.7),
  test_type: z.enum(['unit', 'integration']).default('integration')
})

// Test Writer Output Schema
export const TestWriterOutputSchema = z.object({
  test_files: z.array(z.object({
    path: z.string(),
    tests_count: z.number()
  })),
  coverage: z.number().min(0).max(1),
  missing_coverage: z.array(z.string()).optional()
})

// Type exports
export type TestWriterInput = z.infer<typeof TestWriterInputSchema>
export type TestWriterOutput = z.infer<typeof TestWriterOutputSchema>