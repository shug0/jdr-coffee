#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

/**
 * Workflow Tracing System for Multi-Agent Debugging
 * 
 * Provides unified timeline tracking for complex workflows
 * Based on Anthropic's debugging recommendations
 */

class WorkflowTracer {
  static traceDir = '.claude/state/traces'
  static logFile = '.claude/state/workflow.log'

  /**
   * Start a new workflow trace
   * @param {string} workflowId - Unique workflow identifier
   * @param {string} description - Human readable description
   * @param {string} domain - Primary domain (research/frontend/product)
   */
  static async start(workflowId, description, domain = 'unknown') {
    await this.ensureTraceDir()
    
    const workflowData = {
      workflowId,
      description,
      domain,
      startTime: Date.now(),
      status: 'running',
      steps: [],
      metadata: {
        user: process.env.USER || 'unknown',
        version: '1.0.0',
        orchestrator: 'claude-orchestrator'
      }
    }
    
    const traceFile = path.join(this.traceDir, `${workflowId}.json`)
    await fs.writeFile(traceFile, JSON.stringify(workflowData, null, 2))
    
    const logEntry = `${new Date().toISOString()}|WORKFLOW_START|${workflowId}|${description}`
    await this.appendLog(logEntry)
    
    console.log(`🚀 [${workflowId}] Workflow started: ${description}`)
    return workflowData
  }

  /**
   * Add a step to the workflow
   * @param {string} workflowId - Workflow ID
   * @param {string} agent - Agent name
   * @param {string} action - Action description
   * @param {Object} data - Step data
   */
  static async step(workflowId, agent, action, data = {}) {
    const traceFile = path.join(this.traceDir, `${workflowId}.json`)
    
    try {
      const workflow = await this.loadWorkflow(workflowId)
      
      const step = {
        stepId: workflow.steps.length,
        agent,
        action,
        timestamp: Date.now(),
        data: typeof data === 'string' ? data : JSON.stringify(data),
        status: 'running',
        duration: null
      }
      
      workflow.steps.push(step)
      await fs.writeFile(traceFile, JSON.stringify(workflow, null, 2))
      
      const logEntry = `${new Date().toISOString()}|STEP|${workflowId}|${agent}|${action}`
      await this.appendLog(logEntry)
      
      console.log(`  📍 [${workflowId}] Step ${step.stepId}: ${agent} - ${action}`)
      return step.stepId
    } catch (error) {
      console.error(`❌ Failed to add step: ${error.message}`)
      return -1
    }
  }

  /**
   * Mark a step as completed
   * @param {string} workflowId - Workflow ID  
   * @param {number} stepId - Step ID
   * @param {Object} result - Step result
   */
  static async complete(workflowId, stepId, result = {}) {
    try {
      const workflow = await this.loadWorkflow(workflowId)
      const step = workflow.steps[stepId]
      
      if (step) {
        const now = Date.now()
        step.status = 'completed'
        step.endTime = now
        step.duration = now - step.timestamp
        step.result = typeof result === 'string' ? result : JSON.stringify(result)
        
        await this.saveWorkflow(workflowId, workflow)
        
        const logEntry = `${new Date().toISOString()}|COMPLETE|${workflowId}|${step.agent}|${step.duration}ms`
        await this.appendLog(logEntry)
        
        console.log(`  ✅ [${workflowId}] Step ${stepId}: ${step.agent} completed (${step.duration}ms)`)
      }
    } catch (error) {
      console.error(`❌ Failed to complete step: ${error.message}`)
    }
  }

  /**
   * Mark a step as failed
   * @param {string} workflowId - Workflow ID
   * @param {number} stepId - Step ID
   * @param {string} error - Error description
   */
  static async error(workflowId, stepId, error) {
    try {
      const workflow = await this.loadWorkflow(workflowId)
      const step = workflow.steps[stepId]
      
      if (step) {
        const now = Date.now()
        step.status = 'error'
        step.endTime = now
        step.duration = now - step.timestamp
        step.error = error
        
        await this.saveWorkflow(workflowId, workflow)
        
        const logEntry = `${new Date().toISOString()}|ERROR|${workflowId}|${step.agent}|${error}`
        await this.appendLog(logEntry)
        
        console.log(`  ❌ [${workflowId}] Step ${stepId}: ${step.agent} failed - ${error}`)
      }
    } catch (error) {
      console.error(`❌ Failed to record error: ${error.message}`)
    }
  }

  /**
   * Complete a workflow
   * @param {string} workflowId - Workflow ID
   * @param {string} status - Final status (success/error/partial)
   */
  static async finish(workflowId, status = 'success') {
    try {
      const workflow = await this.loadWorkflow(workflowId)
      
      workflow.endTime = Date.now()
      workflow.totalDuration = workflow.endTime - workflow.startTime
      workflow.status = status
      
      await this.saveWorkflow(workflowId, workflow)
      
      const logEntry = `${new Date().toISOString()}|WORKFLOW_END|${workflowId}|${status}|${workflow.totalDuration}ms`
      await this.appendLog(logEntry)
      
      const statusIcon = status === 'success' ? '🎉' : status === 'error' ? '💥' : '⚠️'
      console.log(`${statusIcon} [${workflowId}] Workflow finished: ${status} (${workflow.totalDuration}ms)`)
    } catch (error) {
      console.error(`❌ Failed to finish workflow: ${error.message}`)
    }
  }

  /**
   * Get workflow timeline
   * @param {string} workflowId - Workflow ID
   */
  static async timeline(workflowId) {
    try {
      const workflow = await this.loadWorkflow(workflowId)
      
      console.log(`\n📊 Workflow Timeline: ${workflow.description}`)
      console.log('=' .repeat(60))
      console.log(`Status: ${workflow.status} | Domain: ${workflow.domain}`)
      console.log(`Started: ${new Date(workflow.startTime).toLocaleString()}`)
      if (workflow.endTime) {
        console.log(`Finished: ${new Date(workflow.endTime).toLocaleString()}`)
        console.log(`Duration: ${workflow.totalDuration}ms`)
      }
      console.log()
      
      workflow.steps.forEach((step, index) => {
        const statusIcon = step.status === 'completed' ? '✅' : 
                          step.status === 'error' ? '❌' : 
                          step.status === 'running' ? '⏳' : '⏸️'
        
        const duration = step.duration ? `${step.duration}ms` : 'running'
        const time = new Date(step.timestamp).toLocaleTimeString()
        
        console.log(`${statusIcon} ${String(index).padStart(2)}: ${time} - ${step.agent}`)
        console.log(`     Action: ${step.action}`)
        console.log(`     Duration: ${duration}`)
        if (step.error) {
          console.log(`     Error: ${step.error}`)
        }
        console.log()
      })
      
      return workflow
    } catch (error) {
      console.error(`❌ Failed to get timeline: ${error.message}`)
      return null
    }
  }

  /**
   * List recent workflows
   * @param {number} limit - Number of workflows to show
   */
  static async list(limit = 10) {
    try {
      const files = await fs.readdir(this.traceDir)
      const traceFiles = files.filter(f => f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a)) // Sort by filename (newest first)
        .slice(0, limit)
      
      console.log('\n📋 Recent Workflows')
      console.log('==================')
      
      for (const file of traceFiles) {
        try {
          const content = await fs.readFile(path.join(this.traceDir, file), 'utf8')
          const workflow = JSON.parse(content)
          
          const statusIcon = workflow.status === 'success' ? '✅' : 
                            workflow.status === 'error' ? '❌' : 
                            workflow.status === 'running' ? '⏳' : '⚠️'
          
          const duration = workflow.totalDuration ? 
            `${Math.round(workflow.totalDuration / 1000)}s` : 'running'
          
          console.log(`${statusIcon} ${workflow.workflowId}`)
          console.log(`   ${workflow.description} (${workflow.domain})`)
          console.log(`   ${new Date(workflow.startTime).toLocaleString()} - ${duration}`)
          console.log()
        } catch (error) {
          // Skip malformed trace files
        }
      }
    } catch (error) {
      console.error('No trace directory found')
    }
  }

  /**
   * Analyze workflow performance
   * @param {string} workflowId - Workflow ID
   */
  static async analyze(workflowId) {
    try {
      const workflow = await this.loadWorkflow(workflowId)
      
      console.log(`\n🔍 Workflow Analysis: ${workflowId}`)
      console.log('=' .repeat(50))
      
      const totalSteps = workflow.steps.length
      const completedSteps = workflow.steps.filter(s => s.status === 'completed').length
      const errorSteps = workflow.steps.filter(s => s.status === 'error').length
      const runningSteps = workflow.steps.filter(s => s.status === 'running').length
      
      console.log(`📊 Steps: ${totalSteps} total, ${completedSteps} completed, ${errorSteps} failed, ${runningSteps} running`)
      
      if (completedSteps > 0) {
        const durations = workflow.steps
          .filter(s => s.duration)
          .map(s => s.duration)
        
        const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        const maxDuration = Math.max(...durations)
        const minDuration = Math.min(...durations)
        
        console.log(`⏱️  Average step: ${avgDuration}ms`)
        console.log(`⏱️  Slowest step: ${maxDuration}ms`)
        console.log(`⏱️  Fastest step: ${minDuration}ms`)
      }
      
      if (errorSteps > 0) {
        console.log('\n❌ Failed Steps:')
        workflow.steps
          .filter(s => s.status === 'error')
          .forEach(step => {
            console.log(`   • ${step.agent}: ${step.error}`)
          })
      }
      
      if (runningSteps > 0) {
        console.log('\n⏳ Still Running:')
        workflow.steps
          .filter(s => s.status === 'running')
          .forEach(step => {
            const elapsed = Date.now() - step.timestamp
            console.log(`   • ${step.agent}: ${step.action} (${Math.round(elapsed/1000)}s elapsed)`)
          })
      }
      
      return workflow
    } catch (error) {
      console.error(`❌ Failed to analyze workflow: ${error.message}`)
      return null
    }
  }

  // Helper methods
  static async loadWorkflow(workflowId) {
    const traceFile = path.join(this.traceDir, `${workflowId}.json`)
    const content = await fs.readFile(traceFile, 'utf8')
    return JSON.parse(content)
  }

  static async saveWorkflow(workflowId, workflow) {
    const traceFile = path.join(this.traceDir, `${workflowId}.json`)
    await fs.writeFile(traceFile, JSON.stringify(workflow, null, 2))
  }

  static async appendLog(entry) {
    try {
      await fs.appendFile(this.logFile, entry + '\n')
    } catch (error) {
      // Log file not critical
    }
  }

  static async ensureTraceDir() {
    try {
      await fs.mkdir(this.traceDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command, ...args] = process.argv
  
  switch (command) {
    case 'start':
      if (args.length < 2) {
        console.error('Usage: node workflow-trace.js start <workflow-id> <description> [domain]')
        process.exit(1)
      }
      await WorkflowTracer.start(args[0], args[1], args[2])
      break
      
    case 'step':
      if (args.length < 3) {
        console.error('Usage: node workflow-trace.js step <workflow-id> <agent> <action> [data]')
        process.exit(1)
      }
      await WorkflowTracer.step(args[0], args[1], args[2], args[3])
      break
      
    case 'complete':
      if (args.length < 2) {
        console.error('Usage: node workflow-trace.js complete <workflow-id> <step-id> [result]')
        process.exit(1)
      }
      await WorkflowTracer.complete(args[0], parseInt(args[1]), args[2])
      break
      
    case 'error':
      if (args.length < 3) {
        console.error('Usage: node workflow-trace.js error <workflow-id> <step-id> <error-message>')
        process.exit(1)
      }
      await WorkflowTracer.error(args[0], parseInt(args[1]), args[2])
      break
      
    case 'finish':
      if (args.length < 1) {
        console.error('Usage: node workflow-trace.js finish <workflow-id> [status]')
        process.exit(1)
      }
      await WorkflowTracer.finish(args[0], args[1] || 'success')
      break
      
    case 'timeline':
      if (args.length < 1) {
        console.error('Usage: node workflow-trace.js timeline <workflow-id>')
        process.exit(1)
      }
      await WorkflowTracer.timeline(args[0])
      break
      
    case 'list':
      await WorkflowTracer.list(parseInt(args[0]) || 10)
      break
      
    case 'analyze':
      if (args.length < 1) {
        console.error('Usage: node workflow-trace.js analyze <workflow-id>')
        process.exit(1)
      }
      await WorkflowTracer.analyze(args[0])
      break
      
    default:
      console.log(`
📈 Workflow Tracing System

Usage:
  node workflow-trace.js start <workflow-id> <description> [domain]
  node workflow-trace.js step <workflow-id> <agent> <action> [data]
  node workflow-trace.js complete <workflow-id> <step-id> [result]
  node workflow-trace.js error <workflow-id> <step-id> <error-message>
  node workflow-trace.js finish <workflow-id> [status]
  node workflow-trace.js timeline <workflow-id>
  node workflow-trace.js list [limit]
  node workflow-trace.js analyze <workflow-id>

Examples:
  node workflow-trace.js start wf-research-123 "Medieval sword research" research
  node workflow-trace.js step wf-research-123 corpus-searcher "Search corpus for weapons"
  node workflow-trace.js complete wf-research-123 0 "Found 5 entries"
  node workflow-trace.js timeline wf-research-123
`)
  }
}

export default WorkflowTracer