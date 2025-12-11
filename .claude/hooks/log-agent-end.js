#!/usr/bin/env node
import HookUtils from './shared-utils.js'

/**
 * PostToolUse hook for Task tool - Logs agent completion
 * Environment variables available:
 * - CLAUDE_TOOL_NAME: Name of the tool being used
 * - CLAUDE_TOOL_INPUT: Input parameters for the tool
 * - CLAUDE_TOOL_OUTPUT: Output/result from the tool
 * - CLAUDE_TOOL_SUCCESS: Whether the tool succeeded (true/false)
 * - CLAUDE_TOOL_DURATION: Tool execution duration in milliseconds
 */

async function main() {
  try {
    const toolName = process.env.CLAUDE_TOOL_NAME
    const toolInput = process.env.CLAUDE_TOOL_INPUT
    const toolOutput = process.env.CLAUDE_TOOL_OUTPUT
    const toolSuccess = process.env.CLAUDE_TOOL_SUCCESS === 'true'
    const toolDuration = process.env.CLAUDE_TOOL_DURATION
    
    // Only process Task tool calls
    if (toolName !== 'Task') {
      return
    }
    
    // Extract agent information
    const agentInfo = HookUtils.extractAgentInfo(toolInput)
    const { agentName, taskDescription } = agentInfo
    
    // Parse tool output
    const outputInfo = HookUtils.parseToolOutput(toolOutput)
    
    // Get agent duration (includes our own timing)
    const agentDuration = await HookUtils.getAgentDuration(agentName)
    const durationDisplay = agentDuration 
      ? HookUtils.formatDuration(agentDuration)
      : toolDuration ? `${toolDuration}ms` : 'unknown'
    
    // Determine status and message
    const status = toolSuccess ? 'success' : 'error'
    const message = toolSuccess 
      ? `Completed task (${durationDisplay}): ${taskDescription}`
      : `Failed task (${durationDisplay}): ${taskDescription}`
    
    // Prepare details for verbose output
    let details = ''
    if (HookUtils.shouldShowDetails()) {
      if (toolSuccess) {
        details = `Output preview: ${outputInfo.preview}`
      } else {
        details = `Error: ${outputInfo.preview}`
      }
    }
    
    // Log agent completion to console
    HookUtils.logToConsole(status, agentName, message, details)
    
    // Save to persistent log (optional)
    await HookUtils.saveToFile({
      event: 'agent_end',
      agentName,
      taskDescription,
      success: toolSuccess,
      duration: agentDuration || parseInt(toolDuration) || null,
      outputType: outputInfo.type,
      outputPreview: outputInfo.preview,
      fullOutput: toolSuccess ? outputInfo.data : null,
      error: !toolSuccess ? outputInfo.data : null
    })
    
  } catch (error) {
    // Silent fail - don't break the main workflow
    if (HookUtils.verbosity === 'detailed') {
      console.error('Hook error:', error.message)
    }
  }
}

main()