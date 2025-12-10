import { describe, it, expect } from 'vitest'
import {
  ResearchPlannerInputSchema,
  ResearchPlannerOutputSchema,
  ThemeSchema
} from './agent.schemas'

describe('Research Planner Agent', () => {
  describe('Input Schema', () => {
    it('validates correct input with domain hint', () => {
      const input = {
        question: "What was the price of a medieval sword?",
        domain_hint: "economy" as const
      }
      expect(() => ResearchPlannerInputSchema.parse(input)).not.toThrow()
    })

    it('validates minimal input (question only)', () => {
      const input = {
        question: "Tell me about medieval warfare"
      }
      expect(() => ResearchPlannerInputSchema.parse(input)).not.toThrow()
    })

    it('validates input with context', () => {
      const input = {
        question: "What was the price of a sword?",
        context: "User is asking about medieval Europe",
        domain_hint: "economy" as const
      }
      expect(() => ResearchPlannerInputSchema.parse(input)).not.toThrow()
    })

    it('rejects question that is too short', () => {
      const input = { question: "Hi" }
      expect(() => ResearchPlannerInputSchema.parse(input)).toThrow()
    })

    it('rejects invalid domain hint', () => {
      const input = {
        question: "What was the price of a sword?",
        domain_hint: "invalid_theme" as any
      }
      expect(() => ResearchPlannerInputSchema.parse(input)).toThrow()
    })
  })

  describe('Output Schema', () => {
    it('validates complete successful output', () => {
      const output = {
        strategy: "corpus_first" as const,
        steps: [
          {
            agent: "corpus-searcher",
            inputs: { keywords: ["sword", "price"], period: "medieval" }
          },
          {
            agent: "web-researcher",
            parallel_with: ["corpus-searcher"],
            inputs: { query: "medieval sword prices" }
          }
        ],
        estimated_reliability: "high" as const,
        parallel_opportunities: ["corpus-searcher", "web-researcher"]
      }
      expect(() => ResearchPlannerOutputSchema.parse(output)).not.toThrow()
    })

    it('validates corpus_only strategy', () => {
      const output = {
        strategy: "corpus_only" as const,
        steps: [{
          agent: "corpus-searcher",
          inputs: { keywords: ["medieval", "armor"] }
        }],
        estimated_reliability: "high" as const,
        parallel_opportunities: []
      }
      expect(() => ResearchPlannerOutputSchema.parse(output)).not.toThrow()
    })

    it('validates web_only strategy', () => {
      const output = {
        strategy: "web_only" as const,
        steps: [{
          agent: "web-researcher",
          inputs: { query: "latest archaeological findings 2024" }
        }],
        estimated_reliability: "medium" as const,
        parallel_opportunities: []
      }
      expect(() => ResearchPlannerOutputSchema.parse(output)).not.toThrow()
    })

    it('rejects invalid strategy', () => {
      const output = {
        strategy: "invalid_strategy" as any,
        steps: [],
        estimated_reliability: "high" as const,
        parallel_opportunities: []
      }
      expect(() => ResearchPlannerOutputSchema.parse(output)).toThrow()
    })

    it('rejects invalid reliability level', () => {
      const output = {
        strategy: "corpus_first" as const,
        steps: [],
        estimated_reliability: "super_high" as any,
        parallel_opportunities: []
      }
      expect(() => ResearchPlannerOutputSchema.parse(output)).toThrow()
    })
  })

  describe('Theme Schema', () => {
    it('validates all valid themes', () => {
      const validThemes = [
        'economy', 'warfare', 'technology', 'culture', 'society',
        'architecture', 'religion', 'politics', 'science', 'daily-life'
      ]
      
      validThemes.forEach(theme => {
        expect(() => ThemeSchema.parse(theme)).not.toThrow()
      })
    })

    it('rejects invalid themes', () => {
      const invalidThemes = ['sports', 'gaming', 'invalid']
      
      invalidThemes.forEach(theme => {
        expect(() => ThemeSchema.parse(theme)).toThrow()
      })
    })
  })
})