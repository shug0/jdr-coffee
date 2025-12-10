import { zodToJsonSchema } from 'zod-to-json-schema'
import { z } from 'zod'

/**
 * Convert Zod schema to JSON Schema for Claude structured outputs
 * 
 * @param zodSchema The Zod schema to convert
 * @param name Optional name for the schema (used for $ref)
 * @returns JSON Schema object compatible with Claude output_format
 */
export function zodToClaudeOutputFormat<T extends z.ZodTypeAny>(
  zodSchema: T,
  name?: string
): Record<string, any> {
  const jsonSchema = zodToJsonSchema(zodSchema, {
    name,
    // Claude requires additionalProperties: false for strict validation
    additionalProperties: false,
    // Optimize for Claude's requirements
    target: 'jsonSchema7',
    definitions: {}
  })

  // Claude structured outputs requirements
  const claudeSchema = {
    ...jsonSchema,
    // Ensure additionalProperties is false at root level
    additionalProperties: false,
    // Remove $schema as Claude doesn't need it
    $schema: undefined
  }

  // Clean up undefined values
  return JSON.parse(JSON.stringify(claudeSchema))
}

/**
 * Batch convert multiple Zod schemas to JSON Schema
 */
export function convertAgentSchemas<T extends Record<string, z.ZodTypeAny>>(
  schemas: T
): Record<keyof T, Record<string, any>> {
  const converted = {} as Record<keyof T, Record<string, any>>
  
  for (const [name, schema] of Object.entries(schemas)) {
    converted[name as keyof T] = zodToClaudeOutputFormat(schema, name)
  }
  
  return converted
}

/**
 * Helper to validate that a schema is compatible with Claude structured outputs
 */
export function validateClaudeSchema(jsonSchema: Record<string, any>): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Check for recursive schemas (not supported by Claude)
  if (hasRecursiveReferences(jsonSchema)) {
    issues.push('Recursive schemas are not supported by Claude structured outputs')
  }
  
  // Check for additionalProperties
  if (jsonSchema.additionalProperties !== false) {
    issues.push('additionalProperties should be set to false for strict validation')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

function hasRecursiveReferences(schema: any, visited: Set<any> = new Set()): boolean {
  if (visited.has(schema)) {
    return true
  }
  
  visited.add(schema)
  
  if (typeof schema === 'object' && schema !== null) {
    for (const value of Object.values(schema)) {
      if (hasRecursiveReferences(value, visited)) {
        return true
      }
    }
  }
  
  visited.delete(schema)
  return false
}