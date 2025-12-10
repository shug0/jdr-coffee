# Product Management Best Practices

**Purpose**: Best practices and patterns for the product management agent domain

## Requirements Analysis Best Practices

### Critical Questions Framework

**Always Ask About:**
- **Edge Cases**: What happens when X fails? What if the user does Y?
- **Error States**: How should errors be displayed? What are recovery paths?
- **User Personas**: Who are the different types of users? What are their needs?
- **Business Rules**: What are the validation rules? What data is required?
- **Integration Points**: How does this connect to existing systems?
- **Performance Expectations**: What are the speed/load requirements?
- **Security Considerations**: What data needs protection? Who has access?
- **Accessibility Requirements**: What standards must be met?

### Red Flags in Requirements

**Immediately Clarify When You See:**
- Vague terms like "intuitive", "user-friendly", "simple"
- Missing error scenarios or edge cases
- No mention of different user types or permissions
- Unclear data validation or business rules
- No performance or scalability requirements
- Missing integration or dependency information
- Ambiguous success criteria

### Requirements Quality Gates

**Don't proceed without:**
- [ ] Clear user stories with measurable acceptance criteria
- [ ] Defined error handling and validation rules
- [ ] Identified user personas and use cases
- [ ] Specified success and failure scenarios
- [ ] Documented integration points and dependencies
- [ ] Performance and security requirements

## Feature Specification Patterns

### User Story Templates

**Standard Format:**
```
As a [specific user type]
I want [specific capability]
So that [specific benefit/value]

Acceptance Criteria:
- Given [specific context]
- When [specific action]
- Then [specific measurable result]
```

**Complex Feature Format:**
```
Epic: [High-level feature name]

User Stories:
1. As a [persona], I want [capability] so that [benefit]
2. As a [persona], I want [capability] so that [benefit]

Cross-Cutting Requirements:
- Performance: [specific metrics]
- Security: [specific requirements]
- Accessibility: [specific standards]
```

### API Contract Standards

**Always Include:**
- Request/response TypeScript interfaces
- Validation rules and constraints
- Error response formats and codes
- Authentication and authorization requirements
- Rate limiting specifications
- API versioning strategy

### UI Component Specifications

**Standard Format:**
```typescript
interface ComponentProps {
  // Required props with clear types
  requiredProp: string;
  
  // Optional props with defaults
  optionalProp?: boolean; // defaults to false
  
  // Event handlers
  onAction?: (data: ActionData) => void;
}

interface ComponentState {
  // Internal state if needed
}

// Accessibility requirements
// Responsive behavior
// Styling variants
```

## Feasibility Assessment Patterns

### Complexity Estimation Guidelines

**Simple (1-2 days):**
- Minor UI updates (text changes, styling tweaks)
- Basic CRUD operations following existing patterns
- Single component additions
- Configuration changes

**Medium (3-5 days):**
- New UI components with moderate logic
- API endpoint additions following existing patterns
- Form validation and error handling
- State management updates

**Complex (1-2 weeks):**
- Multiple connected components
- New API patterns or architectural changes
- Complex business logic implementation
- Integration with external services

**Epic (2+ weeks):**
- Major architectural changes
- New technology or framework adoption
- Multi-system integration
- Significant database schema changes

### Risk Assessment Framework

**Technical Risk Factors:**
- Breaking changes to existing APIs
- Performance impact on existing features
- New technology or unfamiliar patterns
- Complex data migrations
- Third-party service dependencies

**Business Risk Factors:**
- Impact on existing user workflows
- Regulatory or compliance implications
- Revenue or conversion impact
- Support and maintenance overhead

### Implementation Strategy Patterns

**Incremental Approach:**
1. **Phase 1**: Core functionality MVP
2. **Phase 2**: Enhanced features and edge cases
3. **Phase 3**: Optimization and polish

**Feature Flag Strategy:**
- Gradual rollout with killswitch capability
- A/B testing for UX validation
- Safe rollback without deployments

**Refactoring Strategy:**
- Backward compatibility during transition
- Gradual migration with validation
- Old pattern deprecation timeline

## Acceptance Criteria Patterns

### Test Scenario Categories

**Happy Path (Priority: High)**
- Primary user workflows
- Standard data inputs
- Optimal system conditions

**Edge Cases (Priority: Medium-High)**
- Boundary conditions (empty data, maximum limits)
- Unusual but valid user behavior
- System stress conditions

**Error Scenarios (Priority: High)**
- Invalid inputs and validation failures
- Network connectivity issues
- Server errors and timeouts
- Unauthorized access attempts

**Integration Scenarios (Priority: Medium)**
- Cross-feature interactions
- Third-party service integration
- Data synchronization between systems

### Definition of Done Template

```markdown
## Definition of Done: [Feature Name]

### Functional Requirements
- [ ] All user stories completed with acceptance criteria met
- [ ] All edge cases and error scenarios handled
- [ ] Integration with existing features working correctly
- [ ] Data validation and business rules implemented

### Technical Requirements
- [ ] Unit tests written and passing (>90% coverage)
- [ ] Integration tests covering key workflows
- [ ] Performance requirements met
- [ ] Security review completed
- [ ] Accessibility standards met (WCAG 2.1 AA)

### Quality Requirements
- [ ] Code review completed
- [ ] TypeScript compilation without errors
- [ ] Linting and formatting standards met
- [ ] No critical or high-severity bugs

### Documentation
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] Code comments for complex logic
- [ ] Change log updated

### Deployment
- [ ] Feature flags configured (if applicable)
- [ ] Monitoring and alerting set up
- [ ] Rollback plan documented
- [ ] Stakeholder sign-off received
```

## Common Antipatterns to Avoid

### Requirements Antipatterns
- ❌ Accepting vague requirements without clarification
- ❌ Skipping error scenario analysis
- ❌ Ignoring non-functional requirements
- ❌ Assuming user intent without validation

### Specification Antipatterns
- ❌ Writing acceptance criteria that aren't testable
- ❌ Missing API error response specifications
- ❌ Incomplete component interface definitions
- ❌ Forgetting accessibility requirements

### Feasibility Antipatterns
- ❌ Underestimating complexity for "simple" features
- ❌ Ignoring technical debt impact
- ❌ Not considering performance implications
- ❌ Overlooking security considerations

### Acceptance Antipatterns
- ❌ Only testing happy paths
- ❌ Ambiguous test scenarios
- ❌ Missing performance criteria
- ❌ Incomplete definition of done

## Integration with Development

### Handoff to Frontend Team

**Provide:**
- Complete feature specification document
- API contracts with TypeScript interfaces
- UI component specifications with props
- Acceptance criteria and test scenarios
- Definition of done checklist

**Validate:**
- All questions answered and ambiguities resolved
- Technical feasibility confirmed
- Effort estimates aligned with timeline
- Dependencies identified and available

### Feedback Loop

**Post-Implementation Review:**
- Were specifications accurate and complete?
- What clarifications were needed during development?
- How close were effort estimates to actual time?
- What could be improved in the specification process?

### Continuous Improvement

- Track specification quality metrics
- Identify common gaps or issues
- Update templates and patterns
- Share learnings across product team