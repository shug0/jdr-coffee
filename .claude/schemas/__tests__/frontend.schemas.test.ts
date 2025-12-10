import { describe, it, expect } from 'vitest'
import {
  FrontendPlannerInputSchema,
  FrontendPlannerOutputSchema,
  CodeWriterInputSchema,
  QualityCheckerInputSchema,
  QualityCheckerOutputSchema
} from '../frontend.schemas'

describe('Frontend Schemas', () => {
  describe('FrontendPlannerInput', () => {
    it('validates correct input for Next.js', () => {
      const input = {
        task: "Create a Button component with variants",
        stack: "nextjs" as const
      }
      expect(() => FrontendPlannerInputSchema.parse(input)).not.toThrow()
    })

    it('validates input with data shape', () => {
      const input = {
        task: "Display sword prices",
        data_shape: {
          id: "string",
          title: "string",
          price: "number"
        },
        stack: "vite" as const
      }
      expect(() => FrontendPlannerInputSchema.parse(input)).not.toThrow()
    })
  })

  describe('FrontendPlannerOutput', () => {
    it('validates correct output', () => {
      const output = {
        files: [
          {
            path: "app/components/ui/button.tsx",
            type: "component" as const,
            action: "create" as const
          }
        ],
        components: [
          {
            name: "Button",
            path: "app/components/ui/button.tsx"
          }
        ],
        hooks: [],
        implementation_order: ["app/components/ui/button.tsx"]
      }
      expect(() => FrontendPlannerOutputSchema.parse(output)).not.toThrow()
    })

    it('validates output with hooks', () => {
      const output = {
        files: [
          {
            path: "app/hooks/use-swords.queries.ts",
            type: "hook" as const,
            action: "create" as const
          }
        ],
        components: [],
        hooks: [
          {
            name: "useSwords",
            type: "query" as const,
            path: "app/hooks/use-swords.queries.ts"
          }
        ],
        implementation_order: ["app/hooks/use-swords.queries.ts"]
      }
      expect(() => FrontendPlannerOutputSchema.parse(output)).not.toThrow()
    })
  })

  describe('CodeWriterInput', () => {
    it('validates input with plan and defaults', () => {
      const plan = {
        files: [
          {
            path: "app/components/test.tsx",
            type: "component" as const,
            action: "create" as const
          }
        ],
        components: [],
        hooks: [],
        implementation_order: []
      }

      const input = {
        plan
      }

      const parsed = CodeWriterInputSchema.parse(input)
      expect(parsed.standards).toBe("orguin") // default
    })

    it('validates input with custom standards', () => {
      const plan = {
        files: [],
        components: [],
        hooks: [],
        implementation_order: []
      }

      const input = {
        plan,
        standards: "la-gallerie" as const
      }

      expect(() => CodeWriterInputSchema.parse(input)).not.toThrow()
    })
  })

  describe('QualityCheckerInput', () => {
    it('validates correct input', () => {
      const input = {
        files: ["app/components/button.tsx", "app/hooks/use-button.ts"],
        checks: ["tsc", "biome"] as const
      }
      expect(() => QualityCheckerInputSchema.parse(input)).not.toThrow()
    })

    it('validates input with auto-fix', () => {
      const input = {
        files: ["app/components/button.tsx"],
        checks: ["biome"] as const,
        auto_fix: true
      }
      expect(() => QualityCheckerInputSchema.parse(input)).not.toThrow()
    })
  })

  describe('QualityCheckerOutput', () => {
    it('validates successful check', () => {
      const output = {
        passed: true,
        errors: []
      }
      expect(() => QualityCheckerOutputSchema.parse(output)).not.toThrow()
    })

    it('validates failed check with errors', () => {
      const output = {
        passed: false,
        errors: [
          {
            check: "tsc",
            file: "app/components/button.tsx",
            line: 42,
            message: "Type 'string' is not assignable to type 'number'",
            severity: "error" as const
          },
          {
            check: "biome",
            message: "Unused variable 'foo'",
            severity: "warning" as const
          }
        ],
        suggestions: ["Fix type errors before proceeding", "Run biome check --write to auto-fix"]
      }
      expect(() => QualityCheckerOutputSchema.parse(output)).not.toThrow()
    })
  })
})
