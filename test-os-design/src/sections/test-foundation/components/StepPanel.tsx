import { Check, Lock, ChevronRight, FileCode2, Terminal } from 'lucide-react'
import type { FoundationStep, EditableField } from '@/../product/sections/test-foundation/types'

interface FieldInputProps {
  field: EditableField
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function FieldInput({ field, value, onChange, disabled }: FieldInputProps) {
  const baseClass = `
    w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200
    placeholder:text-zinc-600 transition-colors
    focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20
    disabled:opacity-40 disabled:cursor-not-allowed
  `

  if (field.type === 'select' && field.options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={baseClass}
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
      >
        {field.options.map((opt) => (
          <option key={opt} value={opt} className="bg-zinc-900">
            {opt}
          </option>
        ))}
      </select>
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className={`${baseClass} resize-none leading-relaxed`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      />
    )
  }

  return (
    <input
      type={field.type === 'url' ? 'url' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={baseClass}
      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
    />
  )
}

// Collapsed completed step row
interface CompletedStepRowProps {
  step: FoundationStep
}

export function CompletedStepRow({ step }: CompletedStepRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 border border-zinc-800 rounded-lg bg-zinc-900/30 group">
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/40 shrink-0">
        <Check className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          className="text-[10px] font-bold text-zinc-500"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {String(step.order).padStart(2, '0')}
        </span>
        <span
          className="text-sm font-medium text-zinc-300"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {step.label}
        </span>
        <span
          className="text-[10px] text-violet-400/60 font-mono hidden sm:inline"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {step.command}
        </span>
      </div>
      {step.confirmedAt && (
        <span
          className="text-[10px] text-zinc-600 shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {new Date(step.confirmedAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      )}
    </div>
  )
}

// Locked step row
interface LockedStepRowProps {
  step: FoundationStep
}

export function LockedStepRow({ step }: LockedStepRowProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 border border-zinc-800/50 rounded-lg opacity-40 cursor-not-allowed">
      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-zinc-700 shrink-0">
        <Lock className="w-3 h-3 text-zinc-600" strokeWidth={2} />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          className="text-[10px] font-bold text-zinc-600"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {String(step.order).padStart(2, '0')}
        </span>
        <span
          className="text-sm font-medium text-zinc-500"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {step.label}
        </span>
      </div>
    </div>
  )
}

// Active expanded step panel
interface ActiveStepPanelProps {
  step: FoundationStep
  fieldValues: Record<string, string>
  onFieldChange: (fieldKey: string, value: string) => void
  onConfirm: () => void
}

export function ActiveStepPanel({
  step,
  fieldValues,
  onFieldChange,
  onConfirm,
}: ActiveStepPanelProps) {
  const allFilled = step.editableFields.every((f) => (fieldValues[f.key] ?? f.value).trim() !== '')

  return (
    <div className="border border-cyan-500/25 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)] bg-zinc-900">
      {/* Step header */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500/15 border-2 border-cyan-400 shrink-0 relative">
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-20" />
          <span
            className="text-[11px] font-bold text-cyan-300 relative z-10"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {String(step.order).padStart(2, '0')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-base font-semibold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {step.label}
            </h3>
            <span
              className="text-[10px] text-violet-400 font-mono border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 rounded"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {step.command}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{step.description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 shrink-0">
          <FileCode2 className="w-3 h-3" strokeWidth={1.5} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{step.artifact}</span>
        </div>
      </div>

      {/* Generated content preview */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Generated Draft
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800/50">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-amber-500/60" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
            <span
              className="ml-2 text-[10px] text-zinc-600"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {step.artifact}
            </span>
          </div>
          <pre
            className="px-4 py-3 text-xs text-zinc-400 overflow-x-auto leading-relaxed max-h-48 overflow-y-auto"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {step.generatedContent}
          </pre>
        </div>
      </div>

      {/* Editable fields */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <ChevronRight className="w-3.5 h-3.5 text-cyan-500" strokeWidth={2} />
          <span className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest">
            Configure Key Values
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {step.editableFields.map((field) => (
            <div
              key={field.key}
              className={field.type === 'textarea' ? 'col-span-full' : ''}
            >
              <label
                className="block text-[11px] font-medium text-zinc-400 mb-1.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {field.label}
              </label>
              <FieldInput
                field={field}
                value={fieldValues[field.key] ?? field.value}
                onChange={(val) => onFieldChange(field.key, val)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Confirm action */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-xs text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
          Confirming will write{' '}
          <span className="font-mono text-zinc-500">{step.artifact}</span> to the workspace.
        </p>
        <button
          onClick={onConfirm}
          disabled={!allFilled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
            ${
              allFilled
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-600 cursor-not-allowed'
            }
          `}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Confirm Step
          <ChevronRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
