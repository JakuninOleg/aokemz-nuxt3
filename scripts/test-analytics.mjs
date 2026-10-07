import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const pluginSource = fs.readFileSync(new URL('../plugins/metrika.client.ts', import.meta.url), 'utf8')
function setup(host, stored = null) {
  const calls = [], scripts = [], hooks = {}, listeners = {}
  const window = {
    location: { hostname: host, origin: `https://${host}`, pathname: '/' },
    ym: (...args) => calls.push(args),
    addEventListener: (name, cb) => { listeners[name] = cb },
  }
  const document = {
    title: 'КЭМЗ', referrer: 'https://example.org/path?email=private#private',
    getElementById: () => scripts[0], createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  }
  const exports = {}
  const context = {
    exports, window, document, URL,
    defineNuxtPlugin: cb => cb({ hook: (name, cb) => { hooks[name] = cb } }),
    useRuntimeConfig: () => ({ public: { metrikaId: '113528354' } }),
    require: () => ({
      ANALYTICS_CONSENT_EVENT: 'consent', ANALYTICS_CONSENT_KEY: 'key',
      LEAD_SENT_EVENT: 'lead', readAnalyticsConsent: () => stored,
    }),
  }
  vm.runInNewContext(ts.transpileModule(pluginSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, context)
  return { calls, scripts, hooks, listeners, window }
}

const denied = setup('aokemz.ru', 'necessary')
denied.hooks['app:mounted']()
denied.hooks['page:finish']()
denied.listeners.lead()
assert.equal(denied.calls.length, 0)
assert.equal(denied.scripts.length, 0)

denied.listeners.consent({ detail: 'all' })
assert.equal(denied.scripts.length, 1)
assert.equal(denied.calls.filter(c => c[1] === 'hit').length, 1)
assert.equal(denied.calls[1][3].referer, 'https://example.org/path')
assert.equal(denied.calls[0][2].webvisor, false)
denied.hooks['page:finish']()
assert.equal(denied.calls.filter(c => c[1] === 'hit').length, 1)
denied.window.location.pathname = '/contacts'
denied.hooks['page:finish']()
assert.equal(denied.calls.filter(c => c[1] === 'hit').length, 2)
denied.listeners.lead()
assert.equal(denied.calls.at(-1)[2], 'lead_sent')
denied.listeners.consent({ detail: 'necessary' })
const before = denied.calls.length
denied.listeners.lead()
denied.hooks['page:finish']()
assert.equal(denied.calls.length, before)

for (const host of ['localhost', 'aokemz-nuxt3.vercel.app', 'aokemz-nuxt3-dev-codex.vercel.app']) {
  const preview = setup(host, 'all')
  assert.equal(preview.calls.length, 0)
  assert.equal(preview.scripts.length, 0)
  assert.equal(Object.keys(preview.hooks).length, 0)
}
for (const path of ['components/Form.vue', 'components/contacts/ContactsSalesForm.vue']) {
  const source = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  const honeypot = source.slice(source.indexOf('if (website.value.trim())'), source.indexOf('if (website.value.trim())') + 140)
  assert.ok(!honeypot.includes('trackLeadSent'))
  assert.ok(source.indexOf('trackLeadSent();') > source.indexOf('const response = await $fetch'))
}
console.log('PASS: consent, SPA deduplication, referrer sanitization, goals, withdrawal, preview isolation, honeypots')
