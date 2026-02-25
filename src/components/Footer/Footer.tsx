"use client";

import Link from "next/link";

import { FOOTER_LINKS } from "@/app/shared/constants";

import { Button } from "@/components/Button";
import {
  EnvelopeIcon,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  x: XIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
} as const;

export const Footer: React.FC = () => {
  const handleNewsletterClick = () => {
    // Placeholder: no backend yet
  };

  return (
    <footer
      className="mt-16 border-t border-neutral-700 bg-neutral-800 text-neutral-300 dark:bg-neutral-950 dark:border-neutral-800"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <nav aria-label="About us">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              About Us
            </h2>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.about.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-300 transition-colors hover:text-white dark:text-gray-400 dark:hover:text-zinc-50"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Customer support">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Customer Support
            </h2>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.support.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-300 transition-colors hover:text-white dark:text-gray-400 dark:hover:text-zinc-50"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Connect With Us
            </h2>
            <div className="mb-4 flex gap-3">
              {FOOTER_LINKS.social.map(({ id, href, ariaLabel }) => {
                const Icon = SOCIAL_ICONS[id];
                return (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    className="text-neutral-400 transition-colors hover:text-white"
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>
            <p className="mb-3 text-sm text-neutral-400">
              Want $20 off? Sign up for our newsletter.
            </p>
            <Button
              onClick={handleNewsletterClick}
              dataTestId="footer-newsletter"
              ariaLabel="Get in the loop - sign up for our newsletter"
              variant="outline"
            >
              <span className="flex items-center gap-2">
                <EnvelopeIcon size={18} />
                Get in the loop!
              </span>
            </Button>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-700 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
              <span className="rounded border border-neutral-600 px-2 py-0.5">
                Web Shop
              </span>
              {FOOTER_LINKS.legal.map(({ label, href }, index) => (
                <span key={label} className="flex items-center gap-2">
                  {index > 0 && (
                    <span
                      aria-hidden
                      className="text-gray-600 dark:text-gray-600"
                    >
                      |
                    </span>
                  )}
                  <a
                    href={href}
                    className="text-neutral-500 transition-colors hover:text-neutral-400"
                  >
                    {label}
                  </a>
                </span>
              ))}
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-xs text-neutral-500">
            Web Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
