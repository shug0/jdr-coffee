/**
 * Exemple d'utilisation des structured outputs avec le Task tool
 * 
 * Ce fichier montre comment l'orchestrateur peut utiliser les structured outputs
 * pour garantir que les réponses des agents respectent leurs schémas.
 */

import { zodToClaudeOutputFormat } from './schema-converter'
import { AGENT_OUTPUT_SCHEMAS, type AgentName } from './agent.schemas'
import { z } from 'zod'

/**
 * Helper pour dispatcher un agent avec structured outputs
 * 
 * Usage dans l'orchestrateur:
 * const result = await dispatchAgentWithStructuredOutput(
 *   'research-planner', 
 *   'Analyze this research question: "What was the price of medieval swords?"'
 * )
 */
export async function dispatchAgentWithStructuredOutput<T extends AgentName>(
  agentName: T,
  prompt: string,
  additionalParams?: Record<string, any>
): Promise<{
  success: boolean
  data?: z.infer<typeof AGENT_OUTPUT_SCHEMAS[T]>
  error?: string
  validationError?: string
}> {
  try {
    // 1. Récupérer le schéma de sortie pour cet agent
    const outputSchema = AGENT_OUTPUT_SCHEMAS[agentName]
    if (!outputSchema) {
      throw new Error(`No output schema found for agent: ${agentName}`)
    }

    // 2. Convertir le schéma Zod en JSON Schema pour Claude
    const claudeOutputFormat = zodToClaudeOutputFormat(outputSchema, `${agentName}Output`)
    
    console.log(`[STRUCTURED] Dispatching ${agentName} with output format validation`)

    // 3. Appeler le Task tool avec structured outputs
    // IMPORTANT: Ajouter le header anthropic-beta requis
    const response = await (globalThis as any).task({
      subagent_type: agentName,
      prompt: prompt,
      output_format: claudeOutputFormat,
      // Headers requis pour structured outputs
      headers: {
        'anthropic-beta': 'structured-outputs-2025-11-13'
      },
      ...additionalParams
    })

    // 4. Valider la réponse avec Zod (double validation)
    try {
      const validatedData = outputSchema.parse(response)
      console.log(`[STRUCTURED] ✅ ${agentName} response validated successfully`)
      
      return {
        success: true,
        data: validatedData
      }
    } catch (validationError) {
      console.error(`[STRUCTURED] ❌ ${agentName} validation failed:`, validationError)
      return {
        success: false,
        error: 'Response validation failed',
        validationError: validationError instanceof Error ? validationError.message : String(validationError)
      }
    }

  } catch (error) {
    console.error(`[STRUCTURED] ❌ ${agentName} dispatch failed:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Exemple d'utilisation dans l'orchestrateur pour un workflow research
 */
export async function exampleResearchWorkflow(userQuestion: string) {
  console.log('🔄 Starting research workflow with structured outputs...')

  // Étape 1: Planning avec structured outputs
  const planningResult = await dispatchAgentWithStructuredOutput(
    'research-planner',
    `Plan a research strategy for: "${userQuestion}"`
  )

  if (!planningResult.success || !planningResult.data) {
    console.error('❌ Planning failed:', planningResult.error)
    return { error: 'Planning phase failed', details: planningResult }
  }

  const plan = planningResult.data
  console.log(`✅ Planning completed: strategy=${plan.strategy}, steps=${plan.steps.length}`)

  // Étape 2: Exécuter les steps en parallèle si possible
  const parallelSteps = plan.steps.filter(step => 
    step.parallel_with && step.parallel_with.length > 0
  )

  if (parallelSteps.length > 0) {
    console.log(`⚡ Executing ${parallelSteps.length} steps in parallel`)
    
    // Exemple: corpus-searcher en parallèle
    if (plan.steps.some(step => step.agent === 'corpus-searcher')) {
      const corpusResult = await dispatchAgentWithStructuredOutput(
        'corpus-searcher',
        `Search corpus for: ${userQuestion}`,
        { keywords: [userQuestion.split(' ')[0]] }
      )
      
      if (corpusResult.success) {
        console.log(`✅ Corpus search: ${corpusResult.data?.matches.length} matches found`)
      }
    }
  }

  return {
    success: true,
    workflow: 'research',
    plan: plan,
    structured_outputs_used: true
  }
}

/**
 * Configuration des structured outputs pour chaque agent
 */
export const STRUCTURED_OUTPUT_CONFIG = {
  // Header requis pour tous les appels
  headers: {
    'anthropic-beta': 'structured-outputs-2025-11-13'
  },
  
  // Agents supportés (research domain pour l'instant)
  supportedAgents: [
    'research-planner',
    'corpus-searcher', 
    'web-researcher',
    'source-validator',
    'corpus-enricher'
  ] as const,
  
  // Configuration par agent
  agentConfigs: {
    'research-planner': {
      model: 'sonnet',
      timeout: 30000,
      retries: 2
    },
    'corpus-searcher': {
      model: 'haiku',
      timeout: 10000,
      retries: 1
    },
    'web-researcher': {
      model: 'haiku', 
      timeout: 60000,
      retries: 2
    },
    'source-validator': {
      model: 'haiku',
      timeout: 20000,
      retries: 1
    },
    'corpus-enricher': {
      model: 'haiku',
      timeout: 15000,
      retries: 1
    }
  }
} as const

console.log('📋 Structured outputs system ready for research domain')
console.log('📋 Supported agents:', STRUCTURED_OUTPUT_CONFIG.supportedAgents)