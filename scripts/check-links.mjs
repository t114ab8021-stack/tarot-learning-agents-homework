import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const files=['assignment.html','project-rules.html',...(await readdir(resolve(root,'lessons'))).filter(f=>f.endsWith('.html')).map(f=>'lessons/'+f)];
let links=0;
for(const file of files){
 const html=await readFile(resolve(root,file),'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+': one h1');
 assert.match(html,/<html lang="zh-Hant">/);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1];if(url.startsWith('https:')||url.startsWith('#'))continue;
  assert.ok(!url.startsWith('/'),'Relative paths required: '+url);
  const target=resolve(dirname(resolve(root,file)),url.split('#')[0]);
  assert.ok(!relative(root,target).startsWith('..'));await access(target);links++;
 }
}
console.log(`PASS: ${files.length} HTML pages, ${links} existing relative links/assets, zh-Hant and one h1.`);
