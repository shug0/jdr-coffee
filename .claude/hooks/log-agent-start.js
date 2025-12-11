#!/usr/bin/env node
import HookUtils from './shared-utils.js'

/**
 * PreToolUse hook for Task tool - Logs agent start
 * Environment variables available:
 * - CLAUDE_TOOL_NAME: Name of the tool being used
 * - CLAUDE_TOOL_INPUT: Input parameters for the tool
 */

async function main() {
  try {
    const toolName = process.env.CLAUDE_TOOL_NAME
    const toolInput = process.env.CLAUDE_TOOL_INPUT
    
    // Only process Task tool calls
    if (toolName !== 'Task') {
      return
    }
    
    // Extract agent information
    const agentInfo = HookUtils.extractAgentInfo(toolInput)
    const { agentName, taskDescription } = agentInfo
    
    // Log agent start to console
    HookUtils.logToConsole(
      'start',
      agentName,
      `Starting task: ${taskDescription}`,
      HookUtils.shouldShowDetails() ? `Full prompt: ${agentInfo.fullPrompt.substring(0, 200)}...` : ''
    )
    
    // Store start time for duration calculation
    await HookUtils.storeStartTime(agentName, Date.now())
    
    // Save to persistent log (optional)
    await HookUtils.saveToFile({
      event: 'agent_start',
      agentName,
      taskDescription,
      fullPrompt: agentInfo.fullPrompt,
      originalInput: agentInfo.originalInput
    })
    
  } catch (error) {
    // Silent fail - don't break the main workflow
    if (HookUtils.verbosity === 'detailed') {
      console.error('Hook error:', error.message)
    }
  }
}

main()