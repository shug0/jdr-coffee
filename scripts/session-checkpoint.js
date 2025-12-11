#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

/**
 * Session Checkpoint System for Long-Running Workflows
 * 
 * Implements persistent session state for complex multi-domain workflows
 * Based on Anthropic's session management recommendations
 */

class SessionCheckpoint {
  static sessionsDir = '.claude/state/sessions'
  static checkpointsDir = '.claude/state/checkpoints'
  
  /**
   * Create a new development session for complex workflow
   * @param {string} title - Session title
   * @param {string} domain - Primary domain
   * @param {Object} initialState - Initial workflow state
   */
  static async create(title, domain, initialState = {}) {
    await this.ensureDirectories()
    
    const sessionId = `session-${domain}-${Date.now()}`
    const sessionData = {
      sessionId,
      title,
      domain,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      currentPhase: 'planning',
      totalSteps: initialState.estimatedSteps || 0,
      completedSteps: 0,
      workflow: {
        workflowId: initialState.workflowId || `wf-${sessionId}`,
        currentStep: 0,
        steps: [],
        context: initialState.context || {},
        variables: initialState.variables || {}
      },
      checkpoints: [],
      metadata: {
        estimatedDuration: initialState.estimatedDuration || 'unknown',
        complexity: initialState.complexity || 'high',
        requiresUserInput: initialState.requiresUserInput || false
      }
    }
    
    const sessionFile = path.join(this.sessionsDir, `${sessionId}.json`)
    await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2))
    
    console.log(`✨ Created session: ${sessionId}`)
    console.log(`📝 Title: ${title}`)
    console.log(`🎯 Domain: ${domain}`)
    console.log(`📂 File: ${sessionFile}`)
    
    return { sessionId, sessionData }
  }
  
  /**
   * Save a checkpoint of current workflow state
   * @param {string} sessionId - Session ID
   * @param {Object} state - Current workflow state
   * @param {string} description - Checkpoint description
   */
  static async saveCheckpoint(sessionId, state, description) {
    try {
      const session = await this.loadSession(sessionId)
      
      const checkpoint = {
        checkpointId: `cp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        description,
        phase: session.currentPhase,
        completedSteps: session.completedSteps,
        workflowState: {
          currentStep: state.currentStep || session.workflow.currentStep,
          steps: state.steps || session.workflow.steps,
          context: state.context || session.workflow.context,
          variables: state.variables || session.workflow.variables,
          lastAgent: state.lastAgent,
          lastOutput: state.lastOutput
        },
        metadata: {
          duration: Date.now() - new Date(session.createdAt).getTime(),
          memoryUsage: state.memoryUsage,
          activeAgents: state.activeAgents || []
        }
      }
      
      // Add checkpoint to session
      session.checkpoints.push(checkpoint)
      session.lastUpdated = new Date().toISOString()
      session.completedSteps = checkpoint.completedSteps
      session.workflow = { ...session.workflow, ...checkpoint.workflowState }
      
      // Save updated session
      await this.saveSession(sessionId, session)
      
      // Create dedicated checkpoint file for recovery
      const checkpointFile = path.join(this.checkpointsDir, `${checkpoint.checkpointId}.json`)
      await fs.writeFile(checkpointFile, JSON.stringify(checkpoint, null, 2))
      
      console.log(`💾 Checkpoint saved: ${checkpoint.checkpointId}`)
      console.log(`📍 ${description}`)
      console.log(`⏱️  Step ${session.completedSteps}/${session.totalSteps}`)
      
      return checkpoint
    } catch (error) {
      console.error(`❌ Failed to save checkpoint: ${error.message}`)
      throw error
    }
  }
  
  /**
   * Resume a session from its last checkpoint
   * @param {string} sessionId - Session ID to resume
   */
  static async resume(sessionId) {
    try {
      const session = await this.loadSession(sessionId)
      
      if (session.status === 'completed') {
        console.log(`ℹ️  Session ${sessionId} is already completed`)
        return session
      }
      
      const lastCheckpoint = session.checkpoints[session.checkpoints.length - 1]
      
      console.log(`🔄 Resuming session: ${sessionId}`)
      console.log(`📝 Title: ${session.title}`)
      console.log(`🎯 Domain: ${session.domain}`)
      console.log(`📅 Created: ${new Date(session.createdAt).toLocaleString()}`)
      
      if (lastCheckpoint) {
        console.log(`\n📍 Last checkpoint: ${lastCheckpoint.description}`)
        console.log(`⏱️  Progress: ${session.completedSteps}/${session.totalSteps} steps`)
        console.log(`🔧 Phase: ${session.currentPhase}`)
        
        // Show recent context
        if (lastCheckpoint.workflowState.context) {
          console.log(`\n💭 Context variables:`)
          Object.entries(lastCheckpoint.workflowState.context).forEach(([key, value]) => {
            const truncated = typeof value === 'string' && value.length > 50 ? 
              value.substring(0, 50) + '...' : value
            console.log(`   • ${key}: ${JSON.stringify(truncated)}`)
          })
        }
        
        // Show next actions
        if (lastCheckpoint.workflowState.steps) {
          const nextStep = lastCheckpoint.workflowState.currentStep + 1
          const nextAction = lastCheckpoint.workflowState.steps[nextStep]
          if (nextAction) {
            console.log(`\n🎯 Next action: ${nextAction.agent} - ${nextAction.description}`)
          }
        }
      } else {
        console.log(`\n⚠️  No checkpoints found - starting from beginning`)
      }
      
      // Mark as active
      session.status = 'active'
      session.lastUpdated = new Date().toISOString()
      await this.saveSession(sessionId, session)
      
      console.log(`\n✅ Session resumed and ready to continue`)
      return session
    } catch (error) {
      console.error(`❌ Failed to resume session: ${error.message}`)
      throw error
    }
  }
  
  /**
   * List all sessions with their status
   * @param {Object} options - Filter options
   */
  static async list(options = {}) {
    try {
      const files = await fs.readdir(this.sessionsDir)
      const sessionFiles = files.filter(f => f.endsWith('.json'))
      
      console.log(`\n📋 Sessions (${sessionFiles.length} total)`)
      console.log('=' .repeat(60))
      
      const sessions = []
      for (const file of sessionFiles) {
        try {
          const content = await fs.readFile(path.join(this.sessionsDir, file), 'utf8')
          const session = JSON.parse(content)
          sessions.push(session)
        } catch (error) {
          console.warn(`⚠️  Skipping malformed session file: ${file}`)
        }
      }
      
      // Filter sessions
      let filtered = sessions
      if (options.status) {
        filtered = sessions.filter(s => s.status === options.status)
      }
      if (options.domain) {
        filtered = filtered.filter(s => s.domain === options.domain)
      }
      if (options.recoverable) {
        filtered = filtered.filter(s => s.status === 'active' && s.checkpoints.length > 0)
      }
      
      // Sort by last updated
      filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      
      filtered.forEach(session => {
        const statusIcon = session.status === 'active' ? '🟢' : 
                          session.status === 'completed' ? '✅' : 
                          session.status === 'paused' ? '⏸️' : '🔴'
        
        const progress = session.totalSteps > 0 ? 
          `${session.completedSteps}/${session.totalSteps}` : 
          `${session.checkpoints.length} checkpoints`
        
        const lastUpdate = new Date(session.lastUpdated).toLocaleDateString()
        
        console.log(`${statusIcon} ${session.sessionId}`)
        console.log(`   📝 ${session.title} (${session.domain})`)
        console.log(`   📊 Progress: ${progress} | Phase: ${session.currentPhase}`)
        console.log(`   📅 Last updated: ${lastUpdate}`)
        console.log()
      })
      
      return filtered
    } catch (error) {
      console.error(`❌ Failed to list sessions: ${error.message}`)
      return []
    }
  }
  
  /**
   * Complete a session
   * @param {string} sessionId - Session ID to complete
   * @param {Object} finalState - Final workflow state
   */
  static async complete(sessionId, finalState = {}) {
    try {
      const session = await this.loadSession(sessionId)
      
      // Save final checkpoint
      await this.saveCheckpoint(sessionId, finalState, 'WORKFLOW_COMPLETED')
      
      // Update session status
      session.status = 'completed'
      session.completedAt = new Date().toISOString()
      session.lastUpdated = new Date().toISOString()
      session.completedSteps = session.totalSteps || session.checkpoints.length
      session.currentPhase = 'completed'
      
      await this.saveSession(sessionId, session)
      
      const duration = new Date(session.completedAt) - new Date(session.createdAt)
      const durationStr = Math.round(duration / 1000 / 60) // minutes
      
      console.log(`🎉 Session completed: ${sessionId}`)
      console.log(`📝 ${session.title}`)
      console.log(`⏱️  Total duration: ${durationStr} minutes`)
      console.log(`📊 Checkpoints: ${session.checkpoints.length}`)
      
      return session
    } catch (error) {
      console.error(`❌ Failed to complete session: ${error.message}`)
      throw error
    }
  }
  
  /**
   * Archive old completed sessions
   * @param {number} olderThanDays - Archive sessions older than X days
   */
  static async archive(olderThanDays = 30) {
    try {
      const sessions = await this.list()
      const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)
      
      const toArchive = sessions.filter(s => 
        s.status === 'completed' && new Date(s.completedAt) < cutoffDate
      )
      
      if (toArchive.length === 0) {
        console.log(`ℹ️  No sessions to archive (older than ${olderThanDays} days)`)
        return
      }
      
      const archiveDir = path.join(this.sessionsDir, 'archive')
      await fs.mkdir(archiveDir, { recursive: true })
      
      for (const session of toArchive) {
        const originalFile = path.join(this.sessionsDir, `${session.sessionId}.json`)
        const archiveFile = path.join(archiveDir, `${session.sessionId}.json`)
        
        await fs.rename(originalFile, archiveFile)
        console.log(`📦 Archived: ${session.sessionId} (${session.title})`)
      }
      
      console.log(`✅ Archived ${toArchive.length} completed session(s)`)
    } catch (error) {
      console.error(`❌ Failed to archive sessions: ${error.message}`)
    }
  }
  
  /**
   * Get session analytics
   * @param {string} sessionId - Session ID (optional - if not provided, shows global stats)
   */
  static async analytics(sessionId) {
    if (sessionId) {
      return this.sessionAnalytics(sessionId)
    } else {
      return this.globalAnalytics()
    }
  }
  
  static async sessionAnalytics(sessionId) {
    try {
      const session = await this.loadSession(sessionId)
      
      console.log(`\n📊 Session Analytics: ${sessionId}`)
      console.log('=' .repeat(50))
      console.log(`📝 Title: ${session.title}`)
      console.log(`🎯 Domain: ${session.domain}`)
      console.log(`📅 Created: ${new Date(session.createdAt).toLocaleString()}`)
      
      if (session.completedAt) {
        const duration = new Date(session.completedAt) - new Date(session.createdAt)
        const hours = Math.round(duration / 1000 / 60 / 60 * 10) / 10
        console.log(`⏱️  Duration: ${hours} hours`)
      }
      
      console.log(`📊 Progress: ${session.completedSteps}/${session.totalSteps}`)
      console.log(`🏁 Status: ${session.status}`)
      console.log(`📍 Checkpoints: ${session.checkpoints.length}`)
      
      if (session.checkpoints.length > 0) {
        console.log(`\n📈 Checkpoint Timeline:`)
        session.checkpoints.forEach((cp, index) => {
          const time = new Date(cp.timestamp).toLocaleTimeString()
          console.log(`  ${index + 1}. ${time} - ${cp.description}`)
        })
        
        // Average time between checkpoints
        if (session.checkpoints.length > 1) {
          const times = session.checkpoints.map(cp => new Date(cp.timestamp).getTime())
          const intervals = []
          for (let i = 1; i < times.length; i++) {
            intervals.push(times[i] - times[i-1])
          }
          const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
          const avgMinutes = Math.round(avgInterval / 1000 / 60)
          console.log(`\n⏱️  Average checkpoint interval: ${avgMinutes} minutes`)
        }
      }
      
      return session
    } catch (error) {
      console.error(`❌ Failed to get session analytics: ${error.message}`)
    }
  }
  
  static async globalAnalytics() {
    try {
      const sessions = await this.list()
      
      console.log(`\n📊 Global Session Analytics`)
      console.log('=' .repeat(40))
      console.log(`📝 Total sessions: ${sessions.length}`)
      
      const byStatus = sessions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1
        return acc
      }, {})
      
      Object.entries(byStatus).forEach(([status, count]) => {
        const icon = status === 'active' ? '🟢' : status === 'completed' ? '✅' : '⏸️'
        console.log(`${icon} ${status}: ${count}`)
      })
      
      const byDomain = sessions.reduce((acc, s) => {
        acc[s.domain] = (acc[s.domain] || 0) + 1
        return acc
      }, {})
      
      console.log(`\n🎯 By domain:`)
      Object.entries(byDomain).forEach(([domain, count]) => {
        console.log(`   • ${domain}: ${count}`)
      })
      
      const completed = sessions.filter(s => s.status === 'completed' && s.completedAt)
      if (completed.length > 0) {
        const durations = completed.map(s => 
          new Date(s.completedAt) - new Date(s.createdAt)
        )
        const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
        const avgHours = Math.round(avgDuration / 1000 / 60 / 60 * 10) / 10
        
        console.log(`\n⏱️  Average completion time: ${avgHours} hours`)
      }
      
      return { sessions, stats: { byStatus, byDomain } }
    } catch (error) {
      console.error(`❌ Failed to get global analytics: ${error.message}`)
    }
  }
  
  // Helper methods
  static async loadSession(sessionId) {
    const sessionFile = path.join(this.sessionsDir, `${sessionId}.json`)
    const content = await fs.readFile(sessionFile, 'utf8')
    return JSON.parse(content)
  }
  
  static async saveSession(sessionId, sessionData) {
    const sessionFile = path.join(this.sessionsDir, `${sessionId}.json`)
    await fs.writeFile(sessionFile, JSON.stringify(sessionData, null, 2))
  }
  
  static async ensureDirectories() {
    await fs.mkdir(this.sessionsDir, { recursive: true })
    await fs.mkdir(this.checkpointsDir, { recursive: true })
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command, ...args] = process.argv
  
  switch (command) {
    case 'create':
      if (args.length < 2) {
        console.error('Usage: node session-checkpoint.js create <title> <domain> [initial-state.json]')
        process.exit(1)
      }
      const initialState = args[2] ? JSON.parse(await fs.readFile(args[2], 'utf8')) : {}
      await SessionCheckpoint.create(args[0], args[1], initialState)
      break
      
    case 'save':
      if (args.length < 3) {
        console.error('Usage: node session-checkpoint.js save <session-id> <state.json> <description>')
        process.exit(1)
      }
      const state = JSON.parse(await fs.readFile(args[1], 'utf8'))
      await SessionCheckpoint.saveCheckpoint(args[0], state, args[2])
      break
      
    case 'resume':
      if (args.length < 1) {
        console.error('Usage: node session-checkpoint.js resume <session-id>')
        process.exit(1)
      }
      await SessionCheckpoint.resume(args[0])
      break
      
    case 'list':
      const options = {}
      if (args.includes('--active')) options.status = 'active'
      if (args.includes('--completed')) options.status = 'completed'
      if (args.includes('--recoverable')) options.recoverable = true
      const domainFlag = args.findIndex(a => a === '--domain')
      if (domainFlag !== -1) options.domain = args[domainFlag + 1]
      
      await SessionCheckpoint.list(options)
      break
      
    case 'complete':
      if (args.length < 1) {
        console.error('Usage: node session-checkpoint.js complete <session-id> [final-state.json]')
        process.exit(1)
      }
      const finalState = args[1] ? JSON.parse(await fs.readFile(args[1], 'utf8')) : {}
      await SessionCheckpoint.complete(args[0], finalState)
      break
      
    case 'archive':
      const days = parseInt(args[0]) || 30
      await SessionCheckpoint.archive(days)
      break
      
    case 'analytics':
      await SessionCheckpoint.analytics(args[0])
      break
      
    default:
      console.log(`
💾 Session Checkpoint Manager

Usage:
  node session-checkpoint.js create <title> <domain> [initial-state.json]
  node session-checkpoint.js save <session-id> <state.json> <description>
  node session-checkpoint.js resume <session-id>
  node session-checkpoint.js list [--active|--completed|--recoverable] [--domain <domain>]
  node session-checkpoint.js complete <session-id> [final-state.json]
  node session-checkpoint.js archive [days]
  node session-checkpoint.js analytics [session-id]

Examples:
  # Create new development session
  node session-checkpoint.js create "User Auth Feature" frontend

  # Save progress checkpoint
  node session-checkpoint.js save session-frontend-123 current-state.json "API endpoints completed"

  # Resume interrupted session
  node session-checkpoint.js resume session-frontend-123

  # List recoverable sessions
  node session-checkpoint.js list --recoverable

  # Session analytics
  node session-checkpoint.js analytics session-frontend-123
`)
  }
}

export default SessionCheckpoint