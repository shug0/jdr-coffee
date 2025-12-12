#!/usr/bin/env node

/**
 * Task Diagnostic Tool
 * Automatically analyzes task complexity and suggests appropriate workflows
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPLEXITY_RULES = {
  frontend: {
    keywords: ['layout', 'component', 'design', 'UI', 'menu', 'page', 'interface', 'form', 'button'],
    points: 2,
    description: 'Frontend/UI development'
  },
  crossProject: {
    keywords: ['../', 'autre projet', 'reuse', 'copy from', 'adapt', 'utiliser code de'],
    points: 3,
    description: 'Cross-project code copying'
  },
  userFacing: {
    keywords: ['interface', 'menu', 'page', 'form', 'button', 'dashboard'],
    points: 1,
    description: 'User-facing changes'
  },
  multipleFiles: {
    keywords: ['.jsx', '.tsx', '.css', '.scss', '.vue', '.html'],
    points: 1,
    description: 'Multiple file modifications'
  }
};

const WORKFLOW_PATTERNS = {
  frontend: {
    triggers: ['layout', 'component', 'design', 'UI', 'menu', 'page'],
    requiredSteps: [
      'product-requirements-analyzer',
      'frontend-planner', 
      'USER_APPROVAL_GATE',
      'code-writer',
      'quality-checker'
    ]
  },
  research: {
    triggers: ['research', 'historical', 'data', 'analysis', 'medieval', 'corpus'],
    requiredSteps: [
      'research-planner',
      'corpus-searcher',
      'web-researcher',
      'source-validator'
    ]
  },
  product: {
    triggers: ['feature', 'requirement', 'specification', 'product', 'create', 'implement'],
    requiredSteps: [
      'product-requirements-analyzer',
      'product-feature-specifier',
      'product-acceptance-definer'
    ]
  }
};

/**
 * Analyze task complexity and return detailed breakdown
 */
function analyzeTask(request) {
  const content = request.toLowerCase();
  let totalPoints = 0;
  let appliedRules = [];
  let detectedDomains = [];
  
  // Check for read-only question patterns first (override other rules)
  const questionPatterns = [
    'how does', 'what does', 'explain', 'show me', 'tell me about', 'describe',
    'why is', 'where is', 'when was', 'who made', 'which one', '?'
  ];
  
  const isQuestion = questionPatterns.some(pattern => content.includes(pattern));
  const hasActionWords = ['create', 'build', 'implement', 'add', 'copy', 'récupérer', 'modify', 'change', 'make', 'develop'].some(action => content.includes(action));
  const hasNoActionWords = !hasActionWords;
  
  if (isQuestion && hasNoActionWords) {
    // This is a pure question - direct execution allowed
    return {
      request: request,
      totalPoints: 0,
      complexityLevel: 'DIRECT',
      appliedRules: [{
        rule: 'pureQuestion',
        keywords: ['question pattern detected'],
        points: 0,
        description: 'Read-only question - no implementation'
      }],
      detectedDomains: [],
      recommendations: [{
        type: 'execution',
        message: 'Pure question detected - direct execution without workflow'
      }]
    };
  }
  
  // Apply complexity rules for implementation tasks
  Object.entries(COMPLEXITY_RULES).forEach(([ruleKey, rule]) => {
    const matchedKeywords = rule.keywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    );
    
    if (matchedKeywords.length > 0) {
      // Limit frontend keywords to avoid over-scoring simple tasks
      let points = rule.points;
      if (ruleKey === 'frontend') {
        // Cap frontend scoring: max 4 points for simple tasks, uncapped for complex
        points = hasActionWords && matchedKeywords.length > 1 ? rule.points * Math.min(matchedKeywords.length, 2) : rule.points;
      }
      
      totalPoints += points;
      appliedRules.push({
        rule: ruleKey,
        keywords: matchedKeywords,
        points: points,
        description: rule.description
      });
    }
  });
  
  // Detect domains
  Object.entries(WORKFLOW_PATTERNS).forEach(([domain, pattern]) => {
    const matches = pattern.triggers.filter(trigger => content.includes(trigger));
    if (matches.length > 0) {
      detectedDomains.push({
        domain: domain,
        matches: matches,
        confidence: matches.length,
        requiredSteps: pattern.requiredSteps
      });
    }
  });
  
  // Multiple domains bonus
  if (detectedDomains.length > 1) {
    totalPoints += 2;
    appliedRules.push({
      rule: 'multipleDomains',
      keywords: detectedDomains.map(d => d.domain),
      points: 2,
      description: 'Multiple domains detected'
    });
  }
  
  // Determine complexity level
  let complexityLevel;
  if (totalPoints <= 2) {
    complexityLevel = 'DIRECT';
  } else if (totalPoints <= 5) {
    complexityLevel = 'WORKFLOW';
  } else {
    complexityLevel = 'COMPLEX';
  }
  
  return {
    request: request,
    totalPoints: totalPoints,
    complexityLevel: complexityLevel,
    appliedRules: appliedRules,
    detectedDomains: detectedDomains.sort((a, b) => b.confidence - a.confidence),
    recommendations: generateRecommendations(detectedDomains, complexityLevel)
  };
}

/**
 * Generate workflow recommendations based on analysis
 */
function generateRecommendations(detectedDomains, complexityLevel) {
  const recommendations = [];
  
  if (complexityLevel === 'DIRECT') {
    recommendations.push({
      type: 'execution',
      message: 'Direct execution permitted with validation checkpoint'
    });
  } else {
    recommendations.push({
      type: 'workflow',
      message: `${complexityLevel} workflow required - no shortcuts permitted`
    });
  }
  
  if (detectedDomains.length > 0) {
    const primaryDomain = detectedDomains[0];
    recommendations.push({
      type: 'workflow_steps',
      domain: primaryDomain.domain,
      steps: primaryDomain.requiredSteps,
      message: `Start with ${primaryDomain.domain} workflow`
    });
  }
  
  if (complexityLevel === 'COMPLEX') {
    recommendations.push({
      type: 'session_tracking',
      message: 'Consider session tracking for this complex task'
    });
  }
  
  return recommendations;
}

/**
 * Format and display analysis results
 */
function displayAnalysis(analysis) {
  console.log('\n🔍 TASK COMPLEXITY ANALYSIS');
  console.log('='.repeat(50));
  console.log(`📝 Request: "${analysis.request}"`);
  console.log(`📊 Total Points: ${analysis.totalPoints}`);
  console.log(`🎯 Complexity Level: ${analysis.complexityLevel}`);
  
  if (analysis.appliedRules.length > 0) {
    console.log('\n📋 Applied Rules:');
    analysis.appliedRules.forEach(rule => {
      console.log(`  • ${rule.description}: ${rule.keywords.join(', ')} (+${rule.points})`);
    });
  }
  
  if (analysis.detectedDomains.length > 0) {
    console.log('\n🏗️ Detected Domains:');
    analysis.detectedDomains.forEach((domain, i) => {
      const primary = i === 0 ? ' (PRIMARY)' : '';
      console.log(`  ${i + 1}. ${domain.domain}${primary}: ${domain.matches.join(', ')}`);
    });
  }
  
  console.log('\n💡 Recommendations:');
  analysis.recommendations.forEach(rec => {
    switch (rec.type) {
      case 'execution':
        console.log(`  ✅ ${rec.message}`);
        break;
      case 'workflow':
        console.log(`  ⚡ ${rec.message}`);
        break;
      case 'workflow_steps':
        console.log(`  📋 ${rec.message}:`);
        rec.steps.forEach((step, i) => {
          const isGate = step.includes('GATE') || step.includes('APPROVAL');
          const prefix = isGate ? '🚪' : '  ';
          console.log(`     ${i + 1}. ${prefix} ${step}`);
        });
        break;
      case 'session_tracking':
        console.log(`  🔄 ${rec.message}`);
        break;
    }
  });
  
  console.log('\n🚀 Next Steps:');
  if (analysis.complexityLevel === 'DIRECT') {
    console.log('  1. Proceed with validation checkpoint');
    console.log('  2. Execute task directly');
  } else {
    const primaryDomain = analysis.detectedDomains[0];
    if (primaryDomain) {
      console.log(`  1. Start: node scripts/start-workflow.js ${primaryDomain.domain}`);
      console.log('  2. Follow workflow sequence strictly');
    }
  }
}

/**
 * Save analysis to file for reference
 */
function saveAnalysis(analysis, outputFile) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp: timestamp,
    analysis: analysis,
    version: '1.0.0'
  };
  
  try {
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n💾 Analysis saved to: ${outputFile}`);
  } catch (error) {
    console.error(`❌ Failed to save analysis: ${error.message}`);
  }
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔍 Task Complexity Diagnostic Tool\n');
    console.log('Usage:');
    console.log('  node scripts/diagnose-task.js "your task description"');
    console.log('  node scripts/diagnose-task.js "your task" --save report.json');
    console.log('\nExamples:');
    console.log('  node scripts/diagnose-task.js "récupérer menu de ../jdr-coffee pour layout"');
    console.log('  node scripts/diagnose-task.js "create user authentication system"');
    return;
  }
  
  const request = args[0];
  const saveFlag = args.includes('--save');
  const outputFile = saveFlag ? (args[args.indexOf('--save') + 1] || 'task-analysis.json') : null;
  
  const analysis = analyzeTask(request);
  displayAnalysis(analysis);
  
  if (saveFlag) {
    saveAnalysis(analysis, outputFile);
  }
}

// Export for use as module
export { analyzeTask, displayAnalysis, COMPLEXITY_RULES, WORKFLOW_PATTERNS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}