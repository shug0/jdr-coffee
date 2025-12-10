import { z } from 'zod'

// Quality Checker Input Schema
export const QualityCheckerInputSchema = z.object({
  files: z.array(z.string()),
  checks: z.array(z.enum(['tsc', 'biome', 'build', 'unused'])),
  auto_fix: z.boolean().default(false)
})

// Quality Checker Output Schema
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

// Type exports
export type QualityCheckerInput = z.infer<typeof QualityCheckerInputSchema>
export type QualityCheckerOutput = z.infer<typeof QualityCheckerOutputSchema>