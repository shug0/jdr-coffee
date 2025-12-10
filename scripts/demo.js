#!/usr/bin/env node

import WorkflowTracer from './workflow-trace.js'
import CorpusLock from './corpus-lock.js'
import ResourceChecker from './resource-check.js'
import HealthMonitor from './health-monitor.js'

/**
 * Demo Script - Showcases the Multi-Agent Coordination System
 * 
 * Simulates a complete workflow with all coordination scripts
 */

class CoordinationDemo {
  
  static async runDemo() {
    console.log('🎭 Démonstration Système de Coordination Multi-Agents')
    console.log('=' .repeat(60))
    console.log()
    
    await this.demoHealthCheck()
    await this.demoResourceConflicts()
    await this.demoWorkflowTracing()
    await this.demoCorpusLocking()
    await this.demoFinalStatus()
  }

  static async demoHealthCheck() {
    console.log('🏥 1. Health Check Initial')
    console.log('-' .repeat(30))
    await HealthMonitor.quick()
    console.log()
  }

  static async demoResourceConflicts() {
    console.log('🔍 2. Détection de Conflits de Ressources')
    console.log('-' .repeat(42))
    
    // Test conflicting agents
    console.log('Checking conflicting agents...')
    await ResourceChecker.checkParallel(['corpus-searcher', 'corpus-enricher'])
    
    await this.sleep(1000)
    
    // Test compatible agents
    console.log('\nChecking compatible agents...')
    await ResourceChecker.suggest(['corpus-searcher', 'web-researcher', 'source-validator'])
    console.log()
  }

  static async demoWorkflowTracing() {
    console.log('📈 3. Workflow Tracing en Action')
    console.log('-' .repeat(35))
    
    const workflowId = `demo-wf-${Date.now()}`
    
    // Start workflow
    await WorkflowTracer.start(workflowId, 'Demo recherche épée médiévale', 'research')
    
    // Simulate agent steps
    const steps = [
      { agent: 'research-planner', action: 'Planification stratégie recherche', duration: 1200 },
      { agent: 'corpus-searcher', action: 'Recherche dans corpus historique', duration: 800 },
      { agent: 'web-researcher', action: 'Recherche sources académiques', duration: 2500 },
      { agent: 'source-validator', action: 'Validation croisée des sources', duration: 1100 },
      { agent: 'corpus-enricher', action: 'Enrichissement corpus', duration: 630 }
    ]
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      const stepId = await WorkflowTracer.step(workflowId, step.agent, step.action, {
        input: `Données pour ${step.agent}`,
        metadata: { demo: true }
      })
      
      // Simulate processing time
      await this.sleep(step.duration / 10) // Speed up for demo
      
      await WorkflowTracer.complete(workflowId, stepId, {
        output: `Résultat de ${step.agent}`,
        processingTime: step.duration
      })
    }
    
    await WorkflowTracer.finish(workflowId, 'success')
    
    // Show timeline
    console.log('\n📊 Timeline du workflow :')
    await WorkflowTracer.timeline(workflowId)
    console.log()
  }

  static async demoCorpusLocking() {
    console.log('🔒 4. Démonstration Corpus Locking')
    console.log('-' .repeat(37))
    
    console.log('Simulation accès concurrent au corpus...')
    
    // Register work
    await ResourceChecker.registerWork('demo-searcher', 'Demo recherche concurrente')
    
    try {
      // Acquire READ lock
      console.log('\n🔍 Acquisition lock lecture...')
      const searchLock = await CorpusLock.acquire('demo-searcher', 'read')
      
      console.log('✅ Lock lecture acquis, simulation lecture corpus...')
      await this.sleep(1000)
      
      console.log('📖 Lecture corpus terminée, libération lock...')
      await searchLock()
      
      // Try concurrent write
      console.log('\n📝 Tentative lock écriture...')
      const enrichLock = await CorpusLock.acquire('demo-enricher', 'write')
      
      console.log('✅ Lock écriture acquis, simulation mise à jour atomique...')
      await this.sleep(800)
      
      console.log('💾 Mise à jour terminée, libération lock...')
      await enrichLock()
      
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`)
    }
    
    // Unregister work
    await ResourceChecker.unregisterWork('demo-searcher')
    
    console.log('\n📊 Statut final des locks:')
    await CorpusLock.status()
    console.log()
  }

  static async demoFinalStatus() {
    console.log('📋 5. État Final du Système')
    console.log('-' .repeat(30))
    
    console.log('📈 Workflows récents:')
    await WorkflowTracer.list(3)
    
    console.log('🔄 Coordination:')
    await ResourceChecker.status()
    
    console.log('🏥 Santé système:')
    await HealthMonitor.quick()
    
    console.log()
    console.log('🎉 Démonstration terminée avec succès!')
    console.log('🔧 Tous les outils de coordination fonctionnent correctement')
  }

  // Helper
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command] = process.argv
  
  switch (command) {
    case 'run':
    case undefined:
      await CoordinationDemo.runDemo()
      break
      
    default:
      console.log(`
🎭 Coordination Demo

Usage:
  node scripts/demo.js [run]     # Run complete demo

This demo showcases:
  • Health monitoring
  • Resource conflict detection
  • Workflow tracing
  • Corpus locking
  • System coordination

Duration: ~30 seconds
`)
  }
}

export default CoordinationDemo