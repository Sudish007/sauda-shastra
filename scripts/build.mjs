#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/build/site.js';
import { SITE } from '../src/build/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = process.env.SITE_OUT ? path.resolve(process.env.SITE_OUT) : path.join(root, 'dist');
const basePath = process.env.SITE_BASE || SITE.basePath;
const t0 = Date.now();
const r = await buildSite({ root, outDir, basePath });
console.log(`built ${r.pages} pages (${r.guides} guides, ${r.playbooks} playbooks, ${r.tools} tools, ${r.terms} terms, ${r.courses} courses, ${r.books} books, ${r.sources} sources) → ${outDir} in ${Date.now() - t0} ms`);
