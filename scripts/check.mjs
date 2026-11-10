import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url);
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(await readFile(new URL('data.js',root),'utf8'),ctx);
vm.runInContext(await readFile(new URL('lore.js',root),'utf8'),ctx);
const cards=ctx.window.TAROT.CARDS;
assert.equal(ctx.window.TAROT.ZODIAC.length,12);assert.equal(ctx.window.TAROT.PLANETS.length,7);
for(const c of cards){assert.equal(c.lore.details.length,2,c.id);assert.ok(c.lore.history);assert.ok(c.astro.name);}
for(const z of ctx.window.TAROT.ZODIAC)assert.equal(cards.filter(c=>c.astro.sign===z.name).length,4,z.name);
assert.equal(cards.length,78);assert.equal(new Set(cards.map(c=>c.id)).size,78);
const counts={};for(const c of cards){counts[c.category]=(counts[c.category]||0)+1;for(const key of ['name','english','symbol','meaning','love','work','study','advice','who','when','where'])assert.ok(c[key]?.trim(),`${c.id}: ${key}`);assert.ok(c.keywords.length>=2);assert.ok(c.reversed.length>=2);const image=await readFile(new URL(c.image,root));assert.equal(image[0],255);assert.equal(image[1],216);assert.ok(image.length>10000);}
assert.deepEqual(counts,{'大阿爾克那':22,'權杖':10,'宮廷牌':16,'聖杯':10,'寶劍':10,'錢幣':10});
for(const f of ['app.js','sw.js'])new vm.Script(await readFile(new URL(f,root),'utf8'),{filename:f});
for(const f of ['index.html','style.css','manifest.webmanifest','icon.svg'])await access(new URL(f,root));
const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',root),'utf8'));assert.equal(manifest.lang,'zh-Hant');
console.log('PASS: 78 unique cards, complete meanings, 78 real JPEG assets, category totals, JavaScript syntax, PWA manifest.');
