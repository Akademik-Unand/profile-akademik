import { Icon } from '../ui/Icon';
import { formatAddressLines } from '../../helpers/formatAddress';

function ContactRow({ icon, children }) {
  return (
    <div className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
      <Icon icon={icon} className="mt-0.5 size-4 shrink-0 text-white" />
      <div>{children}</div>
    </div>
  );
}

export function FooterContact({ unit }) {
  const lines = formatAddressLines(unit?.address);

  return (
    <div className="lg:col-span-4">
      <p className="mb-4 font-headline text-sm tracking-wide">Kontak</p>
      <div className="space-y-3">
        {lines.length ? (
          <ContactRow icon="mdi:map-marker-outline">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </ContactRow>
        ) : null}
        {unit?.phone ? <ContactRow icon="mdi:phone-outline">{unit.phone}</ContactRow> : null}
        {unit?.fax ? <ContactRow icon="mdi:fax">{unit.fax}</ContactRow> : null}
        {unit?.email ? (
          <ContactRow icon="mdi:email-outline">
            <a href={`mailto:${unit.email}`} className="break-all hover:text-white">
              {unit.email}
            </a>
          </ContactRow>
        ) : null}
      </div>
    </div>
  );
}
