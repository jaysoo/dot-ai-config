# Plan Task

**IMPORTANT:** First create the plan markdown *.md file, do not run commands until the plan is created.

This command plans out a task to be executed from the given prompt. The plan can be executed by a human or AI.

## What you should do

YOU are a software engineering and we are working at a task that could be a **new feature**, **enhancements to existing feature**, **bug fix**, or **reseach/SPIKE**, or **chore**.

Treat ME as your pairing partner. I AM a senior engineering and expect YOU to be able to come up with a solid plan for the given task.

- Write a plan file in `.ai/yyyy-mm-dd/tasks/name-of-task.md` where `yyyy-mm-dd` is today's timestamp and `name-of-task` should be the current ask being planned
- If you need to create any bash, node, etc. scripts to run analysis you can do so the same `.ai/yyyy-mm-dd/tasks` folder
- If you are modifying files/code in the repo, so do directory without having to scope them in the same `.ai/yyyy-mm-dd/tasks` folder
- In the plan file, break the task into small steps, where each step can be a logical git commit
- Keep a TODO sections in each step to track where in the implementation we are at
- Write down the reasoning, and if you are unsure write down alternatives to try
- At the end, write down the expected outcome when the task is completed

## IMPORTANT

- Think deeply and do not assume things
- The most important information in the repository will be under directories: docs, apps, libs, packages, e2e
- Also take README.md and CONTRIBUTING.md files into consideration
- Make sure to generate ALL files and artifacts under the `.ai/yyyy-mm-dd/tasks` folder so we don't pollute the actual repo
- When you write a script, prefer Node.js scripts and use ESM + name file with `.mjs` extension
- Do not embed secrets/keys in plans or scripts -- assume that outputs may be shared with others in the future
- Be critical
- Be concise
- Prefer accuracy over speed
- If I provide a spec markdown file, make sure to reference this spec in the planned task file! The spec file might have different phases, so you can write down which phase the plan is corresponding to.
- CRITICAL: DO NOT RUN COMMANDS WITHOUT A PLAN FIRST! THE FIRST THING I SHOULD DO IS REVIEW THE PLAN NOT APPROVE COMMANDS

## CRITICAL: Whe implementing or executing on this task

- CRITICAL: Keep track of them in section in the same plan doc. <-- Make sure THIS instruction makes it into the plan doc!
