#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

/**
 * Corpus Lock System for Safe Concurrent Access
 * 
 * Implements safe READ/WRITE locking for corpus operations
 * Based on Anthropic's recommended file-based coordination
 */

class CorpusLock {
  static lockDir = '.claude/state/locks'
  static lockTimeout = 30000 // 30 seconds
  static retryInterval = 100 // 100ms

  /**
   * Acquire a lock for corpus access
   * @param {string} agentName - Name of the requesting agent
   * @param {string} mode - 'read' or 'write'
   * @returns {Promise<Function>} Release function
   */
  static async acquire(agentName, mode = 'read') {
    await this.ensureLockDir()
    
    const lockId = `${agentName}-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const lockFile = path.join(this.lockDir, `${lockId}.lock`)
    
    const lockData = {
      agent: agentName,
      mode: mode,
      timestamp: Date.now(),
      pid: process.pid,
      lockId: lockId
    }

    // For WRITE locks, wait for all existing locks to clear
    if (mode === 'write') {
      await this.waitForExclusiveAccess()
    }
    
    // For READ locks, wait only for WRITE locks to clear
    if (mode === 'read') {
      await this.waitForWriteLocksToClean()
    }

    try {
      await fs.writeFile(lockFile, JSON.stringify(lockData, null, 2))
      console.log(`🔒 [${agentName}] Corpus lock acquired (${mode.toUpperCase()})`)
      
      return async () => {
        try {
          await fs.unlink(lockFile)
          console.log(`🔓 [${agentName}] Corpus lock released`)
        } catch (error) {
          console.warn(`⚠️ [${agentName}] Failed to release lock: ${error.message}`)
        }
      }
    } catch (error) {
      throw new Error(`Failed to acquire lock: ${error.message}`)
    }
  }

  /**
   * Wait for all locks to clear (for exclusive write access)
   */
  static async waitForExclusiveAccess() {
    const startTime = Date.now()
    
    while (Date.now() - startTime < this.lockTimeout) {
      const existingLocks = await this.getActiveLocks()
      
      if (existingLocks.length === 0) {
        return // No locks, safe to proceed
      }
      
      // Clean stale locks
      await this.cleanStaleLocks()
      
      await new Promise(resolve => setTimeout(resolve, this.retryInterval))
    }
    
    throw new Error('Timeout waiting for exclusive corpus access')
  }

  /**
   * Wait for write locks to clear (for read access)
   */
  static async waitForWriteLocksToClean() {
    const startTime = Date.now()
    
    while (Date.now() - startTime < this.lockTimeout) {
      const activeLocks = await this.getActiveLocks()
      const writeLocks = activeLocks.filter(lock => lock.mode === 'write')
      
      if (writeLocks.length === 0) {
        return // No write locks, safe for read
      }
      
      await this.cleanStaleLocks()
      await new Promise(resolve => setTimeout(resolve, this.retryInterval))
    }
    
    throw new Error('Timeout waiting for write locks to clear')
  }

  /**
   * Get list of currently active locks
   */
  static async getActiveLocks() {
    try {
      const files = await fs.readdir(this.lockDir)
      const lockFiles = files.filter(f => f.endsWith('.lock'))
      
      const locks = []
      for (const file of lockFiles) {
        try {
          const content = await fs.readFile(path.join(this.lockDir, file), 'utf8')
          const lockData = JSON.parse(content)
          locks.push({ ...lockData, file })
        } catch (error) {
          // Invalid lock file, will be cleaned up
        }
      }
      
      return locks
    } catch (error) {
      return []
    }
  }

  /**
   * Remove locks older than timeout
   */
  static async cleanStaleLocks() {
    const locks = await this.getActiveLocks()
    const now = Date.now()
    
    for (const lock of locks) {
      if (now - lock.timestamp > this.lockTimeout) {
        try {
          await fs.unlink(path.join(this.lockDir, lock.file))
          console.log(`🧹 Cleaned stale lock: ${lock.agent} (${lock.mode})`)
        } catch (error) {
          // Lock already removed
        }
      }
    }
  }

  /**
   * Get current lock status
   */
  static async status() {
    const locks = await this.getActiveLocks()
    
    console.log('\n📊 Corpus Lock Status')
    console.log('=====================')
    
    if (locks.length === 0) {
      console.log('🟢 FREE - No active locks')
    } else {
      console.log(`🔒 ${locks.length} active lock(s):`)
      locks.forEach(lock => {
        const age = Math.round((Date.now() - lock.timestamp) / 1000)
        console.log(`  • ${lock.agent} (${lock.mode.toUpperCase()}) - ${age}s ago`)
      })
    }
    
    return locks
  }

  /**
   * Force release all locks (emergency cleanup)
   */
  static async forceCleanup() {
    try {
      const files = await fs.readdir(this.lockDir)
      const lockFiles = files.filter(f => f.endsWith('.lock'))
      
      for (const file of lockFiles) {
        await fs.unlink(path.join(this.lockDir, file))
      }
      
      console.log(`🧹 Force cleanup: removed ${lockFiles.length} lock(s)`)
    } catch (error) {
      console.error('Failed to force cleanup:', error.message)
    }
  }

  /**
   * Ensure lock directory exists
   */
  static async ensureLockDir() {
    try {
      await fs.mkdir(this.lockDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command, agentName, mode] = process.argv
  
  switch (command) {
    case 'acquire':
      if (!agentName) {
        console.error('Usage: node corpus-lock.js acquire <agent-name> [read|write]')
        process.exit(1)
      }
      try {
        const release = await CorpusLock.acquire(agentName, mode || 'read')
        console.log('Lock acquired. Press Ctrl+C to release.')
        process.on('SIGINT', async () => {
          await release()
          process.exit(0)
        })
      } catch (error) {
        console.error(`❌ Failed to acquire lock: ${error.message}`)
        process.exit(1)
      }
      break
      
    case 'status':
      await CorpusLock.status()
      break
      
    case 'cleanup':
      await CorpusLock.forceCleanup()
      break
      
    default:
      console.log(`
📖 Corpus Lock Manager

Usage:
  node corpus-lock.js acquire <agent-name> [read|write]  # Acquire lock
  node corpus-lock.js status                            # Show current locks  
  node corpus-lock.js cleanup                           # Force cleanup all locks

Examples:
  node corpus-lock.js acquire corpus-searcher read
  node corpus-lock.js acquire corpus-enricher write
  node corpus-lock.js status
`)
  }
}

export default CorpusLock