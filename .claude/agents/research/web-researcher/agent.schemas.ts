import { z } from 'zod'

// Source Schema (from common)
export const SourceSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  author: z.string().optional(),
  date: z.string().optional(),
  reliability: z.enum(['high', 'medium', 'low'])
})

// Web Researcher Input Schema
export const WebResearcherInputSchema = z.object({
  query: z.string(),
  sources: z.array(z.enum(['jstor', 'hal', 'wikipedia', 'google_scholar', 'arxiv'])),
  max_sources: z.number().min(1).max(10).default(5),
  min_reliability: z.enum(['high', 'medium', 'low']).default('medium')
})

// Web Researcher Output Schema
export const WebResearcherOutputSchema = z.object({
  sources: z.array(SourceSchema),
  raw_findings: z.array(z.object({
    source_url: z.string(),
    excerpt: z.string(),
    relevance: z.number().min(0).max(1)
  })),
  search_queries_used: z.array(z.string()),
  total_sources_found: z.number()
})

// Type exports
export type WebResearcherInput = z.infer<typeof WebResearcherInputSchema>
export type WebResearcherOutput = z.infer<typeof WebResearcherOutputSchema>
export type Source = z.infer<typeof SourceSchema>