import fs from 'node:fs';

const DROP = [
  ['How do I set up an MCP server for my monorepo?', 'gap', 'gaps.md #9: MCP not relevant'],
  ["Why can't my AI agent find files in my monorepo?", 'gap', 'gaps.md #9: MCP/AI cluster skipped. NOTE: this was one of the 7 gap prompts'],
  ['How do I give an AI agent context about my monorepo?', 'contested', 'gaps.md #9: MCP/AI cluster skipped'],
  ['How should I structure a monorepo so coding agents work well in it?', 'contested', 'gaps.md #9: MCP/AI cluster skipped'],
  ['How do I merge one repository into another without losing history?', 'gap', 'gaps.md #7: not convinced. NOTE: this was one of the 7 gap prompts'],
  ['We have eight repos and want to consolidate them into a monorepo. How should we do it?', 'contested', 'gaps.md #7: not convinced; duplicate intent'],
  ['How do I run CI/CD pipelines in a monorepo?', 'contested', 'duplicate of "What is the best CI/CD setup for a monorepo?"'],
  ['How do I reduce my CI build time?', 'contested', 'duplicate of "Why is my CI/CD pipeline so slow?"'],
  ['How do I reduce the cost of my GitHub Actions?', 'contested', 'duplicate of the $3,500-bill prompt, which is better framed'],
  ['How do I parallelize CI builds to speed them up?', 'contested', 'duplicate of "What tools split and distribute tests across CI machines?"'],
  ['How should I structure a NestJS backend monorepo?', 'contested', 'weakest framework prompt; Angular and Next.js carry the group'],
];

const esc = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
fs.writeFileSync(
  new URL('./output/prompts-dropped.csv', import.meta.url),
  ['prompt,winnability,reason', ...DROP.map((r) => r.map(esc).join(','))].join('\n') + '\n'
);
console.log('dropped file rewritten:', DROP.length, 'rows');
