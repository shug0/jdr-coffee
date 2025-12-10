import { z } from 'zod'

// Source Schema (from common)
export const SourceSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  author: z.string().optional(),
  date: z.string().optional(),
  reliability: z.enum(['high', 'medium', 'low'])
})

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

// Corpus Enricher Input Schema
export const CorpusEnricherInputSchema = z.object({
  validated_data: z.object({
    question: z.string(),
    answer: z.string(),
    sources: z.array(SourceSchema),
    reliability: z.enum(['high', 'medium', 'low'])
  }),
  period: PeriodSchema,
  regions: z.array(RegionSchema),
  themes: z.array(ThemeSchema),
  create_entry: z.boolean().default(true)
})

// Corpus Enricher Output Schema
export const CorpusEnricherOutputSchema = z.object({
  entry_id: z.string().optional(),
  corpus_updated: z.boolean(),
  index_updated: z.boolean(),
  search_index_updated: z.boolean(),
  file_path: z.string().optional()
})

// Type exports
export type CorpusEnricherInput = z.infer<typeof CorpusEnricherInputSchema>
export type CorpusEnricherOutput = z.infer<typeof CorpusEnricherOutputSchema>
export type Source = z.infer<typeof SourceSchema>
export type Period = z.infer<typeof PeriodSchema>
export type Region = z.infer<typeof RegionSchema>
export type Theme = z.infer<typeof ThemeSchema>