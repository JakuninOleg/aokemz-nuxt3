// Diagnostic runner only: install official lighthouse separately, never ship it in the app.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const origin = new URL(process.env.AUDIT_ORIGIN || 'http://127.0.0.1:3100').origin;
const output = path.resolve(process.env.AUDIT_OUTPUT || '../../.migration-private/performance');
const packageDirectory = process.env.LIGHTHOUSE_PACKAGE;
if (!packageDirectory) throw new Error('Set LIGHTHOUSE_PACKAGE to the installed official lighthouse package directory.');
const requireLighthouse = createRequire(path.join(packageDirectory, 'package.json'));
const { default: lighthouse } = await import(pathToFileURL(path.join(packageDirectory, 'core/index.js')).href);
const { launch } = await import(pathToFileURL(requireLighthouse.resolve('chrome-launcher')).href);
const routes = JSON.parse(await readFile(process.env.AUDIT_MANIFEST || '../../.migration-private/public-routes.json', 'utf8'));
if (!Array.isArray(routes) || routes.some(route => typeof route !== 'string' || !route.startsWith('/') || route.startsWith('//'))) throw new Error('Invalid public URL manifest.');
const filter = process.env.AUDIT_FILTER ? new RegExp(process.env.AUDIT_FILTER) : null;
const selected = routes.filter(route => !filter || filter.test(route));
await mkdir(output, { recursive: true });
await mkdir(path.join(output, 'browser-profile'), { recursive: true });
const browser = await launch({ chromeFlags: ['--headless'], userDataDir: path.join(output, 'browser-profile'), logLevel: 'silent' });
const results = [];
try {
  for (const route of selected) for (const device of ['mobile', 'desktop']) {
    const url = new URL(route, origin).href;
    const options = { port: browser.port, onlyCategories: ['performance'], logLevel: 'silent', output: 'json' };
    const config = device === 'desktop' ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } } } : undefined;
    const filename = `${results.length.toString().padStart(3, '0')}-${device}.json`;
    const run = await lighthouse(url, options, config);
    if (!run?.lhr || run.lhr.runtimeError) throw new Error(`${device} ${route}: ${run?.lhr?.runtimeError?.message || 'Missing result'}`);
    await writeFile(path.join(output, filename), JSON.stringify(run.lhr));
    if (process.env.AUDIT_TRACE === '1') await writeFile(path.join(output, filename.replace('.json', '-trace.json')), JSON.stringify(run.artifacts.Trace));
    const metrics = Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map(key => [key, run.lhr.audits[key].numericValue]));
    const entry = { route, device, score: Math.round(run.lhr.categories.performance.score * 100), metrics, report: filename, lighthouseVersion: run.lhr.lighthouseVersion, fetchTime: run.lhr.fetchTime, warnings: run.lhr.runWarnings };
    results.push(entry);
    await writeFile(path.join(output, 'summary.json'), JSON.stringify({ origin, expectedRuns: selected.length * 2, complete: results.length === selected.length * 2, results }, null, 2));
    console.log(`${results.length}/${selected.length * 2} ${device} ${route}: ${entry.score} LCP ${(metrics['largest-contentful-paint'] / 1000).toFixed(2)}s`);
  }
} finally {
  await browser.kill();
}
if (results.some(result => result.score < 90)) process.exitCode = 1;
