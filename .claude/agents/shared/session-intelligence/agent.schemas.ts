import { z } from 'zod'

// Session metadata schema
export const SessionMetadataSchema = z.object({
  sessionId: z.string().min(1),
  title: z.string().min(1),
  domain: z.enum(['frontend', 'research', 'product', 'cross-domain']),
  status: z.enum(['active', 'paused', 'completed', 'archived']),
  createdAt: z.string().datetime(),
  lastUpdated: z.string().datetime(),
  estimatedSize: z.enum(['small', 'medium', 'large']),
  currentPhase: z.enum(['planning', 'implementation', 'testing', 'review', 'deployment'])
})

// Session creation input
export const SessionCreateInputSchema = z.object({
  title: z.string().min(1).describe('Feature or task title'),
  domain: z.enum(['frontend', 'research', 'product', 'cross-domain']).describe('Primary domain'),
  estimatedSize: z.enum(['small', 'medium', 'large']).describe('Estimated complexity'),
  initialPlan: z.string().optional().describe('Initial plan content'),
  initialContext: z.string().optional().describe('Initial technical context'),
  initialTasks: z.array(z.string()).optional().describe('Initial task list')
})

// Session update input
export const SessionUpdateInputSchema = z.object({
  sessionId: z.string().min(1),
  operation: z.enum(['update_progress', 'add_context', 'add_tasks', 'mark_completed', 'change_phase']),
  data: z.object({
    completedTasks: z.array(z.string()).optional(),
    newTasks: z.array(z.string()).optional(),
    contextUpdate: z.string().optional(),
    newPhase: z.enum(['planning', 'implementation', 'testing', 'review', 'deployment']).optional(),
    notes: z.string().optional()
  }).optional()
})

// Session resume input
export const SessionResumeInputSchema = z.object({
  sessionId: z.string().min(1)
})

// Task item schema
export const TaskItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked']),
  assignedTo: z.string().optional(),
  completedAt: z.string().datetime().optional(),
  phase: z.string()
})

// Session manager outputs
export const SessionCreateOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  sessionId: z.string().optional(),
  filesCreated: z.array(z.string()).optional(),
  error: z.string().optional()
})

export const SessionUpdateOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  sessionId: z.string(),
  filesUpdated: z.array(z.string()).optional(),
  nextActions: z.array(z.string()).optional(),
  error: z.string().optional()
})

export const SessionResumeOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  sessionId: z.string(),
  summary: z.string().optional(),
  currentPhase: z.string().optional(),
  nextActions: z.array(z.string()).optional(),
  recentProgress: z.array(z.string()).optional(),
  technicalContext: z.string().optional(),
  error: z.string().optional()
})

export const SessionListOutputSchema = z.object({
  status: z.enum(['success', 'error']),
  sessions: z.array(SessionMetadataSchema).optional(),
  error: z.string().optional()
})

// Type exports
export type SessionMetadata = z.infer<typeof SessionMetadataSchema>
export type SessionCreateInput = z.infer<typeof SessionCreateInputSchema>
export type SessionUpdateInput = z.infer<typeof SessionUpdateInputSchema>
export type SessionResumeInput = z.infer<typeof SessionResumeInputSchema>
export type TaskItem = z.infer<typeof TaskItemSchema>
export type SessionCreateOutput = z.infer<typeof SessionCreateOutputSchema>
export type SessionUpdateOutput = z.infer<typeof SessionUpdateOutputSchema>
export type SessionResumeOutput = z.infer<typeof SessionResumeOutputSchema>
export type SessionListOutput = z.infer<typeof SessionListOutputSchema>