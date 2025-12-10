import { z } from 'zod'
import { SourceSchema } from './common'

// Taxonomy enums
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

// --- Research Planner ---
export const ResearchPlannerInputSchema = z.object({
  question: z.string().min(5),
  context: z.string().optional(),
  domain_hint: ThemeSchema.optional()
})

export const ResearchPlannerOutputSchema = z.object({
  strategy: z.enum(['corpus_only', 'corpus_first', 'web_only', 'comparative']),
  steps: z.array(z.object({
    agent: z.string(),
    parallel_with: z.array(z.string()).optional(),
    inputs: z.record(z.unknown())
  })),
  estimated_reliability: z.enum(['high', 'medium', 'low']),
  parallel_opportunities: z.array(z.string())
})

// --- Corpus Searcher ---
export const CorpusSearcherInputSchema = z.object({
  keywords: z.array(z.string()).min(1),
  period: PeriodSchema.optional(),
  region: RegionSchema.optional(),
  theme: ThemeSchema.optional()
})

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

// --- Web Researcher ---
export const WebResearcherInputSchema = z.object({
  query: z.string(),
  sources: z.array(z.enum(['jstor', 'hal', 'wikipedia', 'google_scholar', 'arxiv'])),
  max_sources: z.number().min(1).max(10).default(5),
  min_reliability: z.enum(['high', 'medium', 'low']).default('medium')
})

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

// --- Source Validator ---
export const SourceValidatorInputSchema = z.object({
  sources: z.array(SourceSchema),
  raw_findings: z.array(z.object({
    source_url: z.string(),
    excerpt: z.string()
  })),
  min_reliability: z.enum(['high', 'medium', 'low']).default('high')
})

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

// --- Corpus Enricher ---
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

export const CorpusEnricherOutputSchema = z.object({
  entry_id: z.string().optional(),
  corpus_updated: z.boolean(),
  index_updated: z.boolean(),
  search_index_updated: z.boolean(),
  file_path: z.string().optional()
})
