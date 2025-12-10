#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

/**
 * Resource Conflict Checker for Multi-Agent Coordination
 * 
 * Implements Anthropic's coordination pattern for preventing conflicts
 * between parallel agents accessing shared resources
 */

class ResourceChecker {
  static coordinationDir = '.claude/state/coordination'
  static registryFile = path.join(ResourceChecker.coordinationDir, 'active_work_registry.json')

  // Resource definitions for each agent
  static agentResources = {
    'corpus-searcher': {
      type: 'READ',
      resources: ['corpus-index', 'corpus-entries'],
      conflicts: ['corpus-enricher'] // Conflicts with writers
    },
    'corpus-enricher': {
      type: 'WRITE',
      resources: ['corpus-index', 'corpus-entries'],
      conflicts: ['corpus-searcher', 'corpus-enricher'] // Conflicts with all corpus access
    },
    'web-researcher': {
      type: 'EXTERNAL',
      resources: ['web-apis'],
      conflicts: [] // No conflicts, external resource
    },
    'source-validator': {
      type: 'COMPUTE',
      resources: [],
      conflicts: [] // Pure computation, no file access
    },
    'session-manager': {
      type: 'WRITE',
      resources: ['session-state'],
      conflicts: ['session-manager'] // Only conflicts with itself
    },
    'frontend-planner': {
      type: 'READ',
      resources: ['codebase'],
      conflicts: [] // Read-only access to code
    },
    'code-writer': {
      type: 'WRITE',
      resources: ['codebase'],
      conflicts: ['code-writer', 'quality-checker'] // Conflicts with other code writers
    },
    'quality-checker': {
      type: 'READ',
      resources: ['codebase'],
      conflicts: ['code-writer'] // Conflicts with writers during check
    },
    'test-writer': {
      type: 'WRITE',
      resources: ['test-files'],
      conflicts: ['test-writer'] // Only conflicts with itself
    }
  }

  /**
   * Check if agents can run in parallel safely
   * @param {string[]} agentNames - List of agent names to check
   * @returns {Object} Conflict analysis result
   */
  static async checkParallel(agentNames) {
    await this.ensureCoordinationDir()
    
    const conflicts = []
    let phases = []
    
    console.log(`🔍 Checking parallel execution for: ${agentNames.join(', ')}`)
    
    // Check for conflicts between each pair
    for (let i = 0; i < agentNames.length; i++) {
      for (let j = i + 1; j < agentNames.length; j++) {
        const agent1 = agentNames[i]
        const agent2 = agentNames[j]
        
        const conflict = this.checkAgentConflict(agent1, agent2)
        if (conflict) {
          conflicts.push(conflict)
        }
      }
    }
    
    if (conflicts.length === 0) {
      console.log('✅ All agents can run in parallel safely')
      return {
        safe: true,
        conflicts: [],
        phases: [agentNames],
        recommendation: 'parallel'
      }
    }
    
    // Generate phases for sequential execution
    phases = this.generatePhases(agentNames)
    
    console.log(`⚠️ Found ${conflicts.length} conflict(s):`)
    conflicts.forEach(conflict => {
      console.log(`  • ${conflict.agent1} ↔ ${conflict.agent2}: ${conflict.reason}`)
    })
    
    return {
      safe: false,
      conflicts,
      phases,
      recommendation: 'sequential'
    }
  }

  /**
   * Check conflict between two agents
   * @param {string} agent1 - First agent
   * @param {string} agent2 - Second agent
   * @returns {Object|null} Conflict details or null if no conflict
   */
  static checkAgentConflict(agent1, agent2) {
    const res1 = this.agentResources[agent1]
    const res2 = this.agentResources[agent2]
    
    if (!res1 || !res2) {
      return {
        agent1,
        agent2,
        reason: 'Unknown agent resource definition'
      }
    }
    
    // Check if agents conflict with each other
    if (res1.conflicts.includes(agent2) || res2.conflicts.includes(agent1)) {
      const reason = this.getConflictReason(res1, res2)
      return { agent1, agent2, reason }
    }
    
    return null
  }

  /**
   * Get human-readable conflict reason
   * @param {Object} res1 - First agent resources
   * @param {Object} res2 - Second agent resources  
   * @returns {string} Conflict reason
   */
  static getConflictReason(res1, res2) {
    if (res1.type === 'WRITE' && res2.type === 'WRITE') {
      return 'Both agents write to shared resources'
    }
    if (res1.type === 'WRITE' || res2.type === 'WRITE') {
      return 'Write/Read conflict on shared resources'
    }
    return 'Resource access conflict'
  }

  /**
   * Generate execution phases to avoid conflicts
   * @param {string[]} agentNames - List of agent names
   * @returns {Array<Array<string>>} Array of phases with compatible agents
   */
  static generatePhases(agentNames) {
    const phases = []
    const remaining = [...agentNames]
    
    while (remaining.length > 0) {
      const currentPhase = []
      const toRemove = []
      
      // Try to add agents to current phase
      for (const agent of remaining) {
        const canAdd = currentPhase.every(existing => 
          !this.checkAgentConflict(agent, existing)
        )
        
        if (canAdd) {
          currentPhase.push(agent)
          toRemove.push(agent)
        }
      }
      
      // Remove agents added to current phase
      toRemove.forEach(agent => {
        const index = remaining.indexOf(agent)
        remaining.splice(index, 1)
      })
      
      phases.push(currentPhase)
    }
    
    return phases
  }

  /**
   * Register active work for an agent
   * @param {string} agent - Agent name
   * @param {Object} workDetails - Work details
   */
  static async registerWork(agent, workDetails) {
    await this.ensureCoordinationDir()
    
    try {
      const registry = await this.loadRegistry()
      
      registry.active_work[agent] = {
        agent,
        ...workDetails,
        startTime: Date.now(),
        pid: process.pid
      }
      
      await this.saveRegistry(registry)
      console.log(`📝 Registered work for ${agent}`)
    } catch (error) {
      console.error(`Failed to register work: ${error.message}`)
    }
  }

  /**
   * Unregister work for an agent
   * @param {string} agent - Agent name
   */
  static async unregisterWork(agent) {
    try {
      const registry = await this.loadRegistry()
      
      if (registry.active_work[agent]) {
        const work = registry.active_work[agent]
        const duration = Date.now() - work.startTime
        
        // Move to completed work
        registry.completed_work.push({
          ...work,
          endTime: Date.now(),
          duration
        })
        
        delete registry.active_work[agent]
        await this.saveRegistry(registry)
        
        console.log(`✅ Unregistered work for ${agent} (${duration}ms)`)
      }
    } catch (error) {
      console.error(`Failed to unregister work: ${error.message}`)
    }
  }

  /**
   * Get current work status
   */
  static async status() {
    try {
      const registry = await this.loadRegistry()
      
      console.log('\n📊 Resource Coordination Status')
      console.log('===============================')
      
      const activeWork = Object.values(registry.active_work)
      if (activeWork.length === 0) {
        console.log('🟢 No active work registered')
      } else {
        console.log(`🟡 ${activeWork.length} active work item(s):`)
        activeWork.forEach(work => {
          const duration = Math.round((Date.now() - work.startTime) / 1000)
          const resources = this.agentResources[work.agent]?.resources.join(', ') || 'unknown'
          console.log(`  • ${work.agent}: ${work.description || 'Working...'} (${duration}s, resources: ${resources})`)
        })
      }
      
      const recentCompleted = registry.completed_work.slice(-3)
      if (recentCompleted.length > 0) {
        console.log('\n📋 Recent completed work:')
        recentCompleted.forEach(work => {
          const duration = Math.round(work.duration / 1000)
          console.log(`  • ${work.agent}: ${duration}s`)
        })
      }
      
      return registry
    } catch (error) {
      console.error(`Failed to get status: ${error.message}`)
      return null
    }
  }

  /**
   * Suggest execution strategy for a list of agents
   * @param {string[]} agentNames - List of agent names
   */
  static async suggest(agentNames) {
    const analysis = await this.checkParallel(agentNames)
    
    console.log('\n💡 Execution Strategy Recommendation')
    console.log('====================================')
    
    if (analysis.safe) {
      console.log('🚀 PARALLEL EXECUTION SAFE')
      console.log(`All ${agentNames.length} agents can run simultaneously`)
      console.log(`Estimated speedup: ${agentNames.length}x`)
    } else {
      console.log('⚠️ SEQUENTIAL EXECUTION REQUIRED')
      console.log(`Split into ${analysis.phases.length} phases:`)
      
      analysis.phases.forEach((phase, index) => {
        const phaseSize = phase.length
        const parallelizable = phaseSize > 1 ? ' (parallel within phase)' : ''
        console.log(`  Phase ${index + 1}: ${phase.join(', ')}${parallelizable}`)
      })
      
      const maxPhaseSize = Math.max(...analysis.phases.map(p => p.length))
      const efficiency = Math.round((maxPhaseSize / agentNames.length) * 100)
      console.log(`\nParallelization efficiency: ${efficiency}%`)
    }
    
    return analysis
  }

  // Helper methods
  static async loadRegistry() {
    try {
      const content = await fs.readFile(this.registryFile, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      // Return empty registry
      return {
        active_work: {},
        completed_work: [],
        metadata: {
          created: Date.now(),
          version: '1.0.0'
        }
      }
    }
  }

  static async saveRegistry(registry) {
    await fs.writeFile(this.registryFile, JSON.stringify(registry, null, 2))
  }

  static async ensureCoordinationDir() {
    try {
      await fs.mkdir(this.coordinationDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command, ...args] = process.argv
  
  switch (command) {
    case 'check':
      if (args.length === 0) {
        console.error('Usage: node resource-check.js check <agent1> <agent2> ...')
        process.exit(1)
      }
      await ResourceChecker.checkParallel(args)
      break
      
    case 'suggest':
      if (args.length === 0) {
        console.error('Usage: node resource-check.js suggest <agent1> <agent2> ...')
        process.exit(1)
      }
      await ResourceChecker.suggest(args)
      break
      
    case 'register':
      if (args.length < 2) {
        console.error('Usage: node resource-check.js register <agent> <description>')
        process.exit(1)
      }
      await ResourceChecker.registerWork(args[0], { description: args.slice(1).join(' ') })
      break
      
    case 'unregister':
      if (args.length < 1) {
        console.error('Usage: node resource-check.js unregister <agent>')
        process.exit(1)
      }
      await ResourceChecker.unregisterWork(args[0])
      break
      
    case 'status':
      await ResourceChecker.status()
      break
      
    default:
      console.log(`
🔍 Resource Conflict Checker

Usage:
  node resource-check.js check <agent1> <agent2> ...      # Check for conflicts
  node resource-check.js suggest <agent1> <agent2> ...    # Get execution strategy  
  node resource-check.js register <agent> <description>   # Register active work
  node resource-check.js unregister <agent>               # Unregister work
  node resource-check.js status                           # Show current status

Examples:
  node resource-check.js check corpus-searcher corpus-enricher
  node resource-check.js suggest corpus-searcher web-researcher source-validator
  node resource-check.js register corpus-searcher "Searching for medieval weapons"
  node resource-check.js status
`)
  }
}

export default ResourceChecker