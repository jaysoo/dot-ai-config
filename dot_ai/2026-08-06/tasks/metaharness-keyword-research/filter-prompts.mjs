// Trim prompts.csv (122) -> prompts-filtered.csv (50), same brief as keywords-filtered.csv:
// focus memory + handoff, drop cost entirely, governance only where it maps to a shipped
// Polygraph feature, keep multi-agent, cut generic definitional prompts.
// Also regenerates brand-radar-prompts.txt from the trimmed set so the import list stays
// consistent with the brief (the previous 40 included cost/governance prompts now cut).
import fs from 'fs';
import path from 'path';
const DIR = path.dirname(new URL(import.meta.url).pathname);

function pc(t){const rows=[];let f=[],c='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];
 if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++;}else q=false;}else c+=ch;}
 else if(ch==='"')q=true;else if(ch===','){f.push(c);c='';}
 else if(ch==='\n'){f.push(c);rows.push(f);f=[];c='';}else if(ch!=='\r')c+=ch;}
 if(c||f.length){f.push(c);rows.push(f);}return rows.filter(r=>r.length>1);}
const esc=v=>{const s=v==null?'':String(v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};

const r=pc(fs.readFileSync(path.join(DIR,'output/prompts.csv'),'utf8'));
const h=r[0].map(x=>x.trim());
const src=new Map();
for(const x of r.slice(1)){const o={};h.forEach((k,i)=>o[k]=(x[i]||'').trim());src.set(o.prompt.trim(),o);}

// 3 new prompts written for this pass, grounded in the 2026-08-07 keyword pulls.
// measured_volume stays no_data - these have never been measured as prompts.
const NEW={
 'What is MEMORY.md and how is it different from CLAUDE.md?':
   {category:'memory',funnel_stage:'solution-aware',source:'synthetic:grounded in `claude.md vs memory.md` 20/50 (ahrefs 2026-08-07)',
    likely_incumbents:'Anthropic docs; openclaw docs',winnability:'high',
    rationale:'New memory.md cluster; convention still forming'},
 'What is a handoff skill in Claude Code?':
   {category:'sharing',funnel_stage:'solution-aware',source:'synthetic:grounded in `handoff skill` 200/700 (ahrefs 2026-08-07)',
    likely_incumbents:'Matt Pocock; community skill repos',winnability:'high',
    rationale:'Community named the pattern; no vendor owns the page'},
 'Is there a standard HANDOFF.md format for passing context between agent sessions?':
   {category:'sharing',funnel_stage:'solution-aware',source:'synthetic:grounded in `handoff md`/`handoff.md` 10/30 (ahrefs 2026-08-07)',
    likely_incumbents:'none - everyone hand-rolls it',winnability:'high',
    rationale:'Purest dark demand; zero of 2,279 keyword rows contain handoff'},
};

const KEEP=[
// ---- MEMORY (12) - the focus area
'Why does Claude Code lose my context between sessions?',
'Why does my Claude Code agent forget everything after compaction?',
'Why does Claude Code keep forgetting my project conventions?',
'How are people handling context loss between AI coding sessions?',
'How do I make Claude Code memory persist across sessions?',
'How do I keep the same agent memory across machines?',
"How do I share a memory store across my team's Claude Code sessions?",
'How do I stop agent memory from going stale when the code changes?',
'What are tools that distil memory from past Claude Code sessions?',
'What is MEMORY.md and how is it different from CLAUDE.md?',
'Is mem0 good for Claude Code memory?',
'What are the alternatives to mem0 for coding agent memory?',
// ---- SHARING + HANDOFF (14) - the other focus area
'How do I share my Codex session with Claude Code?',
'How do I share my Claude Code session with Codex?',
'Can I share my Claude Code session with someone else?',
'Can I resume a session I started on one machine on another machine?',
"Why can't my teammate see the Claude Code session I just ran?",
'How do I hand off a Claude Code session to another developer?',
'What is a handoff skill in Claude Code?',
'Is there a standard HANDOFF.md format for passing context between agent sessions?',
'How do you get two Claude Code sessions to talk to each other?',
"Can I resume another person's Codex session?",
'Is there a tool to export and import agent session context between machines?',
"How do I review a teammate's AI-generated PR without seeing the agent session?",
'claudereview vs threadcast for sharing Claude Code sessions',
'What is an alternative to lore.link for sharing Claude Code sessions?',
// ---- ORCHESTRATION / MULTI-AGENT (7) - Jack: "multi agent is good"
'How do I run multiple Claude Code agents in parallel without them conflicting?',
'Why do I have to set up a git worktree for every Claude Code agent?',
'How do I automate git worktree setup for parallel Claude Code agents?',
'How do I manage Claude Code agents running on multiple machines?',
"Why do my parallel agents keep redoing each other's work?",
'Is there a self-hostable tool to launch and monitor Codex and Claude Code agents?',
'What is the best tool to orchestrate Claude Code and Codex agents across repos?',
// ---- PORTABILITY (5)
'Why do I have to rewrite my rules file for every AI coding tool?',
'How do I keep the same context when I switch from Claude Code to Codex?',
'AGENTS.md vs CLAUDE.md - which should I use?',
'How do I save and restore agent state between Claude Code and Codex?',
'unabyss vs Polygraph for sharing context between Codex and Claude Code',
// ---- CROSSREPO (4) - trimmed hardest; evidence is thinner than the positioning (gaps.md s5)
'Why does Claude Code only see one repo when my change spans three?',
'Is there a tool that prepares multi-repository worktrees for a subagent?',
'How do I give Claude Code cross-repo context without moving to a monorepo?',
'How do I coordinate a PR across multiple repositories with Claude Code?',
// ---- OBSERVABILITY (4) - session visibility only; the usage/spend one went with cost
'What did my Claude Code agent actually do last night?',
"How do I see what my team's Claude Code agents are doing?",
'Where are Claude Code logs stored?',
'How do I get a dashboard of every Claude Code session in my organisation?',
// ---- EVALUATION (2) - verification / feedback loops are a stated capability
'How do I build a feedback loop that verifies what Claude Code changed?',
'How do I stop Claude Code from regressing things it already fixed?',
// ---- GOVERNANCE (2) - only the two that map to shipped Polygraph features
'How do I enforce coding standards across every Claude Code session in my company?',
'How do I get an audit log of every AI agent action in my org?',
];

const HDR=['category','funnel_stage','prompt','source','measured_volume','likely_incumbents','winnability','rationale'];
const out=[]; const miss=[];
for(const p of KEEP){
  if(NEW[p]){out.push({prompt:p,measured_volume:'no_data',...NEW[p]});continue;}
  const o=src.get(p);
  if(!o){miss.push(p);continue;}
  out.push(o);
}
fs.writeFileSync(path.join(DIR,'output/prompts-filtered.csv'),
  HDR.join(',')+'\n'+out.map(o=>HDR.map(k=>esc(o[k])).join(',')).join('\n')+'\n');

// brand-radar import list: the trimmed set minus the 5 already configured in the report
const ALREADY=new Set([
 'How do I share my Codex session with Claude Code?',
 'How do I share my Claude Code session with Codex?',
 'Can I share my Claude Code session with someone else?',
 'How do I share sessions between different AI agents?',
 'Can I resume a session I started on one machine on another machine?']);
const imp=out.filter(o=>!ALREADY.has(o.prompt)).map(o=>o.prompt);
fs.writeFileSync(path.join(DIR,'output/brand-radar-prompts.txt'), imp.join('\n')+'\n');

const by=f=>out.reduce((m,o)=>(m[f(o)]=(m[f(o)]||0)+1,m),{});
console.log('prompts-filtered.csv rows:',out.length);
console.log('by category:',by(o=>o.category));
console.log('by funnel_stage:',by(o=>o.funnel_stage));
console.log('by winnability:',by(o=>o.winnability));
console.log('with measured volume:',out.filter(o=>o.measured_volume&&o.measured_volume!=='no_data').length);
console.log('brand-radar-prompts.txt lines:',imp.length);
if(miss.length){console.log('\nNOT FOUND IN prompts.csv (check exact string):');miss.forEach(m=>console.log('  '+m));}
