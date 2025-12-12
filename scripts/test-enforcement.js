#!/usr/bin/env node

/**
 * Test script to validate workflow enforcement
 */

import { analyzeTask } from './diagnose-task.js';

const testCases = [
  // Should trigger complex workflow
  {
    request: "récupérer menu de ../jdr-coffee pour layout",
    expectedLevel: "COMPLEX",
    expectedMinPoints: 6
  },
  
  // Should be direct execution  
  {
    request: "How does this component work?",
    expectedLevel: "DIRECT", 
    expectedMinPoints: 0
  },
  
  // Should trigger medium workflow
  {
    request: "create a new button component",
    expectedLevel: "WORKFLOW",
    expectedMinPoints: 3
  },
  
  // Should trigger complex workflow
  {
    request: "implement user authentication system with dashboard",
    expectedLevel: "COMPLEX",
    expectedMinPoints: 6
  }
];

console.log('🧪 TESTING WORKFLOW ENFORCEMENT LOGIC\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, i) => {
  console.log(`Test ${i + 1}: "${testCase.request}"`);
  
  const analysis = analyzeTask(testCase.request);
  
  const levelCorrect = analysis.complexityLevel === testCase.expectedLevel;
  const pointsCorrect = analysis.totalPoints >= testCase.expectedMinPoints;
  
  if (levelCorrect && pointsCorrect) {
    console.log(`✅ PASS - Level: ${analysis.complexityLevel}, Points: ${analysis.totalPoints}`);
    passed++;
  } else {
    console.log(`❌ FAIL - Expected: ${testCase.expectedLevel} (${testCase.expectedMinPoints}+ pts), Got: ${analysis.complexityLevel} (${analysis.totalPoints} pts)`);
    failed++;
  }
  
  console.log('');
});

console.log(`📊 TEST RESULTS: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED - Workflow enforcement is working correctly!');
} else {
  console.log('⚠️  Some tests failed - check enforcement logic');
}