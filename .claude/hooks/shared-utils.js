import fs from 'fs/promises'
import path from 'path'

/**
 * Shared utilities for Claude Code hooks logging
 */

class HookUtils {
  static logsDir = '.claude/state/hooks-logs'
  static verbosity = process.env.CLAUDE_LOG_LEVEL || 'normal' // minimal, normal, detailed

  /**
   * Format timestamp for console output
   */
  static getTimestamp() {
    return new Date().toLocaleTimeString()
  }

  /**
   * Get current date for log files
   */
  static getDateString() {
    return new Date().toISOString().split('T')[0]
  }

  /**
   * Extract agent information from Task tool input
   */
  static extractAgentInfo(toolInput) {
    try {
      const input = JSON.parse(toolInput)
      
      const agentName = input.subagent_type || 'unknown-agent'
      const prompt = input.prompt || input.description || ''
      const taskDescription = this.truncateText(prompt, 80)
      
      return {
        agentName,
        taskDescription,
        fullPrompt: prompt,
        originalInput: input
      }
    } catch (error) {
      // Fallback for malformed input
      return {
        agentName: 'unknown-agent',
        taskDescription: 'Unable to parse task',
        fullPrompt: '',
        originalInput: {}
      }
    }
  }

  /**
   * Truncate text for console display
   */
  static truncateText(text, maxLength) {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  /**
   * Console logging with icons and formatting
   */
  static logToConsole(type, agentName, message, details = '') {
    const timestamp = this.getTimestamp()
    const icons = {
      start: '🚀',
      success: '✅', 
      error: '❌',
      info: 'ℹ️'
    }
    
    const icon = icons[type] || 'ℹ️'
    const agentDisplay = agentName ? `[${agentName}]` : ''
    
    console.log(`${icon} ${agentDisplay} ${message} (${timestamp})`)
    
    if (details && this.verbosity !== 'minimal') {
      console.log(`   ${details}`)
    }
    
    // Add separator for completed agents
    if (type === 'success' || type === 'error') {
      console.log('─'.repeat(60))
    }
  }

  /**
   * Save log entry to file (optional persistent logging)
   */
  static async saveToFile(entry) {
    if (this.verbosity === 'minimal') return
    
    try {
      await this.ensureLogsDir()
      
      const logFile = path.join(this.logsDir, `hooks-${this.getDateString()}.log`)
      const logLine = JSON.stringify({
        timestamp: new Date().toISOString(),
        ...entry
      }) + '\n'
      
      await fs.appendFile(logFile, logLine)
    } catch (error) {
      // Silent fail for logging - don't break the main workflow
    }
  }

  /**
   * Store agent start time for duration calculation
   */
  static async storeStartTime(agentName, timestamp) {
    try {
      await this.ensureLogsDir()
      
      const timingFile = path.join(this.logsDir, 'agent-timings.json')
      let timings = {}
      
      try {
        const content = await fs.readFile(timingFile, 'utf8')
        timings = JSON.parse(content)
      } catch {
        // File doesn't exist yet
      }
      
      timings[agentName] = timestamp
      await fs.writeFile(timingFile, JSON.stringify(timings, null, 2))
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Get agent duration and clean up timing data
   */
  static async getAgentDuration(agentName) {
    try {
      const timingFile = path.join(this.logsDir, 'agent-timings.json')
      const content = await fs.readFile(timingFile, 'utf8')
      const timings = JSON.parse(content)
      
      const startTime = timings[agentName]
      if (!startTime) return null
      
      const duration = Date.now() - startTime
      
      // Clean up the timing entry
      delete timings[agentName]
      await fs.writeFile(timingFile, JSON.stringify(timings, null, 2))
      
      return duration
    } catch {
      return null
    }
  }

  /**
   * Format duration for display
   */
  static formatDuration(milliseconds) {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`
    } else {
      return `${Math.round(milliseconds / 100) / 10}s`
    }
  }

  /**
   * Parse tool output/result
   */
  static parseToolOutput(output) {
    try {
      if (typeof output === 'string') {
        // Try to parse as JSON first
        try {
          const parsed = JSON.parse(output)
          return {
            type: 'json',
            data: parsed,
            preview: this.truncateText(JSON.stringify(parsed), 100)
          }
        } catch {
          // It's just a string
          return {
            type: 'text',
            data: output,
            preview: this.truncateText(output, 100)
          }
        }
      } else if (typeof output === 'object') {
        return {
          type: 'object',
          data: output,
          preview: this.truncateText(JSON.stringify(output), 100)
        }
      } else {
        return {
          type: typeof output,
          data: output,
          preview: String(output).substring(0, 100)
        }
      }
    } catch (error) {
      return {
        type: 'unknown',
        data: output,
        preview: 'Unable to parse output'
      }
    }
  }

  /**
   * Determine if we should show detailed output
   */
  static shouldShowDetails() {
    return this.verbosity === 'detailed' || this.verbosity === 'debug'
  }

  /**
   * Ensure logs directory exists
   */
  static async ensureLogsDir() {
    try {
      await fs.mkdir(this.logsDir, { recursive: true })
    } catch {
      // Directory already exists
    }
  }

  /**
   * Get hook environment information
   */
  static getHookEnvironment() {
    return {
      tool: process.env.CLAUDE_TOOL_NAME,
      input: process.env.CLAUDE_TOOL_INPUT,
      output: process.env.CLAUDE_TOOL_OUTPUT,
      success: process.env.CLAUDE_TOOL_SUCCESS,
      duration: process.env.CLAUDE_TOOL_DURATION
    }
  }

  /**
   * Quick status check for debugging hooks
   */
  static debugInfo() {
    console.log('🔧 Hook Debug Info:')
    console.log('  Verbosity:', this.verbosity)
    console.log('  Logs dir:', this.logsDir)
    console.log('  Environment:', Object.keys(process.env).filter(k => k.startsWith('CLAUDE_')))
  }
}

export default HookUtils