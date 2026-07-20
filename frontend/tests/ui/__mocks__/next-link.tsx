import type { AnchorHTMLAttributes, ReactNode } from 'react';

type LinkHref = string | { pathname?: string };

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: LinkHref;
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

function normalizeHref(href: LinkHref) {
  return typeof href === 'string' ? href : href.pathname ?? '#';
}

export default function Link({
  href,
  children,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  ...props
}: LinkProps) {
  return (
    <a href={normalizeHref(href)} {...props}>
      {children}
    </a>
  );
}
