#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

/**
 * Health Monitoring System for Multi-Agent Infrastructure
 * 
 * Provides real-time status and health checks for the agent system
 * Following Anthropic's monitoring recommendations
 */

class HealthMonitor {
  static statusDir = '.claude/state/health'
  static healthFile = path.join(HealthMonitor.statusDir, 'system-health.json')

  /**
   * Perform comprehensive system health check
   */
  static async check() {
    console.log('🏥 System Health Check')
    console.log('====================')

    const health = {
      timestamp: Date.now(),
      overall: 'healthy',
      components: {},
      metrics: {},
      issues: []
    }

    // Check corpus health
    health.components.corpus = await this.checkCorpus()
    
    // Check agent system health  
    health.components.agents = await this.checkAgents()
    
    // Check coordination system
    health.components.coordination = await this.checkCoordination()
    
    // Check sessions
    health.components.sessions = await this.checkSessions()
    
    // Calculate overall health
    health.overall = this.calculateOverallHealth(health.components)
    
    // Save health report
    await this.saveHealth(health)
    
    // Display results
    this.displayHealth(health)
    
    return health
  }

  /**
   * Check corpus system health
   */
  static async checkCorpus() {
    const check = {
      status: 'healthy',
      issues: [],
      metrics: {}
    }

    try {
      // Check if corpus index exists and is readable
      const indexPath = 'docs/historical-corpus/index.json'
      
      try {
        const indexContent = await fs.readFile(indexPath, 'utf8')
        const index = JSON.parse(indexContent)
        
        check.metrics.entries = index.entries?.length || 0
        check.metrics.lastUpdated = index.lastUpdated || 'unknown'
        
        console.log(`✅ Corpus: ${check.metrics.entries} entries available`)
      } catch (error) {
        check.status = 'warning'
        check.issues.push(`Corpus index not accessible: ${error.message}`)
        console.log(`⚠️ Corpus: Index not accessible`)
      }

      // Check for active locks
      try {
        const lockDir = '.claude/state/locks'
        const files = await fs.readdir(lockDir)
        const lockFiles = files.filter(f => f.endsWith('.lock'))
        
        check.metrics.activeLocks = lockFiles.length
        
        if (lockFiles.length > 0) {
          console.log(`🔒 Corpus: ${lockFiles.length} active lock(s)`)
        } else {
          console.log(`🟢 Corpus: No active locks`)
        }
      } catch (error) {
        check.metrics.activeLocks = 0
      }

    } catch (error) {
      check.status = 'error'
      check.issues.push(`Corpus system error: ${error.message}`)
      console.log(`❌ Corpus: System error`)
    }

    return check
  }

  /**
   * Check agent system health
   */
  static async checkAgents() {
    const check = {
      status: 'healthy',
      issues: [],
      metrics: {}
    }

    try {
      // Count available agents
      const agentsDir = '.claude/agents'
      const domains = await fs.readdir(agentsDir)
      
      let totalAgents = 0
      const domainCounts = {}

      for (const domain of domains) {
        if (domain === 'resources' || domain.startsWith('.')) continue
        
        try {
          const domainPath = path.join(agentsDir, domain)
          const stat = await fs.stat(domainPath)
          
          if (stat.isDirectory()) {
            const agents = await fs.readdir(domainPath)
            const validAgents = agents.filter(a => !a.startsWith('.'))
            
            domainCounts[domain] = validAgents.length
            totalAgents += validAgents.length
          }
        } catch (error) {
          // Skip invalid directories
        }
      }

      check.metrics.totalAgents = totalAgents
      check.metrics.domainCounts = domainCounts

      console.log(`🤖 Agents: ${totalAgents} agents across ${Object.keys(domainCounts).length} domains`)
      Object.entries(domainCounts).forEach(([domain, count]) => {
        console.log(`   • ${domain}: ${count} agents`)
      })

    } catch (error) {
      check.status = 'error'
      check.issues.push(`Agent system error: ${error.message}`)
      console.log(`❌ Agents: System error`)
    }

    return check
  }

  /**
   * Check coordination system health
   */
  static async checkCoordination() {
    const check = {
      status: 'healthy',
      issues: [],
      metrics: {}
    }

    try {
      // Check coordination registry
      const coordinationDir = '.claude/state/coordination'
      const registryFile = path.join(coordinationDir, 'active_work_registry.json')
      
      try {
        const registryContent = await fs.readFile(registryFile, 'utf8')
        const registry = JSON.parse(registryContent)
        
        check.metrics.activeWork = Object.keys(registry.active_work || {}).length
        check.metrics.completedWork = (registry.completed_work || []).length
        
        console.log(`🔄 Coordination: ${check.metrics.activeWork} active, ${check.metrics.completedWork} completed`)
      } catch (error) {
        check.metrics.activeWork = 0
        check.metrics.completedWork = 0
        console.log(`🟡 Coordination: No registry found (system ready)`)
      }

    } catch (error) {
      check.status = 'warning'
      check.issues.push(`Coordination system error: ${error.message}`)
      console.log(`⚠️ Coordination: System warning`)
    }

    return check
  }

  /**
   * Check sessions health
   */
  static async checkSessions() {
    const check = {
      status: 'healthy',
      issues: [],
      metrics: {}
    }

    try {
      // Check sessions directory
      const sessionsDir = '.claude/state/sessions'
      
      try {
        const files = await fs.readdir(sessionsDir)
        const sessionFiles = files.filter(f => f.endsWith('.json'))
        
        check.metrics.totalSessions = sessionFiles.length
        
        // Check for active sessions
        let activeSessions = 0
        for (const file of sessionFiles) {
          try {
            const content = await fs.readFile(path.join(sessionsDir, file), 'utf8')
            const session = JSON.parse(content)
            if (session.status === 'active') {
              activeSessions++
            }
          } catch (error) {
            // Skip malformed session files
          }
        }
        
        check.metrics.activeSessions = activeSessions
        
        console.log(`📂 Sessions: ${check.metrics.totalSessions} total, ${activeSessions} active`)
      } catch (error) {
        check.metrics.totalSessions = 0
        check.metrics.activeSessions = 0
        console.log(`🟡 Sessions: No sessions directory (system ready)`)
      }

    } catch (error) {
      check.status = 'warning'
      check.issues.push(`Sessions system error: ${error.message}`)
      console.log(`⚠️ Sessions: System warning`)
    }

    return check
  }

  /**
   * Check workflow traces
   */
  static async checkWorkflows() {
    console.log('\n📈 Workflow Health')
    console.log('==================')
    
    try {
      const tracesDir = '.claude/state/traces'
      const files = await fs.readdir(tracesDir)
      const traceFiles = files.filter(f => f.endsWith('.json'))
      
      let activeWorkflows = 0
      let completedWorkflows = 0
      let errorWorkflows = 0
      
      for (const file of traceFiles.slice(-10)) { // Check last 10
        try {
          const content = await fs.readFile(path.join(tracesDir, file), 'utf8')
          const workflow = JSON.parse(content)
          
          switch (workflow.status) {
            case 'running':
              activeWorkflows++
              break
            case 'success':
              completedWorkflows++
              break
            case 'error':
              errorWorkflows++
              break
          }
        } catch (error) {
          // Skip malformed files
        }
      }
      
      console.log(`📊 Recent workflows: ${completedWorkflows} completed, ${activeWorkflows} active, ${errorWorkflows} failed`)
      
      return {
        totalTraces: traceFiles.length,
        active: activeWorkflows,
        completed: completedWorkflows,
        errors: errorWorkflows
      }
    } catch (error) {
      console.log('🟡 Workflows: No traces found (system ready)')
      return { totalTraces: 0, active: 0, completed: 0, errors: 0 }
    }
  }

  /**
   * Monitor system continuously
   * @param {number} interval - Check interval in seconds
   */
  static async monitor(interval = 30) {
    console.log(`🔄 Starting health monitor (checking every ${interval}s)`)
    console.log('Press Ctrl+C to stop\n')

    const performCheck = async () => {
      const timestamp = new Date().toLocaleTimeString()
      console.log(`\n[${timestamp}] Health Check`)
      console.log('-'.repeat(40))
      
      const health = await this.check()
      
      if (health.overall !== 'healthy') {
        console.log('\n🚨 ISSUES DETECTED:')
        Object.values(health.components).forEach(component => {
          component.issues.forEach(issue => console.log(`   • ${issue}`))
        })
      }
      
      console.log(`\nNext check in ${interval}s...`)
    }

    // Initial check
    await performCheck()
    
    // Set up interval
    const intervalId = setInterval(performCheck, interval * 1000)
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      clearInterval(intervalId)
      console.log('\n\n👋 Health monitor stopped')
      process.exit(0)
    })
  }

  /**
   * Get quick status summary
   */
  static async quick() {
    console.log('⚡ Quick Status Check')
    
    // Quick corpus check
    try {
      await fs.access('docs/historical-corpus/index.json')
      console.log('✅ Corpus accessible')
    } catch {
      console.log('❌ Corpus not accessible')
    }
    
    // Quick agents check
    try {
      const agents = await fs.readdir('.claude/agents')
      const domains = agents.filter(a => !a.startsWith('.') && a !== 'resources')
      console.log(`✅ ${domains.length} agent domains found`)
    } catch {
      console.log('❌ Agent system not accessible')
    }
    
    // Quick locks check
    try {
      const locks = await fs.readdir('.claude/state/locks')
      const lockFiles = locks.filter(f => f.endsWith('.lock'))
      if (lockFiles.length > 0) {
        console.log(`⚠️ ${lockFiles.length} active lock(s)`)
      } else {
        console.log('✅ No active locks')
      }
    } catch {
      console.log('✅ No locks (system ready)')
    }
  }

  // Helper methods
  static calculateOverallHealth(components) {
    const statuses = Object.values(components).map(c => c.status)
    
    if (statuses.includes('error')) return 'error'
    if (statuses.includes('warning')) return 'warning'
    return 'healthy'
  }

  static displayHealth(health) {
    console.log('\n🎯 Overall Health Summary')
    console.log('========================')
    
    const statusIcon = health.overall === 'healthy' ? '🟢' : 
                      health.overall === 'warning' ? '🟡' : '🔴'
    
    console.log(`${statusIcon} System Status: ${health.overall.toUpperCase()}`)
    
    if (health.overall !== 'healthy') {
      const allIssues = Object.values(health.components)
        .flatMap(c => c.issues)
      
      console.log(`\n⚠️ Issues (${allIssues.length}):`)
      allIssues.forEach(issue => console.log(`   • ${issue}`))
    }
    
    console.log(`\nLast checked: ${new Date(health.timestamp).toLocaleString()}`)
  }

  static async saveHealth(health) {
    try {
      await fs.mkdir(this.statusDir, { recursive: true })
      await fs.writeFile(this.healthFile, JSON.stringify(health, null, 2))
    } catch (error) {
      // Health file not critical
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command, ...args] = process.argv
  
  switch (command) {
    case 'check':
      await HealthMonitor.check()
      break
      
    case 'quick':
      await HealthMonitor.quick()
      break
      
    case 'workflows':
      await HealthMonitor.checkWorkflows()
      break
      
    case 'monitor':
      const interval = parseInt(args[0]) || 30
      await HealthMonitor.monitor(interval)
      break
      
    default:
      console.log(`
🏥 Health Monitoring System

Usage:
  node health-monitor.js check              # Full health check
  node health-monitor.js quick              # Quick status check
  node health-monitor.js workflows          # Check workflow traces
  node health-monitor.js monitor [interval] # Continuous monitoring

Examples:
  node health-monitor.js check
  node health-monitor.js monitor 60    # Check every 60 seconds
`)
  }
}

export default HealthMonitor