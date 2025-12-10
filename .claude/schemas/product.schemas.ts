import { z } from 'zod'
import { AgentErrorSchema } from './common'

// Requirements Analyzer Schemas
export const RequirementsAnalyzerInputSchema = z.object({
  userRequest: z.string().describe('Original user request or feature description'),
  context: z.string().optional().describe('Additional context about the project or domain'),
  domainHint: z.string().optional().describe('Specific domain or area this relates to'),
  existingCodebaseRef: z.string().optional().describe('Reference to existing codebase or architecture'),
  stakeholders: z.array(z.string()).optional().describe('Key stakeholders for this requirement')
})

export const RequirementGapSchema = z.object({
  category: z.enum(['functional', 'non-functional', 'technical', 'user-experience']),
  description: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  questions: z.array(z.string()),
  suggestions: z.array(z.string()).optional()
})

export const RequirementsAnalyzerOutputSchema = z.object({
  status: z.enum(['complete', 'needs_clarification', 'error']),
  analysisLevel: z.enum(['shallow', 'deep', 'domain']),
  validatedRequirements: z.string().optional().describe('Cleaned and validated requirements'),
  identifiedGaps: z.array(RequirementGapSchema),
  clarifyingQuestions: z.array(z.string()),
  businessLogicValidation: z.object({
    passed: z.boolean(),
    issues: z.array(z.string()),
    recommendations: z.array(z.string())
  }),
  riskAssessment: z.object({
    level: z.enum(['low', 'medium', 'high']),
    factors: z.array(z.string()),
    mitigations: z.array(z.string())
  }),
  readyForSpecification: z.boolean(),
  error: z.string().optional()
})

// Feature Specifier Schemas
export const FeatureSpecifierInputSchema = z.object({
  validatedRequirements: z.string().describe('Requirements from requirements-analyzer'),
  projectContext: z.string().optional().describe('Project or system context'),
  technicalConstraints: z.array(z.string()).optional().describe('Known technical constraints'),
  designGuidelines: z.string().optional().describe('UI/UX design guidelines to follow')
})

export const UserStorySchema = z.object({
  title: z.string(),
  story: z.string().describe('As a [user], I want [goal] so that [benefit] format'),
  acceptanceCriteria: z.array(z.string()).describe('Given/When/Then format criteria'),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  estimatedEffort: z.enum(['small', 'medium', 'large', 'xl']).optional()
})

export const ApiContractSchema = z.object({
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  requestSchema: z.string().describe('TypeScript interface as string'),
  responseSchema: z.string().describe('TypeScript interface as string'),
  errorResponses: z.array(z.object({
    status: z.number(),
    description: z.string(),
    schema: z.string()
  }))
})

export const UiComponentSpecSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  props: z.string().describe('TypeScript interface as string'),
  state: z.string().optional().describe('Component state interface'),
  interactions: z.array(z.string()),
  styling: z.object({
    responsive: z.boolean(),
    accessibility: z.array(z.string()),
    variants: z.array(z.string()).optional()
  })
})

export const FeatureSpecifierOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  featureOverview: z.object({
    name: z.string(),
    purpose: z.string(),
    userBenefit: z.string(),
    successMetrics: z.array(z.string())
  }),
  userStories: z.array(UserStorySchema),
  apiContracts: z.array(ApiContractSchema),
  uiComponents: z.array(UiComponentSpecSchema),
  dataModels: z.array(z.object({
    name: z.string(),
    schema: z.string().describe('TypeScript interface as string'),
    validationRules: z.array(z.string())
  })),
  workflows: z.array(z.object({
    name: z.string(),
    steps: z.array(z.string()),
    decisionPoints: z.array(z.string()),
    errorPaths: z.array(z.string())
  })),
  specificationDocument: z.string().describe('Complete markdown specification'),
  error: z.string().optional()
})

// Feasibility Assessor Schemas
export const FeasibilityAssessorInputSchema = z.object({
  featureSpecification: z.string().describe('Complete feature spec from feature-specifier'),
  codebaseContext: z.string().optional().describe('Current codebase structure and patterns'),
  technicalConstraints: z.array(z.string()).optional().describe('Known technical limitations'),
  timelineConstraints: z.string().optional().describe('Desired timeline or deadline')
})

export const FeasibilityAssessorOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  overallAssessment: z.object({
    feasibility: z.enum(['high', 'medium', 'low']),
    complexity: z.enum(['simple', 'medium', 'complex', 'epic']),
    estimatedEffort: z.string().describe('Time estimate with range'),
    riskLevel: z.enum(['low', 'medium', 'high']),
    confidence: z.enum(['high', 'medium', 'low'])
  }),
  codebaseCompatibility: z.object({
    existingPatternsLeveraged: z.array(z.string()),
    refactoringRequired: z.array(z.string()),
    newPatternsNeeded: z.array(z.string()),
    integrationPoints: z.array(z.string())
  }),
  requiredChanges: z.object({
    newComponents: z.array(z.string()),
    modifiedComponents: z.array(z.string()),
    apiChanges: z.array(z.string()),
    databaseChanges: z.array(z.string()),
    configurationChanges: z.array(z.string())
  }),
  riskFactors: z.array(z.object({
    factor: z.string(),
    severity: z.enum(['low', 'medium', 'high']),
    mitigation: z.string(),
    impact: z.string()
  })),
  implementationRecommendations: z.object({
    approach: z.enum(['incremental', 'mvp', 'refactoring', 'greenfield']),
    phases: z.array(z.object({
      name: z.string(),
      description: z.string(),
      effort: z.string(),
      deliverables: z.array(z.string())
    })),
    dependencies: z.array(z.string()),
    prerequisites: z.array(z.string())
  }),
  assessmentDocument: z.string().describe('Complete feasibility analysis document'),
  error: z.string().optional()
})

// Acceptance Definer Schemas
export const AcceptanceDefinerInputSchema = z.object({
  featureSpecification: z.string().describe('Feature spec from feature-specifier'),
  feasibilityAnalysis: z.string().describe('Feasibility analysis from feasibility-assessor'),
  testingRequirements: z.object({
    coverage: z.enum(['basic', 'standard', 'comprehensive']),
    performanceRequirements: z.array(z.string()).optional(),
    accessibilityLevel: z.enum(['basic', 'aa', 'aaa']).optional(),
    browserSupport: z.array(z.string()).optional()
  }).optional()
})

export const TestScenarioSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(['happy-path', 'edge-case', 'error', 'integration', 'performance']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  preconditions: z.array(z.string()),
  steps: z.array(z.string()),
  expectedResults: z.array(z.string()),
  dataRequirements: z.array(z.string()).optional()
})

export const AcceptanceCriteriaSchema = z.object({
  userStoryId: z.string(),
  criteria: z.array(z.object({
    given: z.string(),
    when: z.string(),
    then: z.string(),
    priority: z.enum(['critical', 'high', 'medium', 'low'])
  }))
})

export const DefinitionOfDoneSchema = z.object({
  functionalCompleteness: z.array(z.string()),
  technicalQuality: z.array(z.string()),
  userExperience: z.array(z.string()),
  documentation: z.array(z.string()),
  deploymentReadiness: z.array(z.string())
})

export const AcceptanceDefinerOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  acceptanceCriteria: z.array(AcceptanceCriteriaSchema),
  testScenarios: z.array(TestScenarioSchema),
  validationRequirements: z.object({
    dataValidation: z.array(z.string()),
    businessRuleValidation: z.array(z.string()),
    integrationValidation: z.array(z.string()),
    userExperienceValidation: z.array(z.string())
  }),
  qualityMetrics: z.object({
    functionalCoverage: z.number(),
    pathCoverage: z.number(),
    edgeCaseCoverage: z.number(),
    errorCoverage: z.number()
  }),
  testingStrategy: z.object({
    unitTestRequirements: z.array(z.string()),
    integrationTestRequirements: z.array(z.string()),
    e2eTestRequirements: z.array(z.string()),
    manualTestRequirements: z.array(z.string())
  }),
  definitionOfDone: DefinitionOfDoneSchema,
  acceptanceDocument: z.string().describe('Complete acceptance criteria document'),
  error: z.string().optional()
})

// Product Planner Schemas
export const ProductPlannerInputSchema = z.object({
  userRequest: z.string().describe('Original user request for product/feature'),
  complexity: z.enum(['simple', 'medium', 'complex', 'epic']).optional(),
  timeline: z.string().optional().describe('Desired timeline or urgency'),
  stakeholders: z.array(z.string()).optional(),
  existingContext: z.string().optional().describe('Existing project or system context')
})

export const WorkflowStepSchema = z.object({
  agent: z.enum(['requirements-analyzer', 'feature-specifier', 'feasibility-assessor', 'acceptance-definer']),
  inputs: z.array(z.string()).describe('Required inputs for this step'),
  outputs: z.array(z.string()).describe('Expected outputs from this step'),
  parallelWith: z.array(z.string()).optional().describe('Other agents that can run in parallel'),
  dependencies: z.array(z.string()).optional().describe('Agents that must complete before this one')
})

export const ProductPlannerOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  workflowType: z.enum(['standard', 'fast-track', 'complex-analysis', 'research-heavy']),
  workflow: z.array(WorkflowStepSchema),
  estimatedTimeline: z.string(),
  qualityGates: z.array(z.string()),
  successCriteria: z.array(z.string()),
  riskFactors: z.array(z.string()),
  parallelOpportunities: z.array(z.string()),
  error: z.string().optional()
})

// Combined error schema for product domain
export const ProductDomainErrorSchema = AgentErrorSchema.extend({
  kind: z.enum([
    'tool_failure',
    'spec_ambiguous', 
    'rate_limited',
    'invalid_input',
    'validation_failed',
    'network_error',
    'requirements_incomplete',
    'specification_invalid',
    'feasibility_blocked',
    'acceptance_criteria_missing',
    'stakeholder_approval_needed',
    'technical_constraints_exceeded'
  ])
})

// Type exports
export type RequirementsAnalyzerInput = z.infer<typeof RequirementsAnalyzerInputSchema>
export type RequirementsAnalyzerOutput = z.infer<typeof RequirementsAnalyzerOutputSchema>
export type RequirementGap = z.infer<typeof RequirementGapSchema>

export type FeatureSpecifierInput = z.infer<typeof FeatureSpecifierInputSchema>
export type FeatureSpecifierOutput = z.infer<typeof FeatureSpecifierOutputSchema>
export type UserStory = z.infer<typeof UserStorySchema>
export type ApiContract = z.infer<typeof ApiContractSchema>
export type UiComponentSpec = z.infer<typeof UiComponentSpecSchema>

export type FeasibilityAssessorInput = z.infer<typeof FeasibilityAssessorInputSchema>
export type FeasibilityAssessorOutput = z.infer<typeof FeasibilityAssessorOutputSchema>

export type AcceptanceDefinerInput = z.infer<typeof AcceptanceDefinerInputSchema>
export type AcceptanceDefinerOutput = z.infer<typeof AcceptanceDefinerOutputSchema>
export type TestScenario = z.infer<typeof TestScenarioSchema>
export type AcceptanceCriteria = z.infer<typeof AcceptanceCriteriaSchema>
export type DefinitionOfDone = z.infer<typeof DefinitionOfDoneSchema>

export type ProductPlannerInput = z.infer<typeof ProductPlannerInputSchema>
export type ProductPlannerOutput = z.infer<typeof ProductPlannerOutputSchema>
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>

export type ProductDomainError = z.infer<typeof ProductDomainErrorSchema>