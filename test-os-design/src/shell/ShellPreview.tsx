import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { ShieldAlert, CheckCircle2, XCircle, Clock, FileCode2, ChevronRight } from 'lucide-react'

const user = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
}

function FoundationContent() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
          Phase 01
        </p>
        <h1
          className="text-2xl font-semibold text-white mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Test Foundation
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Establish the validation charter, coverage map, oracle data, testing standards, and Hermes
          harness config before any test authoring begins.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { step: '/test-charter', label: 'Test Charter', status: 'complete', desc: 'Scope and risk priorities defined' },
          { step: '/test-roadmap', label: 'Coverage Map', status: 'complete', desc: '4 epics → 12 sections mapped' },
          { step: '/oracle-data', label: 'Oracle Data', status: 'active', desc: 'Defining golden values for auth flow' },
          { step: '/test-standards', label: 'Test Standards', status: 'pending', desc: 'Naming, assertion strictness, flake policy' },
          { step: '/test-harness', label: 'Test Harness', status: 'pending', desc: 'Hermes config, base URL, auth fixtures' },
        ].map((item) => (
          <div
            key={item.step}
            className={`flex items-start gap-3 p-3.5 rounded-lg border transition-colors cursor-pointer group ${
              item.status === 'active'
                ? 'bg-cyan-500/5 border-cyan-500/30 hover:bg-cyan-500/10'
                : item.status === 'complete'
                  ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50 opacity-60'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.status === 'complete' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={1.5} />
              ) : item.status === 'active' ? (
                <div className="relative flex h-4 w-4 items-center justify-center">
                  <span className="animate-ping absolute h-3 w-3 rounded-full bg-cyan-400 opacity-40" />
                  <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
                </div>
              ) : (
                <div className="h-4 w-4 rounded-full border border-zinc-700 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-sm font-medium ${
                    item.status === 'active'
                      ? 'text-cyan-300'
                      : item.status === 'complete'
                        ? 'text-zinc-200'
                        : 'text-zinc-500'
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">{item.step}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
            <ChevronRight
              className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors mt-0.5 shrink-0"
              strokeWidth={1.5}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function VerdictContent() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">
          Phase 03
        </p>
        <h1
          className="text-2xl font-semibold text-white mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Verdict & Reporting
        </h1>
        <p className="text-sm text-zinc-400">Last run: 2026-05-31 02:00 UTC</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Passed', value: '142', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Failed', value: '7', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
          { label: 'Duration', value: '4m 12s', icon: Clock, color: 'text-zinc-400', bg: 'bg-zinc-800/50 border-zinc-700' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`rounded-lg border p-4 ${stat.bg}`}>
              <Icon className={`w-4 h-4 mb-2 ${stat.color}`} strokeWidth={1.5} />
              <p
                className={`text-2xl font-bold tabular-nums ${stat.color}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        {[
          { epic: 'User Authentication', passed: 24, failed: 2, thin: 0 },
          { epic: 'Test Foundation', passed: 18, failed: 0, thin: 1 },
          { epic: 'Section Validation', passed: 61, failed: 3, thin: 0 },
          { epic: 'Deployment & Automation', passed: 39, failed: 2, thin: 0 },
        ].map((row) => {
          const total = row.passed + row.failed
          const pct = Math.round((row.passed / total) * 100)
          return (
            <div key={row.epic} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm text-zinc-200"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {row.epic}
                </span>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-emerald-500">{row.passed} pass</span>
                  {row.failed > 0 && <span className="text-red-400">{row.failed} fail</span>}
                  {row.thin > 0 && <span className="text-amber-400">{row.thin} thin</span>}
                </div>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${row.failed > 0 ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InspectorContent() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold text-white mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Suite Inspector
        </h1>
        <p className="text-sm text-zinc-400">Browse test files, Gherkin stories, and oracle references.</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800 bg-zinc-900">
          <FileCode2 className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
          <span className="text-xs font-mono text-zinc-300">suites/authentication/authentication.feature</span>
        </div>
        <pre
          className="p-4 text-xs text-zinc-300 overflow-x-auto leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
{`Feature: User Authentication

  Background:
    Given the app is running at base URL
    And seed data has been loaded from oracles/auth.json

  @high @captureScreenshot
  Scenario: Successful login with valid credentials
    Given a user with valid credentials exists
    When they submit the login form
    Then they are redirected to the dashboard
    And a session token is stored
    And the user name is displayed in the header

  @high @adversarial
  Scenario: Locked account cannot log in
    Given a locked account with otherwise-valid credentials
    When they submit the login form
    Then login is rejected with status 403
    And no session token is created
    And the error message reads "Account locked"

  @edge-case
  Scenario: Login with SQL injection attempt
    Given a user enters \`' OR 1=1--\` as the password
    When they submit the login form
    Then login is rejected
    And no database error is surfaced to the UI`}
        </pre>
      </div>
    </div>
  )
}

const CONTENT: Record<string, React.ComponentType> = {
  '/foundation': FoundationContent,
  '/verdict': VerdictContent,
  '/inspector': InspectorContent,
}

export default function ShellPreview() {
  const [activeHref, setActiveHref] = useState('/foundation')

  const Content = CONTENT[activeHref]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <AppShell
        activeHref={activeHref}
        user={user}
        onNavigate={setActiveHref}
        onLogout={() => console.log('logout')}
        runCount={3}
      >
        {Content ? (
          <Content />
        ) : (
          <div className="p-8 flex flex-col items-center justify-center h-full text-center">
            <ShieldAlert className="w-10 h-10 text-zinc-700 mb-4" strokeWidth={1} />
            <p
              className="text-lg font-medium text-zinc-400 mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Coming soon
            </p>
            <p className="text-sm text-zinc-600">This section is not yet designed.</p>
          </div>
        )}
      </AppShell>
    </>
  )
}
