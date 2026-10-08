import NextLink from 'next/link';
import type { ComponentProps } from 'react';

// Do not compete with the current page's LCP by preloading linked pages
// and their hero images. Navigation remains client-side when clicked.
export default function PublicLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
