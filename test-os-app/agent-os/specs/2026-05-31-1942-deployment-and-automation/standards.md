# Standards for Deployment & Automation

No project-specific Agent OS standards were available beyond the empty standards index.

The implementation follows the existing Test OS app conventions:

- React components remain props-based.
- Section state persists in browser `localStorage` until the future workspace API exists.
- Dark zinc-first UI with cyan progress states, emerald live runner states, amber warnings, and red errors.
- Command documentation uses `/test-os:name-of-command`.
