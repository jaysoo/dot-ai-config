#!/usr/bin/env node
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
try{const config=JSON.parse(readFileSync(new URL('../../.rawdocs.local.json',import.meta.url)));spawn('node',[config.rawDocsPath+'/scripts/analyze-changes.mjs',...process.argv.slice(2)],{stdio:'inherit'}).on('error',()=>console.log('Error: Run installation with:\ngh api repos/nrwl/raw-docs/contents/install.sh --jq \'.content\' | base64 -d | bash'))}catch{console.log('Error: Run installation with:\ngh api repos/nrwl/raw-docs/contents/install.sh --jq \'.content\' | base64 -d | bash')}