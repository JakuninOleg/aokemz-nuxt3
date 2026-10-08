import type { ServerProps } from 'payload'
import './oj-admin.scss'

export type OJBrandProps = {
  /** Compact mark for nav icon contexts. */
  compact?: boolean
} & Partial<ServerProps>

/**
 * OJ CMS wordmark for Payload admin graphics (Logo / Icon).
 * Text + SVG only — no extra icon packages.
 */
export default function OJBrand({ compact = false }: OJBrandProps) {
  return (
    <span className={`oj-brand${compact ? ' oj-brand--compact' : ''}`}>
      <img className="oj-brand__mark" src="/media/kemz-logo.webp" alt="" width="40" height="40" />
      <span className="oj-brand__copy">
        <span className="oj-brand__title">КЭМЗ</span>
        <span className="oj-brand__subtitle">Управление сайтом</span>
      </span>
    </span>
  )
}
