
---

## Phase 7: GitHub Repository Setup

We will adopt a **Monorepo** approach where both `frontend` and `backend` reside in a single repository.

### Strategy: Monorepo
- **Simplicity:** Managed under a single set of Git commands.
- **Consistency:** Ensure frontend and backend versions always match in the history.
- **Atomic Commits:** Ship features requiring both API and UI changes in a single commit.

### Deployment Readiness
- Root level `.gitignore` to prevent tracking of environment secrets and build artifacts.
- README at the root documenting how to start both services.
