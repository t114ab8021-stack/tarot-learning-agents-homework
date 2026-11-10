import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const context={window:{}};vm.createContext(context);
vm.runInContext(await readFile(new URL('dist/data.js',root),'utf8'),context);
const cards=context.window.TAROT.CARDS;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=value=>typeof value==='string'&&value.trim().length>0;
const files=(await readdir(new URL('content/lessons/',root))).filter(f=>f.endsWith('.json')).sort();
const lessons=[];
for(const file of files){
 const d=JSON.parse(await readFile(new URL('content/lessons/'+file,root),'utf8'));
 assert.match(d.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.equal(file,d.slug+'.json');
 for(const key of ['title','summary'])assert.ok(text(d[key]),file+': '+key);
 assert.ok(['入門','進階'].includes(d.level));assert.ok(Number.isInteger(d.minutes)&&d.minutes>=1&&d.minutes<=60);
 assert.ok(Array.isArray(d.cardIds)&&d.cardIds.length>0);assert.equal(new Set(d.cardIds).size,d.cardIds.length);
 for(const id of d.cardIds)assert.ok(cards.some(c=>c.id===id),'Unknown card: '+id);
 assert.ok(Array.isArray(d.sections)&&d.sections.length>=3);
 for(const section of d.sections){assert.ok(text(section.heading));assert.ok(Array.isArray(section.paragraphs)&&section.paragraphs.length&&section.paragraphs.every(text));}
 assert.ok(text(d.exercise.question));assert.ok(Array.isArray(d.exercise.steps)&&d.exercise.steps.length>=2&&d.exercise.steps.every(text));
 assert.ok(Array.isArray(d.sources));for(const source of d.sources){assert.ok(text(source.title));assert.equal(new URL(source.url).protocol,'https:');}
 lessons.push(d);
}
assert.ok(lessons.length>=1);assert.equal(new Set(lessons.map(d=>d.slug)).size,lessons.length);
const page=(title,body,prefix='')=>`<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}｜魔法師的學徒</title><link rel="stylesheet" href="${prefix}course.css"></head>
<body><a class="skip" href="#content">跳到內容</a><header><a class="brand" href="${prefix}assignment.html">✧ 魔法師的學徒</a><nav aria-label="主要導覽"><a href="${prefix}assignment.html">學習單元</a><a href="${prefix}index.html">開啟 App</a></nav></header><main id="content">${body}</main><footer>魔法師的學徒 · 獨立課堂作業<br>觀察圖像，整理自己的理解。</footer></body></html>`;
const outputs=new Map();
for(const d of lessons){
 const related=d.cardIds.map(id=>cards.find(c=>c.id===id));
 const body=`<a class="back" href="../assignment.html">← 所有學習單元</a><div class="article-heading"><span class="eyebrow">${escape(d.level)} · ${d.minutes} 分鐘</span><h1>${escape(d.title)}</h1><p class="lead">${escape(d.summary)}</p></div><div class="article-layout"><article>${d.sections.map(s=>`<section><h2>${escape(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</section>`).join('')}<section class="exercise"><span class="eyebrow">動手練習</span><h2>${escape(d.exercise.question)}</h2><ol>${d.exercise.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><a class="button" href="../index.html#practice">開始抽牌練習</a></section>${d.sources.length?`<section><h2>參考來源</h2><ul>${d.sources.map(s=>`<li><a href="${escape(s.url)}" rel="noreferrer">${escape(s.title)}</a></li>`).join('')}</ul></section>`:''}</article><aside aria-label="相關牌卡">${related.map(c=>`<figure><img src="../${escape(c.image)}" alt="${escape(c.name)}牌面" width="180" height="312"><figcaption>${escape(c.name)}</figcaption></figure>`).join('')}<a href="../index.html#library">前往牌義圖書館</a></aside></div>`;
 outputs.set('dist/lessons/'+d.slug+'.html',page(d.title,body,'../'));
}
outputs.set('dist/assignment.html',page('學習單元',`<section class="hero"><span class="eyebrow">TAROT LEARNING JOURNAL</span><h1>從看見一張牌，<br>開始理解自己。</h1><p class="lead">用觀察、聯想與記錄，建立自己的塔羅學習方法。</p><a class="button" href="index.html#practice">進入抽牌練習</a><a class="text-link" href="index.html#library">瀏覽 78 張牌 →</a></section><section><div class="section-heading"><h2>慢慢學，一次一個單元</h2><span>${lessons.length} 個單元</span></div><div class="lesson-grid">${lessons.map((d,i)=>`<a class="lesson" href="lessons/${d.slug}.html"><span class="eyebrow">${String(i+1).padStart(2,'0')} / ${escape(d.level)} · ${d.minutes} 分鐘</span><h3>${escape(d.title)}</h3><p>${escape(d.summary)}</p><span class="read">開始閱讀 ↗</span></a>`).join('')}</div></section><section class="about"><h2>同一套規則，繼續長出新的內容</h2><p>這是「建立自己的 AGENTS.md」課堂作業。每篇單元使用相同的內容格式與版型；新增一份內容資料，就能產生新的文章與入口卡片。</p><a href="project-rules.html">閱讀專案規則 →</a></section>`));
const rules=await readFile(new URL('AGENTS.md',root),'utf8');
outputs.set('dist/project-rules.html',page('專案規則',`<a class="back" href="assignment.html">← 返回學習單元</a><h1>AGENTS.md</h1><p class="lead">AI 延續這個專案時共同遵守的規則。</p><pre class="rules">${escape(rules)}</pre>`));
const checking=process.argv.includes('--check');
if(!checking)await mkdir(new URL('dist/lessons/',root),{recursive:true});
for(const [file,html] of outputs){if(checking)assert.equal(await readFile(new URL(file,root),'utf8'),html,'請先 npm run build：'+file);else await writeFile(new URL(file,root),html);}
console.log(`PASS: ${lessons.length} validated lessons; ${outputs.size} ${checking?'verified':'generated'} pages; escaped content and valid card IDs.`);
