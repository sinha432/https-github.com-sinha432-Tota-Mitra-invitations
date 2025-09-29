# Voice Assistant Improvements

## Overview
This TODO tracks the implementation of voice assistant enhancements based on the approved plan. The goal is to improve recognition accuracy, add language support (English/Kannada), enhance command processing for workers, and better UX/error handling.

## Steps

- [x] **Step 1: Update useVoiceCommands hook**
  - Add language prop ('en-US' | 'kn-IN') and set recognition.lang dynamically.
  - Implement fuzzy matching for commands (add more regex patterns or simple similarity check).
  - Add worker-specific commands: e.g., "request new task [type]", "mark attendance present/absent".
  - Enhance error handling: Mic permission check, retry on end, support interim results.
  - Return action callbacks for parent handling (e.g., open modals).

- [x] **Step 2: Update EnhancedAIAssistant component**
  - Pass language from props/context to the hook.
  - Add visual feedback for permission denied, improve timeout UI.
  - For worker role, prioritize task/attendance commands in processing.

- [x] **Step 3: Update WorkerDashboard (if needed)**
  - Integrate voice actions: e.g., on "request task" command, set showRequestTask modal state.
  - Ensure hook receives language from auth context.

- [x] **Step 4: Testing**
  - Launch dev server and use browser_action to test mic toggle, English commands ("show workers"), Kannada if supported ("workers ತೋರಿಸಿ").
  - Verify attendance/task triggers, error cases (no mic, invalid command).
  - Check console for errors, ensure no breaking changes.

- [ ] **Step 5: Finalization**
  - Update existing TODO.md with reference to this file.
  - Commit changes with message: "Improve voice assistant: add language support, fuzzy matching, worker commands".
  - Create PR if all tests pass.

## Dependencies
- No new packages; uses native Web Speech API.
- Relies on mockData for command responses.
- Browser: Chrome/Edge for best support.

## Notes
- Test in supported browsers; fallback to text input if SpeechRecognition unavailable.
- For Kannada, note that Web Speech API support is limited; may need polyfill or external service in future.
