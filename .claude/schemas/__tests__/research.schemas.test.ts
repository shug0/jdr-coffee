import { describe, it, expect } from 'vitest'
import {
  ResearchPlannerInputSchema,
  ResearchPlannerOutputSchema,
  CorpusSearcherInputSchema,
  CorpusSearcherOutputSchema,
  WebResearcherInputSchema,
  AgentErrorSchema
} from '../research.schemas'

describe('Research Schemas', () => {
  describe('ResearchPlannerInput', () => {
    it('validates correct input', () => {
      const input = {
        question: "What was the price of a medieval sword?",
        domain_hint: "economy" as const
      }
      expect(() => ResearchPlannerInputSchema.parse(input)).not.toThrow()
    })

    it('rejects invalid question (too short)', () => {
      const input = { question: "Hi" } // Too short
      expect(() => ResearchPlannerInputSchema.parse(input)).toThrow()
    })

    it('accepts optional context', () => {
      const input = {
        question: "What was the price of a sword?",
        context: "User is asking about medieval Europe"
      }
      expect(() => ResearchPlannerInputSchema.parse(input)).not.toThrow()
    })
  })

  describe('ResearchPlannerOutput', () => {
    it('validates correct output', () => {
      const output = {
        strategy: "corpus_first" as const,
        steps: [
          {
            agent: "corpus-searcher",
            inputs: { keywords: ["sword", "price"] }
          }
        ],
        estimated_reliability: "high" as const,
        parallel_opportunities: ["corpus-searcher", "web-researcher"]
      }
      expect(() => ResearchPlannerOutputSchema.parse(output)).not.toThrow()
    })
  })

  describe('CorpusSearcherInput', () => {
    it('validates correct input', () => {
      const input = {
        keywords: ["sword", "price", "medieval"],
        period: "medieval" as const,
        region: "europe" as const
      }
      expect(() => CorpusSearcherInputSchema.parse(input)).not.toThrow()
    })

    it('rejects empty keywords array', () => {
      const input = { keywords: [] }
      expect(() => CorpusSearcherInputSchema.parse(input)).toThrow()
    })
  })

  describe('CorpusSearcherOutput', () => {
    it('validates successful search', () => {
      const output = {
        matches: [
          {
            entry_id: "entry-001",
            title: "Medieval Sword Prices",
            relevance_score: 0.9,
            summary: "Detailed information about sword pricing in medieval Europe"
          }
        ],
        has_exact_match: true,
        partial_matches: [],
        search_time_ms: 150
      }
      expect(() => CorpusSearcherOutputSchema.parse(output)).not.toThrow()
    })

    it('validates empty search results', () => {
      const output = {
        matches: [],
        has_exact_match: false,
        partial_matches: [],
        search_time_ms: 50
      }
      expect(() => CorpusSearcherOutputSchema.parse(output)).not.toThrow()
    })
  })

  describe('WebResearcherInput', () => {
    it('validates correct input with defaults', () => {
      const input = {
        query: "medieval sword prices 1300-1400",
        sources: ["jstor", "hal", "wikipedia"] as const
      }
      const parsed = WebResearcherInputSchema.parse(input)
      expect(parsed.max_sources).toBe(5) // default
      expect(parsed.min_reliability).toBe("medium") // default
    })

    it('validates input with custom values', () => {
      const input = {
        query: "medieval economy",
        sources: ["google_scholar"] as const,
        max_sources: 3,
        min_reliability: "high" as const
      }
      expect(() => WebResearcherInputSchema.parse(input)).not.toThrow()
    })
  })

  describe('AgentError', () => {
    it('validates error with suggestions', () => {
      const error = {
        status: "error" as const,
        kind: "spec_ambiguous" as const,
        detail: "Question too vague - cannot determine time period",
        suggestions: ["Specify time period (e.g., medieval, ancient)", "Specify region"],
        retryable: false
      }
      expect(() => AgentErrorSchema.parse(error)).not.toThrow()
    })

    it('validates error without suggestions', () => {
      const error = {
        status: "error" as const,
        kind: "rate_limited" as const,
        detail: "API rate limit exceeded",
        retryable: true
      }
      expect(() => AgentErrorSchema.parse(error)).not.toThrow()
    })

    it('validates error with context', () => {
      const error = {
        status: "error" as const,
        kind: "corpus_error" as const,
        detail: "Failed to read corpus index",
        retryable: true,
        context: {
          file: "docs/historical-corpus/index.json",
          error_code: "ENOENT"
        }
      }
      expect(() => AgentErrorSchema.parse(error)).not.toThrow()
    })
  })
})
