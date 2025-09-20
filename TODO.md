# Fix Employer Dashboard Task Creation - Worker Assignment Issue

## Problem
The "create new task" functionality in employer role is not working for assigning workers. Tasks are created with empty assignedWorkers array and the task creation form lacks worker selection interface.

## Analysis
- `handleCreateTask` creates tasks with `assignedWorkers: []` (empty array)
- Task creation form only has `workersNeeded` field but no worker selection interface
- Task interface expects `assignedWorkers: string[]` of worker IDs
- Mock tasks show examples like `assignedWorkers: ['1', '2', '3']`

## Implementation Plan

### 1. Add Worker Selection State
- Add `selectedWorkers` state to track selected worker IDs
- Add `availableWorkers` state to filter workers by task type skills

### 2. Create Worker Selection Interface
- Add worker selection section to task creation form
- Use checkboxes for multi-select worker selection
- Filter workers based on task type skills
- Show worker availability status
- Display selected workers count

### 3. Update Task Creation Logic
- Modify `handleCreateTask` to use selected workers instead of empty array
- Add validation to ensure selected workers count matches workers needed
- Add validation to ensure at least one worker is selected

### 4. Add Helper Functions
- Create function to filter workers by task type skills
- Create function to validate worker selection
- Add error handling and user feedback

### 5. Update UI Components
- Add worker selection section to the form
- Add selected workers display
- Add validation error messages
- Update form layout for better UX

## Files to Modify
- `src/pages/EmployerDashboard.tsx` - Main implementation
- `src/data/mockData.ts` - May need helper functions

## Testing Checklist
- [ ] Create task with worker selection
- [ ] Validate worker count matching
- [ ] Test with different task types
- [ ] Test error handling
- [ ] Verify task display shows assigned workers
- [ ] Test form validation
