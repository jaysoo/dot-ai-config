// Build keywords-filtered.csv - 100 curated, NEW (untracked) keywords.
// Jack's brief: focus memory + handoff; drop cost entirely; drop governance unless it maps to a
// real Polygraph feature; keep "multi agent"; cut generic head terms and the claude.md-file long
// tail down to a couple; "memory md" and "handoff md" must be in.
// Metrics come from output/keywords.csv or from the 2026-08-07 Ahrefs pulls below. Never invented.
import fs from 'fs';
import path from 'path';
const DIR = path.dirname(new URL(import.meta.url).pathname);

function pc(t){const rows=[];let f=[],c='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];
 if(q){if(ch==='"'){if(t[i+1]==='"'){c+='"';i++;}else q=false;}else c+=ch;}
 else if(ch==='"')q=true;else if(ch===','){f.push(c);c='';}
 else if(ch==='\n'){f.push(c);rows.push(f);f=[];c='';}else if(ch!=='\r')c+=ch;}
 if(c||f.length){f.push(c);rows.push(f);}return rows.filter(r=>r.length>1);}
const esc=v=>{const s=v==null?'':String(v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};

// --- corpus lookup ---
const r=pc(fs.readFileSync(path.join(DIR,'output/keywords.csv'),'utf8'));
const h=r[0].map(x=>x.trim());
const corpus=new Map();
for(const x of r.slice(1)){const o={};h.forEach((k,i)=>o[k]=(x[i]||'').trim());
  const k=o.keyword.toLowerCase().trim(); if(!corpus.has(k))corpus.set(k,o);}

// --- fresh 2026-08-07 pulls (handoff + memory.md clusters were absent from the corpus) ---
// vol, global, kd. kd null => Ahrefs returned no difficulty.
const FRESH={
 'memory.md':[40,200,null],'memory md':[20,90,null],'claude memory.md':[150,600,null],
 'claude code memory.md':[80,300,null],'memory.md claude':[40,150,null],
 'openclaw memory.md':[100,350,null],'openclaw memory.md best practices':[30,50,null],
 'claude memory skill':[70,300,null],'claude code memory skill':[20,100,null],
 'openclaw memory skill':[30,90,null],'memory skill claude':[10,40,null],
 'agent memory skill':[10,40,null],'claude memory file':[30,90,null],
 'claude.md vs memory.md':[20,50,null],'what is memory.md':[10,30,null],
 'codex memory.md':[10,20,null],
 'handoff skill':[200,700,null],'claude handoff':[90,200,null],'claude handoff skill':[90,200,null],
 'handoff skill claude':[70,350,null],'claude code handoff':[60,100,null],
 'matt pocock handoff skill':[40,40,null],'claude handoff prompt':[20,30,null],
 'claude code handoff skill':[20,60,null],'claude code handoff between machines':[20,20,null],
 'handoff md':[10,30,null],'handoff.md':[10,30,null],'agent handoff':[40,150,null],
 'ai agent handoff':[20,30,null],'session handoff':[0,10,null],
 'claude code session handoff':[0,10,null],'context handoff':[0,10,null],
 'warp agent handoff':[20,20,null],'openai agent handoff':[10,10,null],
 // verified 2026-08-07 after the first build flagged them as absent from the corpus
 'claude code vs codex':[3300,13000,13],'agents.md vs claude.md':[250,700,null],
 'claude.md vs agents.md':[250,700,null],'multi agent':[350,3100,38],
 'ai agent policy management':[300,350,null],'agent observability platform':[200,300,null],
 'claude code parallel agents':[150,300,null],'agent reliability':[70,80,null],
 'claude code evals':[40,100,null],'claude code session viewer':[10,20,null],
 'claude code where are sessions stored':[10,10,null],
 'best ai code agent for multi-repo microservices':[10,10,null],
 'context portability':[0,0,null],
};
const FRESH_SRC='ahrefs:keywords-explorer-overview+matching-terms+search-suggestions (2026-08-07)';

// --- the curated 100: [keyword, category, cluster, why] ---
const PICKS=[
// ===== MEMORY: the memory.md / memory-skill cluster (Jack: "memory md definitely should track")
['claude memory.md','memory','memory-file','Biggest clean memory-file term. Exactly the artifact Polygraph distills into.'],
['openclaw memory.md','memory','memory-file','openclaw is a harness we were not tracking; its memory file already out-searches ours.'],
['claude code memory.md','memory','memory-file','Tool-anchored form of the core artifact.'],
['claude memory skill','memory','memory-file','Community is shipping memory as a *skill*. Live vocabulary.'],
['memory.md','memory','memory-file','Head term for the file convention.'],
['memory.md claude','memory','memory-file','Word-order variant, separate SERP.'],
['memory md','memory','memory-file','Explicitly requested. Unpunctuated form people actually type.'],
['claude.md vs memory.md','memory','memory-file','Comparison intent: which file holds what. Direct product wedge.'],
['claude code memory skill','memory','memory-file','Tool-anchored skill form.'],
['claude memory file','memory','memory-file','Generic-file phrasing of the same intent.'],
['openclaw memory skill','memory','memory-file','Cross-harness proof the skill pattern is spreading.'],
['what is memory.md','memory','memory-file','Definitional. Cheap to own while the convention is forming.'],
['codex memory.md','memory','memory-file','Cross-harness variant; supports the swappable-harness claim.'],
// ===== MEMORY: compaction / context loss (dark cluster #1, loudest pain in the corpus)
['context compaction','memory','compaction','Head term of the loudest pain found. 100 vol but near-zero competition.'],
['claude code context compaction','memory','compaction','Tool-anchored form.'],
['claude context compaction','memory','compaction','Variant.'],
['what is context compaction','memory','compaction','Definitional; term is spreading faster than its definition.'],
['claude code automatic context compaction','memory','compaction','Zero volume, precise intent. Cheap option.'],
['claude code /compact command context compaction','memory','compaction','The literal command people run before they lose work.'],
['codex context compaction','memory','compaction','Cross-harness.'],
['llm context compaction','memory','compaction','Harness-agnostic.'],
['claude code context window','memory','compaction','KD 6. The symptom people search before they know the word compaction.'],
['claude code context window size','memory','compaction','Same intent, sizing phrasing.'],
// ===== MEMORY: persistence + the couple of claude.md terms Jack allowed
['claude code memory','memory','persistence','KD 9 with 3,900 global. Best memory target in the set. mem0 ranks #11 - contested.'],
['claude mem','memory','persistence','2,700 / KD 18. Tool-name intent.'],
['claude-mem','memory','persistence','Hyphenated variant, separate SERP.'],
['claude memory','memory','persistence','2,200 / KD 34. Category head, tool-anchored.'],
['claude.md best practices','memory','rules-file','One of the two claude.md slots Jack allowed. Best-practice intent converts.'],
['claude code rules','memory','rules-file','KD 8. Second allowed slot; rules-drift is dark cluster #4.'],
['cursor rules','memory','rules-file','2,700 / KD 6. Cheapest real volume anywhere in the corpus.'],
['claude rules','memory','rules-file','900 / KD 4.'],
// ===== HANDOFF (dark cluster #2 - "purest dark demand"; Jack: "handoff md definitely should track")
['handoff skill','sharing','handoff','200 / 700 global. Cleanest head term in our sense of handoff.'],
['claude handoff skill','sharing','handoff','The community named this pattern. We should own the page.'],
['handoff skill claude','sharing','handoff','350 global on the reversed form - separate SERP.'],
['claude handoff','sharing','handoff','Head tool-anchored form.'],
['claude code handoff','sharing','handoff','CPC $9.00 - the highest commercial signal on any handoff term.'],
['handoff md','sharing','handoff','Explicitly requested. Unpunctuated file convention.'],
['handoff.md','sharing','handoff','Punctuated form; the file people hand-roll.'],
['claude code handoff skill','sharing','handoff','Most precise tool+pattern combination.'],
['claude handoff prompt','sharing','handoff','Prompt-shaped; people paste a handoff prompt today.'],
['claude code handoff between machines','sharing','handoff','Cross-machine resume. Exact Polygraph capability.'],
['matt pocock handoff skill','sharing','handoff','Influencer-driven demand; proves the pattern is spreading.'],
['session handoff','sharing','handoff','0/10 - pure dark demand. Cheap to hold the term.'],
['claude code session handoff','sharing','handoff','Zero volume, perfect intent.'],
['context handoff','sharing','handoff','The other name for the same primitive.'],
['agent handoff','sharing','handoff','Harness-agnostic. NOTE: mixed intent, see disambiguation in notes.'],
['ai agent handoff','sharing','handoff','Same caveat as above; track to watch intent shift.'],
['warp agent handoff','sharing','handoff','Another harness shipping it - competitive watch.'],
['openai agent handoff','sharing','handoff','Codex/Agents-SDK sense.'],
// ===== SHARING: session share / export / resume
['claude code resume session','sharing','session','200. Largest session-lifecycle term.'],
['how to resume claude code session','sharing','session','Question form.'],
['claude code share session','sharing','session','Core sharing intent.'],
['share claude code session','sharing','session','Word-order variant; Brand Radar shows 300-vol prompt behind it.'],
['claude code export conversation','sharing','session','Export precedes sharing in the funnel.'],
['claude code export session','sharing','session','Variant.'],
['claude code session viewer','sharing','session','sessionviewer.cc already competes here.'],
['claude code where are sessions stored','sharing','session','"Where are my sessions" - the query that precedes sharing intent.'],
// ===== ORCHESTRATION / MULTI-AGENT (Jack: "multi agent is good")
['claude agent teams','orchestration','multi-agent','2,700 / KD 9. Best orchestration ratio found.'],
['claude code agent teams','orchestration','multi-agent','2,100 / KD 7. Tool-anchored, very low difficulty.'],
['claude code subagents','orchestration','multi-agent','1,800 / 5,900 global. Head term of the category.'],
['claude subagents','orchestration','multi-agent','1,700 / KD 0.'],
['subagent','orchestration','multi-agent','1,300 / KD 17. Singular form, distinct SERP.'],
['agent teams','orchestration','multi-agent','300 / KD 18. Harness-agnostic.'],
['agent teams claude','orchestration','multi-agent','450. Reversed form.'],
['claude code subagent','orchestration','multi-agent','Singular tool-anchored.'],
['multi agent','orchestration','multi-agent','350 / KD 38. Requested head term.'],
['multi-agent','orchestration','multi-agent','3,500 / KD 34. Hyphenated form carries most volume.'],
['multi-agent orchestration','orchestration','multi-agent','350 / KD 12. Hyphenated variant - the unhyphenated form is already tracked.'],
['claude code worktrees','orchestration','worktree','600. Worktrees are how people fake parallel agents today.'],
['claude code worktree','orchestration','worktree','450 / KD 17. Singular.'],
['git worktree claude code','orchestration','worktree','300. DIY signal - already hit the conflict pain.'],
['cursor background agents','orchestration','background','450. Competitor capability watch.'],
['background agents','orchestration','background','150 / KD 26. Category term.'],
['claude code parallel agents','orchestration','multi-agent','Direct statement of the parallel-work capability.'],
// ===== PORTABILITY / CROSS-HARNESS (dark cluster #5)
['agents.md','portability','agent-file','900 / 4,100 global. The cross-harness standard.'],
['codex agents.md','portability','agent-file','Cross-harness form.'],
['codex cli agents.md','portability','agent-file','CLI-specific.'],
['agents.md vs claude.md','portability','agent-file','The canonical portability question. Autocomplete-confirmed.'],
['claude.md vs agents.md','portability','agent-file','Reversed form, separate SERP.'],
['opencode vs claude code','portability','cross-tool','1,900 / KD 9. Harness-swap comparison.'],
['claude code vs codex','portability','cross-tool','Direct swap intent between the two harnesses we support.'],
['codex vs cursor','portability','cross-tool','800 / KD 3.'],
['context portability','portability','cross-tool','The organic name for the category, per HN.'],
// ===== CROSS-REPO (thin by design - see gaps.md section 5)
['claude code multi repo','crossrepo','multi-repo','Tool-anchored form of the stated #1 problem.'],
['cursor multi repo','crossrepo','multi-repo','Competitor-anchored form.'],
['multi repo claude code','crossrepo','multi-repo','Reversed; zero volume, precise intent.'],
['claude code monorepo','crossrepo','multi-repo','Monorepo is the parent topic that multi-repo lacks.'],
['best ai code agent for multi-repo microservices','crossrepo','multi-repo','Long-tail buyer intent.'],
// ===== OBSERVABILITY (session visibility only - usage/token terms dropped with cost)
['claude code logs','observability','session-visibility','Has volume with a LITERALLY EMPTY SERP. Zero indexed competition.'],
['agent observability','observability','session-visibility','500 / KD 23. Category term.'],
['ai agent observability','observability','session-visibility','400 / KD 14.'],
['agent observability platform','observability','session-visibility','Commercial intent.'],
// ===== LANDSCAPE (harness engineering - the term winning organically, and NOT yet tracked)
['harness engineering','landscape','harness-eng','The term the market converged on. OpenAI + Fowler own it today.'],
['what is harness engineering','landscape','harness-eng','1,000 / KD 47. Definitional slot.'],
['what is agent harness','landscape','harness-eng','700 / KD 11. Cheapest entry to the category conversation.'],
// ===== GOVERNANCE (kept only where it maps to a shipped Polygraph feature)
['ai agent policy management','governance','policy','Maps to allow_agent / deny_agent and org policy enforcement.'],
['claude code permissions','governance','policy','500. The per-repo config that Polygraph centralises.'],
['ai agent governance','governance','policy','400 / KD 12. Enterprise buyer term.'],
// ===== EVALUATION (feedback loops / verification is a stated capability)
['agent reliability','evaluation','verification','Maps to the feedback-loop and verification capability.'],
['claude code evals','evaluation','verification','Tool-anchored; users hand-build failure inventories today.'],
];

// --- 48 already-tracked, excluded so this file is purely additive ---
const TRACKED=new Set(['agent context across repositories','agent harness','agent harness comparison','agent harness vs meta harness','ai agent harness','ai agent memory across sessions','ai agent orchestration layer','ai agent policy enforcement','ai agent session memory','ai coding agent harness','best ai agent harness','claude code harness','codex harness','coding agent harness','cross repo ai agents','cross repository agent coordination','databricks omnigent','end to end optimization of model harnesses','harness for ai coding agents','meta agent harness','meta harness','meta harness ai','meta harness arxiv','meta harness definition','meta harness explained','meta harness meaning','meta harness optimization','meta harness paper','meta harness stanford','meta harness tools','meta harness vs agent orchestration','meta harness vs harness','meta harness vs multi agent orchestration','meta harnesses','meta-harness','metaharness','metaharness github','metaharness tools','model harness optimization','multi agent orchestration','multi repo ai agent','polygraph ai agents','polygraph cross repo','polygraph nx','superagentic metaharness','trypolygraph','what is a meta harness','what is a metaharness']);

const HDR=['category','cluster','keyword','volume','global_volume','difficulty','tier','source','why_track'];
const out=[]; const seen=new Set(); const warn=[];
for(const [kw,cat,cluster,why] of PICKS){
  const k=kw.toLowerCase().trim();
  if(TRACKED.has(k)){warn.push('ALREADY TRACKED, dropped: '+kw);continue;}
  if(seen.has(k)){warn.push('dupe, dropped: '+kw);continue;}
  seen.add(k);
  let vol='no_data',gvol='no_data',kd='no_data',tier='no-signal',src='';
  if(FRESH[k]){const[v,g,d]=FRESH[k];vol=String(v);gvol=String(g);kd=d==null?'no_data':String(d);
    tier=v>0?'measured':'dark-demand';src=FRESH_SRC;}
  else if(corpus.has(k)){const c=corpus.get(k);vol=c.volume||'no_data';gvol=c.global_volume||'no_data';
    kd=c.difficulty||'no_data';tier=c.tier||'no-signal';src=c.source||'';}
  else {warn.push('NO DATA IN EITHER SOURCE (kept, marked no_data): '+kw);src='curated:orchestrator';tier='no-signal';}
  out.push({category:cat,cluster,keyword:kw,volume:vol,global_volume:gvol,difficulty:kd,tier,source:src,why_track:why});
}
fs.writeFileSync(path.join(DIR,'output/keywords-filtered.csv'),
  HDR.join(',')+'\n'+out.map(o=>HDR.map(x=>esc(o[x])).join(',')).join('\n')+'\n');

console.log('keywords-filtered.csv rows:',out.length);
const by=f=>out.reduce((m,o)=>(m[f(o)]=(m[f(o)]||0)+1,m),{});
console.log('by category:',by(o=>o.category));
console.log('by cluster:',by(o=>o.cluster));
console.log('by tier:',by(o=>o.tier));
const n=v=>{const z=parseInt(String(v).replace(/[^0-9]/g,''),10);return isNaN(z)?0:z;};
console.log('rows with real volume:',out.filter(o=>n(o.volume)>0).length,
            '| sum US volume:',out.reduce((s,o)=>s+n(o.volume),0));
if(warn.length){console.log('\nWARNINGS:');warn.forEach(w=>console.log('  '+w));}
