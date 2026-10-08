import { Fragment, type ReactNode } from 'react';

/** Render string with `\n` as `<br />` (matches Vue split+br pattern). */
export function Multiline({ text }: { text: string }): ReactNode {
  const parts = text.split('\n');
  return parts.map((line, i) => (
    <Fragment key={`${i}-${line}`}>
      {line}
      {i < parts.length - 1 ? <br /> : null}
    </Fragment>
  ));
}
