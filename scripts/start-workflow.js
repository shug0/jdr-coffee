#!/usr/bin/env node

/**
 * Workflow Starter Script
 * Helps initialize proper agent workflows based on domain
 */

const workflows = {
  frontend: {
    name: 'Frontend Development Workflow',
    description: 'For UI/UX tasks, components, layouts, and frontend features',
    steps: [
      'product-requirements-analyzer',
      'product-feature-specifier', 
      'frontend-planner',
      'USER_APPROVAL_GATE',
      'code-writer',
      'quality-checker',
      'test-writer (optional)'
    ],
    triggers: ['layout', 'component', 'design', 'UI', 'menu', 'page']
  },
  
  research: {
    name: 'Research & Content Workflow', 
    description: 'For historical research, data analysis, and content creation',
    steps: [
      'research-planner',
      'corpus-searcher',
      'web-researcher',
      'source-validator',
      'corpus-enricher'
    ],
    triggers: ['research', 'historical', 'data', 'analysis', 'medieval']
  },
  
  product: {
    name: 'Product Development Workflow',
    description: 'For new features, requirements analysis, and specifications', 
    steps: [
      'product-requirements-analyzer',
      'product-feature-specifier',
      'product-acceptance-definer'
    ],
    triggers: ['feature', 'requirement', 'specification', 'product']
  }
};

/**
 * Calculate complexity from user request
 */
function calculateComplexity(request) {
  const content = request.toLowerCase();
  let points = 0;
  let detectedTriggers = [];
  
  // Frontend triggers (+2)
  ['layout', 'component', 'design', 'ui', 'menu', 'page'].forEach(trigger => {
    if (content.includes(trigger)) {
      points += 2;
      detectedTriggers.push(trigger);
    }
  });
  
  // Cross-project triggers (+3)
  ['../', 'copy from', 'reuse', 'adapt'].forEach(trigger => {
    if (content.includes(trigger)) {
      points += 3;
      detectedTriggers.push(trigger);
    }
  });
  
  return { points, triggers: detectedTriggers };
}

/**
 * Suggest appropriate workflow based on request
 */
function suggestWorkflow(request) {
  const content = request.toLowerCase();
  const suggestions = [];
  
  Object.entries(workflows).forEach(([key, workflow]) => {
    const matches = workflow.triggers.filter(trigger => content.includes(trigger));
    if (matches.length > 0) {
      suggestions.push({
        workflow: key,
        matches: matches,
        priority: matches.length
      });
    }
  });
  
  return suggestions.sort((a, b) => b.priority - a.priority);
}

/**
 * Display workflow information
 */
function displayWorkflow(workflowKey) {
  const workflow = workflows[workflowKey];
  if (!workflow) {
    console.log(`❌ Unknown workflow: ${workflowKey}`);
    console.log(`Available workflows: ${Object.keys(workflows).join(', ')}`);
    return;
  }
  
  console.log(`\n🎯 ${workflow.name}`);
  console.log(`📝 ${workflow.description}\n`);
  
  console.log('📋 Required Steps:');
  workflow.steps.forEach((step, i) => {
    const isGate = step.includes('GATE') || step.includes('APPROVAL');
    const prefix = isGate ? '🚪' : '⚡';
    console.log(`  ${i + 1}. ${prefix} ${step}`);
  });
  
  console.log(`\n🔍 Triggers: ${workflow.triggers.join(', ')}`);
}

/**
 * Main CLI logic
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🚀 Claude Workflow Starter\n');
    console.log('Usage:');
    console.log('  node scripts/start-workflow.js [workflow]');
    console.log('  node scripts/start-workflow.js suggest "your request"');
    console.log('  node scripts/start-workflow.js analyze "your request"');
    console.log('\nAvailable workflows:');
    Object.keys(workflows).forEach(key => {
      console.log(`  • ${key}`);
    });
    return;
  }
  
  const command = args[0];
  
  if (command === 'suggest' && args[1]) {
    const request = args[1];
    console.log(`🔍 Analyzing request: "${request}"\n`);
    
    const suggestions = suggestWorkflow(request);
    const complexity = calculateComplexity(request);
    
    console.log(`📊 Complexity: ${complexity.points} points`);
    console.log(`🎯 Triggers: ${complexity.triggers.join(', ') || 'none'}\n`);
    
    if (suggestions.length > 0) {
      console.log('💡 Suggested workflows:');
      suggestions.forEach((suggestion, i) => {
        console.log(`  ${i + 1}. ${suggestion.workflow} (${suggestion.matches.join(', ')})`);
      });
      
      console.log(`\n🚀 Start with: node scripts/start-workflow.js ${suggestions[0].workflow}`);
    } else {
      console.log('🤔 No specific workflow suggested - may be direct execution');
    }
    return;
  }
  
  if (command === 'analyze' && args[1]) {
    const request = args[1];
    const complexity = calculateComplexity(request);
    const suggestions = suggestWorkflow(request);
    
    console.log(`\n📊 TASK ANALYSIS:`);
    console.log(`Request: "${request}"`);
    console.log(`Complexity: ${complexity.points} points`);
    console.log(`Level: ${complexity.points < 3 ? 'DIRECT' : complexity.points < 6 ? 'WORKFLOW' : 'COMPLEX'}`);
    console.log(`Triggers: ${complexity.triggers.join(', ') || 'none'}`);
    
    if (suggestions.length > 0) {
      console.log(`Suggested: ${suggestions[0].workflow}`);
    }
    
    return;
  }
  
  // Display specific workflow
  if (workflows[command]) {
    displayWorkflow(command);
    return;
  }
  
  console.log(`❌ Unknown command or workflow: ${command}`);
  console.log('Use: node scripts/start-workflow.js --help');
}

// Export for use as module
export { workflows, suggestWorkflow, calculateComplexity };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}