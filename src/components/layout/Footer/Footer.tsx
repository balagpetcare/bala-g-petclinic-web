import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { siteConfig, contactInfo, businessHours, socialLinks, footerSections } from '@/config';
import { formatContactAddress, toTelHref } from '@/lib/utils';

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: null,
  youtube: null,
  linkedin: null,
  whatsapp: MessageCircle,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <Link
                className="inline-block text-2xl font-bold text-white"
                href="/"
              >
                <span className="text-primary-400">{siteConfig.shortName}</span>{' '}
                Pet Clinic
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
                {siteConfig.description}
              </p>

              <div className="mt-6 space-y-3">
                <a
                  className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors"
                  href={toTelHref(contactInfo.phone)}
                >
                  <Phone className="h-4 w-4 text-primary-400" />
                  {contactInfo.phone}
                </a>
                <a
                  className="flex items-center gap-3 text-sm hover:text-primary-400 transition-colors"
                  href={`mailto:${contactInfo.email}`}
                >
                  <Mail className="h-4 w-4 text-primary-400" />
                  {contactInfo.email}
                </a>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                  <span>{formatContactAddress(contactInfo)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={social.platform}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-primary-600 hover:text-white transition-colors"
                      href={social.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      title={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="text-sm hover:text-primary-400 transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Working Hours
              </h3>
              <ul className="space-y-2">
                {businessHours.slice(0, 6).map((hours) => (
                  <li
                    key={hours.day}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-neutral-400">{hours.day}</span>
                    <span>
                      {hours.isClosed
                        ? 'Closed'
                        : `${hours.open} - ${hours.close}`}
                    </span>
                  </li>
                ))}
                <li className="flex justify-between text-sm">
                  <span className="text-neutral-400">Sunday</span>
                  <span>
                    {businessHours[6]?.isClosed
                      ? 'Closed'
                      : `${businessHours[6]?.open} - ${businessHours[6]?.close}`}
                  </span>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary-400">
                <Clock className="h-4 w-4" />
                <span>24/7 Emergency Available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-400 sm:flex-row">
            <p>
              &copy; {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link className="hover:text-primary-400 transition-colors" href="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="hover:text-primary-400 transition-colors" href="/terms-of-service">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
