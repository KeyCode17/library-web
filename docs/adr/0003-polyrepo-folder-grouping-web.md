# ADR — Polyrepo with folder grouping

| | |
|---|---|
| Status | Accepted |
| Date | 2026-06-14 |
| Owner | _TODO: assign_ |

## Context
Three repos (backend/android/web) under one local parent `library-project/`, with an
orchestrator driving parallel Claude Code workers via tmux.

## Decision
Three independent git repos (folder grouping, not a true monorepo). The contract lives in
the backend (sibling path for web codegen). Orchestrator + cross-repo coordination files are
not a repo.

## Consequences
- Each repo has its own CI/deploy; iOS later pulls bindings from the backend.
- Cross-repo atomic commits are impossible — use a shared task ID / branch name and sequence
  merges (backend → build.sh → android/web).
