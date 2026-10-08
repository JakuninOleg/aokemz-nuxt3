import { LegalCta } from './LegalCta';
import { LegalDocument } from './LegalDocument';
import { LegalHero } from './LegalHero';

export function LegalPage() {
  return (
    <div className="kemz-home kemz-legal">
      <LegalHero />
      <LegalDocument />
      <LegalCta />
    </div>
  );
}
