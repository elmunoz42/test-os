import { useState } from 'react'
import { Check, Lock, Copy, ChevronRight, Terminal } from 'lucide-react'
import type { SetupStep, SetupCommand } from '../types'

// ── Step pipeline ─────────────────────────────────────────────────────────────

interface StepPipelineProps {
  steps: SetupStep[]
}

function StepPipeline({ steps }: StepPipelineProps) {
  return (
    <div className="flex items-start justify-center gap-0 px-6 py-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start">
          <div className="flex flex-col items-center gap-2 w-16 sm:w-20">
            <div className={`
              relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
              ${step.status === 'complete'
                ? 'bg-cyan-500/15 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : step.status === 'active'
                  ? 'bg-zinc-900 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.35)]'
                  : 'bg-zinc-900/50 border-zinc-700/50'
              }
            `}>
              {step.status === 'complete' ? (
                <Check className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2.5} />
              ) : step.status === 'active' ? (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-20" />
                  <span className="text-[10px] font-bold text-cyan-300 relative z-10"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {String(step.order).padStart(2, '0')}
                  </span>
                </>
              ) : (
                <Lock className="w-3 h-3 text-zinc-700" strokeWidth={2} />
              )}
            </div>
            <span className={`text-[9px] text-center leading-tight hidden sm:block ${
              step.status === 'complete' ? 'text-cyan-400/70'
              : step.status === 'active' ? 'text-zinc-200'
              : 'text-zinc-700'
            }`} style={{ fontFamily: "'Inter', sans-serif" }}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-8 sm:w-10 h-px mt-4 mx-0.5 ${
              step.status === 'complete' ? 'bg-cyan-500/40' : 'bg-zinc-800'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Command block ─────────────────────────────────────────────────────────────

interface CommandBlockProps {
  cmd: SetupCommand
  onCopy?: (command: string) => void
}

function CommandBlock({ cmd, onCopy }: CommandBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(cmd.command) } catch { /* ignore */ }
    onCopy?.(cmd.command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {cmd.label}
      </p>
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden group">
        <div className="flex items-start gap-2 px-4 py-3">
          <pre className="flex-1 text-[11px] text-cyan-300 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {cmd.command}
          </pre>
          <button
            onClick={handleCopy}
            className={`shrink-0 mt-0.5 flex items-center gap-1 px-2 py-1 rounded text-[10px] border transition-all ${
              copied
                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                : 'text-zinc-600 border-zinc-700/50 hover:text-zinc-300 hover:border-zinc-600 opacity-0 group-hover:opacity-100'
            }`}
          >
            {copied ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" strokeWidth={1.5} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      {cmd.comment && (
        <p className="text-[10px] text-zinc-600 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          {cmd.comment}
        </p>
      )}
    </div>
  )
}

// ── Collapsed complete step ───────────────────────────────────────────────────

function CompletedRow({ step }: { step: SetupStep }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border border-zinc-800 rounded-lg bg-zinc-900/30">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/40 shrink-0">
        <Check className="w-3 h-3 text-cyan-400" strokeWidth={2.5} />
      </div>
      <span className="text-[10px] font-bold text-zinc-600 w-5 shrink-0"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {String(step.order).padStart(2, '0')}
      </span>
      <span className="text-sm font-medium text-zinc-300 flex-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {step.title}
      </span>
      {step.confirmedAt && (
        <span className="text-[10px] text-zinc-600 shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {new Date(step.confirmedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )}
    </div>
  )
}

// ── Locked step ───────────────────────────────────────────────────────────────

function LockedRow({ step }: { step: SetupStep }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border border-zinc-800/50 rounded-lg opacity-35 cursor-not-allowed">
      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-zinc-700 shrink-0">
        <Lock className="w-2.5 h-2.5 text-zinc-700" strokeWidth={2} />
      </div>
      <span className="text-[10px] font-bold text-zinc-700 w-5 shrink-0"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {String(step.order).padStart(2, '0')}
      </span>
      <span className="text-sm font-medium text-zinc-600"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {step.title}
      </span>
    </div>
  )
}

// ── Active expanded step ──────────────────────────────────────────────────────

interface ActiveStepProps {
  step: SetupStep
  onConfirm: () => void
  onCopy?: (command: string) => void
}

function ActiveStep({ step, onConfirm, onCopy }: ActiveStepProps) {
  return (
    <div className="border border-cyan-500/25 rounded-xl overflow-hidden shadow-[0_0_24px_rgba(6,182,212,0.04)] bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500/15 border-2 border-cyan-400 shrink-0">
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-15" />
          <span className="text-[11px] font-bold text-cyan-300 relative z-10"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {String(step.order).padStart(2, '0')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {step.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            {step.description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-600 shrink-0">
          <Terminal className="w-3 h-3" strokeWidth={1.5} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {step.commands.length} {step.commands.length === 1 ? 'command' : 'commands'}
          </span>
        </div>
      </div>

      {/* Commands */}
      <div className="px-5 py-4 space-y-4 border-b border-zinc-800">
        {step.commands.map((cmd, i) => (
          <CommandBlock key={i} cmd={cmd} onCopy={onCopy} />
        ))}
      </div>

      {/* Confirm */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-xs text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
          Run the command{step.commands.length > 1 ? 's' : ''} above, then confirm to continue.
        </p>
        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
            bg-cyan-500/15 border border-cyan-500/45 text-cyan-300
            hover:bg-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]
            transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Confirm Step
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

// ── Main SetupWizard ──────────────────────────────────────────────────────────

interface SetupWizardProps {
  steps: SetupStep[]
  onConfirmStep?: (stepId: string) => void
  onCopyCommand?: (command: string) => void
}

export function SetupWizard({ steps, onConfirmStep, onCopyCommand }: SetupWizardProps) {
  return (
    <div className="min-h-full">
      <div className="px-6 pt-8 pb-2">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Phase 04
        </p>
        <h1 className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Deployment & Automation
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          Configure the EC2 runner and nightly cron schedule. Complete all 5 steps to activate
          automated nightly validation runs.
        </p>
      </div>

      <StepPipeline steps={steps} />

      <div className="px-6 pb-8 flex flex-col gap-3 max-w-2xl">
        {steps.map((step) => {
          if (step.status === 'complete') return <CompletedRow key={step.id} step={step} />
          if (step.status === 'active') return (
            <ActiveStep
              key={step.id}
              step={step}
              onConfirm={() => onConfirmStep?.(step.id)}
              onCopy={onCopyCommand}
            />
          )
          return <LockedRow key={step.id} step={step} />
        })}
      </div>
    </div>
  )
}
