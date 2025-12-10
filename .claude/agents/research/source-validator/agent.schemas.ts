import { z } from 'zod'

// Source Schema (from common)
export const SourceSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  author: z.string().optional(),
  date: z.string().optional(),
  reliability: z.enum(['high', 'medium', 'low'])
})

// Source Validator Input Schema
export const SourceValidatorInputSchema = z.object({
  sources: z.array(SourceSchema),
  raw_findings: z.array(z.object({
    source_url: z.string(),
    excerpt: z.string()
  })),
  min_reliability: z.enum(['high', 'medium', 'low']).default('high')
})

// Source Validator Output Schema
export const SourceValidatorOutputSchema = z.object({
  validated_sources: z.array(SourceSchema),
  reliability: z.enum(['high', 'medium', 'low']),
  consensus: z.object({
    has_consensus: z.boolean(),
    agreement_level: z.number().min(0).max(1),
    divergences: z.array(z.string()).optional()
  }),
  validation_notes: z.string()
})

// Type exports
export type SourceValidatorInput = z.infer<typeof SourceValidatorInputSchema>
export type SourceValidatorOutput = z.infer<typeof SourceValidatorOutputSchema>
export type Source = z.infer<typeof SourceSchema>