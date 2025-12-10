/**
 * Validation Monitor System
 * 
 * This system provides a way to verify that schema validation is actually 
 * happening during real orchestrator execution, even though we can't directly
 * inject validation into the Claude Agent System's Task tool.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { z } from 'zod'
import type { AgentName, ValidationResult } from './schemas/validation'

// Validation log entry schema
const ValidationLogEntrySchema = z.object({
  timestamp: z.string(),
  sessionId: z.string(),
  agentName: z.string(),
  phase: z.enum(['pre-execution', 'post-execution']),
  validationType: z.enum(['input', 'output']),
  success: z.boolean(),
  inputData: z.unknown().optional(),
  outputData: z.unknown().optional(),
  error: z.object({
    message: z.string(),
    issues: z.array(z.any()),
    agentName: z.string(),
    validationType: z.enum(['input', 'output'])
  }).optional(),
  executionContext: z.object({
    userPrompt: z.string().optional(),
    orchestratorStep: z.string().optional(),
    workflowId: z.string().optional()
  }).optional()
})

export type ValidationLogEntry = z.infer<typeof ValidationLogEntrySchema>

export class ValidationMonitor {
  private static instance: ValidationMonitor
  private logPath: string
  private sessionId: string

  private constructor() {
    const logDir = join(process.cwd(), '.claude', 'validation-logs')
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true })
    }
    
    this.sessionId = Date.now().toString()
    this.logPath = join(logDir, `validation-${this.sessionId}.json`)
    this.initializeLogFile()
  }

  static getInstance(): ValidationMonitor {
    if (!ValidationMonitor.instance) {
      ValidationMonitor.instance = new ValidationMonitor()
    }
    return ValidationMonitor.instance
  }

  /**
   * Log a validation event - this is called by orchestrator when it validates
   */
  logValidation(entry: Omit<ValidationLogEntry, 'timestamp' | 'sessionId'>): void {
    const logEntry: ValidationLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    }

    try {
      // Validate the log entry itself
      ValidationLogEntrySchema.parse(logEntry)

      // Append to log file
      const existingLogs = this.readLogFile()
      existingLogs.push(logEntry)
      this.writeLogFile(existingLogs)

      // Also log to console in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[VALIDATION] ${entry.phase} ${entry.validationType} for ${entry.agentName}: ${entry.success ? 'SUCCESS' : 'FAILED'}`)
        if (!entry.success && entry.error) {
          console.log(`[VALIDATION ERROR] ${entry.error.message}`)
        }
      }
    } catch (error) {
      console.error('[VALIDATION MONITOR] Failed to log validation event:', error)
    }
  }

  /**
   * Get validation statistics for the current session
   */
  getSessionStats(): {
    totalValidations: number
    successfulValidations: number
    failedValidations: number
    successRate: number
    agentBreakdown: Record<string, {
      total: number
      successful: number
      failed: number
      successRate: number
    }>
    recentFailures: ValidationLogEntry[]
  } {
    const logs = this.readLogFile()
    
    const total = logs.length
    const successful = logs.filter(log => log.success).length
    const failed = total - successful
    
    const agentBreakdown: Record<string, any> = {}
    logs.forEach(log => {
      if (!agentBreakdown[log.agentName]) {
        agentBreakdown[log.agentName] = { total: 0, successful: 0, failed: 0, successRate: 0 }
      }
      agentBreakdown[log.agentName].total++
      if (log.success) {
        agentBreakdown[log.agentName].successful++
      } else {
        agentBreakdown[log.agentName].failed++
      }
    })

    // Calculate success rates
    Object.keys(agentBreakdown).forEach(agentName => {
      const stats = agentBreakdown[agentName]
      stats.successRate = stats.total > 0 ? stats.successful / stats.total : 0
    })

    return {
      totalValidations: total,
      successfulValidations: successful,
      failedValidations: failed,
      successRate: total > 0 ? successful / total : 0,
      agentBreakdown,
      recentFailures: logs.filter(log => !log.success).slice(-10)
    }
  }

  /**
   * Check if orchestrator is actually using validation
   */
  isValidationActive(): {
    isActive: boolean
    evidence: {
      hasRecentValidations: boolean
      hasValidationLogs: boolean
      lastValidationTime?: string
      validationFrequency?: number
    }
  } {
    const logs = this.readLogFile()
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    
    const recentLogs = logs.filter(log => 
      new Date(log.timestamp) > fiveMinutesAgo
    )
    
    const lastLog = logs.length > 0 ? logs[logs.length - 1] : null
    
    return {
      isActive: recentLogs.length > 0,
      evidence: {
        hasRecentValidations: recentLogs.length > 0,
        hasValidationLogs: logs.length > 0,
        lastValidationTime: lastLog?.timestamp,
        validationFrequency: logs.length > 0 ? logs.length / ((now.getTime() - new Date(logs[0].timestamp).getTime()) / (1000 * 60)) : 0
      }
    }
  }

  /**
   * Generate a comprehensive validation report
   */
  generateReport(): {
    summary: ReturnType<ValidationMonitor['getSessionStats']>
    activityCheck: ReturnType<ValidationMonitor['isValidationActive']>
    integrationHealth: {
      status: 'healthy' | 'warning' | 'error'
      issues: string[]
      recommendations: string[]
    }
  } {
    const summary = this.getSessionStats()
    const activityCheck = this.isValidationActive()
    
    const issues: string[] = []
    const recommendations: string[] = []
    
    // Check for common integration issues
    if (!activityCheck.isActive) {
      issues.push('No recent validation activity detected')
      recommendations.push('Verify that orchestrator is actually calling validation functions')
    }
    
    if (summary.successRate < 0.8) {
      issues.push(`Low validation success rate: ${(summary.successRate * 100).toFixed(1)}%`)
      recommendations.push('Review recent validation failures and fix schema mismatches')
    }
    
    if (summary.totalValidations === 0) {
      issues.push('No validation logs found')
      recommendations.push('Ensure orchestrator is properly integrated with validation system')
    }

    // Check for agents with high failure rates
    Object.entries(summary.agentBreakdown).forEach(([agentName, stats]) => {
      if (stats.total > 5 && stats.successRate < 0.5) {
        issues.push(`Agent ${agentName} has high failure rate: ${(stats.successRate * 100).toFixed(1)}%`)
        recommendations.push(`Review schema definition for ${agentName} agent`)
      }
    })

    let status: 'healthy' | 'warning' | 'error' = 'healthy'
    if (issues.length > 0) {
      status = summary.totalValidations > 0 ? 'warning' : 'error'
    }

    return {
      summary,
      activityCheck,
      integrationHealth: {
        status,
        issues,
        recommendations
      }
    }
  }

  /**
   * Clear all validation logs
   */
  clearLogs(): void {
    this.writeLogFile([])
  }

  /**
   * Export logs to a different format for analysis
   */
  exportLogs(format: 'json' | 'csv'): string {
    const logs = this.readLogFile()
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2)
    }
    
    if (format === 'csv') {
      const headers = ['timestamp', 'agentName', 'phase', 'validationType', 'success', 'errorMessage']
      const rows = logs.map(log => [
        log.timestamp,
        log.agentName,
        log.phase,
        log.validationType,
        log.success.toString(),
        log.error?.message || ''
      ])
      
      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
    }
    
    throw new Error(`Unsupported export format: ${format}`)
  }

  // Private helper methods
  private initializeLogFile(): void {
    if (!existsSync(this.logPath)) {
      this.writeLogFile([])
    }
  }

  private readLogFile(): ValidationLogEntry[] {
    try {
      if (!existsSync(this.logPath)) {
        return []
      }
      const content = readFileSync(this.logPath, 'utf-8')
      const data = JSON.parse(content)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Failed to read validation log file:', error)
      return []
    }
  }

  private writeLogFile(logs: ValidationLogEntry[]): void {
    try {
      writeFileSync(this.logPath, JSON.stringify(logs, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to write validation log file:', error)
    }
  }
}

// Convenience functions for orchestrator to use
export const monitor = ValidationMonitor.getInstance()

export function logValidation(entry: Omit<ValidationLogEntry, 'timestamp' | 'sessionId'>): void {
  monitor.logValidation(entry)
}

export function getValidationReport() {
  return monitor.generateReport()
}

export function isValidationWorking() {
  return monitor.isValidationActive()
}