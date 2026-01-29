# Docs Information Architecture

Here is the summary of the strategic framework for the Information Architecture of the Nx documentation.

### Part 1: The 5 Principles of Nx IA

*Use these rules to settle debates on where a new page belongs.*

**1. Progressive Disclosure (The "Journey" Rule)**

* **Concept:** Don't overwhelm the user. Reveal complexity only as they advance in their journey.
* **The Test:** *Is this for the First 30 Minutes (Getting Started), the First 30 Days (Capabilities), or Forever (Reference)?*

**2. Category Homogeneity (The "Scan" Rule)**

* **Concept:** Items in a list must be of the same "type" (noun, verb, or concept) to reduce cognitive load.
* **The Test:** *Does this list mix Concepts (Mental Model), Tasks (Update Nx), and Products (React)? If yes, split it.*

**3. Type-Based Navigation (The "Intent" Rule)**

* **Concept:** Separate **Learning** (Narrative/Guides) from **Looking Up** (Reference/API).
* **The Test:** *Is the user here to learn a workflow (Guide) or look up a flag syntax (Reference)?*

**4. The Pen & Paper Test (The "Theory" Rule)**

* **Concept:** Distinguish Architecture from Features to keep "Core Concepts" pure.
* **The Test:** *Can I explain this using only a pen and paper?*
* **Yes:** It goes in **How Nx Works** (Architecture).
* **No (I need a terminal):** It goes in **Platform Capabilities** (Feature).



**5. Universal vs. Specific (The "Placement" Rule)**

* **Concept:** Distinguish Platform features from Ecosystem tools to prevent "Features" from becoming a junk drawer.
* **The Test:** *Does this feature apply to EVERY user (e.g., Caching, Agents)?*
* **Yes:** **Platform Capabilities**.
* **No (Only React users):** **Technologies**.

### Part 2: The Recommended Sidebar Structure

**1. Getting Started** (Time: 0-30m)

* *Focus: High-conversion, immediate value, essential setup.*
* **Intro to Nx**
* **Installation**
* **Editor Setup (Nx Console)** *(Moved here to drive adoption as a prerequisite)*
* **Quickstart** *(The "Hello World")*

**2. How Nx Works** (Theory / Pen & Paper)

* *Focus: Deep understanding, mental models, no code/config.*
* **Mental Model**
* **The Project Graph** *(Theory)*
* **How Caching Works** *(Theory)*

**3. Platform Capabilities** (Universal Features)

* *Focus: The "Power" features that apply to everyone.*
* **CI & Orchestration** *(Remote Caching, Agents, VCS)*
* **Code Organization** *(Module Boundaries, Dependency Viz)*
* **Maintenance** *(Automated Updates, Migrations)*
* **Release & Publishing** *(Nx Release)*

**4. Technologies** (Specific Hubs)

* *Focus: Context-specific guides. Clicking one opens a Hub Page.*
* **React / Angular / Vue** *(Hub Pages)*
* **Node / TypeScript**
* **Community Plugins**

**5. Knowledge Base** (The "Low Friction" Zone)

* *Focus: Specific solutions to specific problems (The allowed "Dumping Ground").*
* **Troubleshooting** *(Categorized by Symptom: CLI, Cache, CI)*
* **Recipes** *(Specific "How-to" guides, e.g., "Migration Manuals")*

**6. Reference** (The Dictionary)

* *Focus: Exhaustive facts. No narrative.*
* **Configuration** *(`nx.json`, env vars)*
* **Commands** *(CLI definitions)*
* **Package Managers**

### Part 3: The Knowledge Base Strategy

**Day 1 (Immediate):**

* Create the `Knowledge Base` folder in the sidebar.
* Use it to house "Recipes" and "Specific Troubleshooting" (CLI errors, Edge cases).
* **Requirement:** Enforce strict frontmatter tagging (e.g., `tags: ['react', 'error', 'ci']`) on all KB files now.

**Day 2 (Future):**

* Once volume increases, build a dedicated landing page (like Vercel) that uses those tags to create a searchable, filterable support center, moving it out of the linear sidebar flow if needed.
