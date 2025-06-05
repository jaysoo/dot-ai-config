# Raw Docs System Concept

## Vision

I have this task to create documentation we call "raw docs" - like raw documentation or "raw docs" for short. The whole goal is that developers working on our two main products - our web app called Nx Cloud and also our CLI dev tools called Nx - can populate a bunch of documents, feature documents inside a raw docs repository.

## Core Functionality

The system will be synced up from both the Nx monorepo and also the Nx Cloud monorepo to populate back and forth. Any code changes, any feature changes - we can detect whether there should be certain updates on the raw docs repo.

## AI Integration 

We can also query and use AI to ask if there's any feature changes in the last few weeks from the raw docs folder that can then be synced into documentation in the Nx monorepo. There's a docs folder under there.

## Objectives

I just need some ideas of how this could be done, especially with the help of AI. We need to plan out this task and do a lot of research. We need to help bridge the communication gap.

## Project Context

Based on the Nx repository structure, this system would need to integrate with:
- The main docs folder at `/docs/` which contains extensive documentation including blog posts, tutorials, and API references
- The Nx dev documentation system in `/nx-dev/` which powers the nx.dev website
- Documentation generation scripts in `/scripts/documentation/` 
- The existing package structure under `/packages/` where individual tool documentation resides

## Key Requirements

The raw docs system should:
1. Bridge communication between Nx CLI and Nx Cloud development teams
2. Automatically detect when code changes should trigger documentation updates
3. Enable AI-powered querying of recent feature changes
4. Facilitate bidirectional synchronization between repositories
5. Maintain a centralized source of truth for feature documentation

---

## Notes for Clarification

- Need to determine the exact structure of the Nx Cloud monorepo for proper integration
- Should investigate existing documentation workflows in the current Nx repository
- Consider how this integrates with the existing nx.dev documentation site generation process