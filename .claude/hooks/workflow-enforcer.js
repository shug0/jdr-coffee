/**
 * Claude Code Workflow Enforcer Hook
 * Blocks direct code writing for frontend tasks without proper workflow
 */

const FRONTEND_TRIGGERS = [
  'layout', 'component', 'design', 'UI', 'menu', 'page', 'interface',
  'récupérer', 'copy from', 'reuse', 'adapt', 'utiliser code de',
  '../', 'autre projet', 'existing code from'
];

const CROSS_PROJECT_TRIGGERS = [
  '../', 'autre projet', 'reuse', 'copy from', 'adapt'
];

const CODE_MODIFICATION_TOOLS = ['Write', 'Edit', 'MultiEdit'];
const FRONTEND_FILES = ['.jsx', '.tsx', '.css', '.scss', '.vue', '.html'];

/**
 * Calculate complexity points based on request content
 */
function calculateComplexity(requestContent) {
  let points = 0;
  let triggers = [];
  
  const content = requestContent.toLowerCase();
  
  // Frontend keywords (+2 each)
  FRONTEND_TRIGGERS.forEach(trigger => {
    if (content.includes(trigger.toLowerCase())) {
      points += 2;
      triggers.push(`${trigger}(+2)`);
    }
  });
  
  // Cross-project copying (+3)
  CROSS_PROJECT_TRIGGERS.forEach(trigger => {
    if (content.includes(trigger.toLowerCase())) {
      points += 3;
      triggers.push(`${trigger}(+3)`);
    }
  });
  
  // Multiple domains detection
  const domains = [];
  if (content.includes('frontend') || content.includes('ui') || content.includes('component')) {
    domains.push('frontend');
  }
  if (content.includes('product') || content.includes('feature') || content.includes('requirement')) {
    domains.push('product');
  }
  if (content.includes('research') || content.includes('data') || content.includes('analysis')) {
    domains.push('research');
  }
  
  if (domains.length > 1) {
    points += 2;
    triggers.push(`multiple-domains(+2)`);
  }
  
  return { points, triggers, level: points < 3 ? 'DIRECT' : points < 6 ? 'WORKFLOW' : 'COMPLEX' };
}

/**
 * Check if frontend workflow was properly followed
 */
function hasFollowedWorkflow(context) {
  const messages = context.messages || [];
  
  // Look for evidence of proper workflow steps
  const hasProductAnalysis = messages.some(msg => 
    msg.content && msg.content.includes('product-requirements-analyzer')
  );
  
  const hasFrontendPlanning = messages.some(msg =>
    msg.content && msg.content.includes('frontend-planner')
  );
  
  const hasUserApproval = messages.some(msg =>
    msg.content && (
      msg.content.includes('PROCEED') || 
      msg.content.includes('approved') ||
      msg.content.includes('validation gate')
    )
  );
  
  return {
    hasProductAnalysis,
    hasFrontendPlanning,
    hasUserApproval,
    isComplete: hasProductAnalysis && hasFrontendPlanning && hasUserApproval
  };
}

/**
 * Main hook function - executed before tool use
 */
module.exports = {
  preToolUse: async (tool, params, context) => {
    try {
      // Only check code modification tools
      if (!CODE_MODIFICATION_TOOLS.includes(tool.name)) {
        return; // Allow non-code tools
      }
      
      // Get the full conversation context
      const allMessages = context.messages || [];
      const fullRequest = allMessages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' ');
      
      // Calculate complexity
      const complexity = calculateComplexity(fullRequest);
      
      // If complexity requires workflow, check if it was followed
      if (complexity.points >= 3) {
        const workflowStatus = hasFollowedWorkflow(context);
        
        if (!workflowStatus.isComplete) {
          // Determine what's missing
          const missing = [];
          if (!workflowStatus.hasProductAnalysis) {
            missing.push('product-requirements-analyzer');
          }
          if (!workflowStatus.hasFrontendPlanning) {
            missing.push('frontend-planner');
          }
          if (!workflowStatus.hasUserApproval) {
            missing.push('user validation gate');
          }
          
          // Check if target file is frontend-related
          const targetFile = params.file_path || '';
          const isFrontendFile = FRONTEND_FILES.some(ext => targetFile.includes(ext));
          
          if (isFrontendFile || complexity.points >= 3) {
            throw new Error(`
🛑 WORKFLOW ENFORCEMENT BLOCKED

Task Analysis:
• Request: "${fullRequest.substring(0, 100)}..."
• Complexity: ${complexity.points} points (${complexity.level})
• Triggers: ${complexity.triggers.join(', ')}
• Attempted: ${tool.name} on ${targetFile}

Missing Required Steps:
${missing.map(step => `• ${step}`).join('\n')}

REQUIRED workflow for frontend tasks:
1. product-requirements-analyzer (dialogue requirements)
2. frontend-planner (technical architecture)  
3. User validation gate (MANDATORY approval)
4. code-writer (only after approval)

Current Status:
• Product analysis: ${workflowStatus.hasProductAnalysis ? '✅' : '❌'}
• Frontend planning: ${workflowStatus.hasFrontendPlanning ? '✅' : '❌'}  
• User approval: ${workflowStatus.hasUserApproval ? '✅' : '❌'}

To proceed: Start with "Let's follow the product workflow first"
            `);
          }
        }
      }
      
      // Log successful validation (for debugging)
      console.log(`✅ Workflow validation passed for ${tool.name} (${complexity.points} pts)`);
      
    } catch (error) {
      // Re-throw workflow violations
      if (error.message.includes('WORKFLOW ENFORCEMENT BLOCKED')) {
        throw error;
      }
      
      // Log other errors but don't block execution
      console.error('Workflow enforcer error:', error.message);
    }
  },
  
  postToolUse: async (tool, params, result, context) => {
    // Optional: Log successful code modifications for audit trail
    if (CODE_MODIFICATION_TOOLS.includes(tool.name) && result.success) {
      console.log(`📝 Code modified: ${tool.name} on ${params.file_path || 'unknown'}`);
    }
  }
};