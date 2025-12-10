import { z } from 'zod'

// Dependencies from common taxonomy
export const PeriodSchema = z.enum([
  'prehistory', 'ancient', 'medieval', 'renaissance',
  'early-modern', 'modern', 'contemporary'
])

export const RegionSchema = z.enum([
  'europe', 'asia', 'africa', 'americas', 'oceania', 'global'
])

export const ThemeSchema = z.enum([
  'economy', 'warfare', 'technology', 'culture', 'society',
  'architecture', 'religion', 'politics', 'science', 'daily-life'
])

// Corpus Searcher Input Schema
export const CorpusSearcherInputSchema = z.object({
  keywords: z.array(z.string()).min(1),
  period: PeriodSchema.optional(),
  region: RegionSchema.optional(),
  theme: ThemeSchema.optional()
})

// Corpus Searcher Output Schema
export const CorpusSearcherOutputSchema = z.object({
  matches: z.array(z.object({
    entry_id: z.string(),
    title: z.string(),
    relevance_score: z.number().min(0).max(1),
    summary: z.string()
  })),
  has_exact_match: z.boolean(),
  partial_matches: z.array(z.string()),
  search_time_ms: z.number()
})

// Type exports
export type CorpusSearcherInput = z.infer<typeof CorpusSearcherInputSchema>
export type CorpusSearcherOutput = z.infer<typeof CorpusSearcherOutputSchema>
export type Period = z.infer<typeof PeriodSchema>
export type Region = z.infer<typeof RegionSchema>
export type Theme = z.infer<typeof ThemeSchema>