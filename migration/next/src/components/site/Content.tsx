import Link from '@/components/site/PublicLink';
import Image from 'next/image';
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react';
import type { Product } from '@/payload-types';
import { publicRichText, type PublicMedia } from '@/lib/public-content';

export function MediaImage({ media, alt, priority = false, sizes = '(max-width: 720px) 100vw, 50vw', className }: { media: PublicMedia | null; alt: string; priority?: boolean; sizes?: string; className?: string }) {
  if (!media) return <span className="media-empty">Изображение уточняется</span>;
  return <Image className={className} src={media.url} sizes={sizes} width={media.width || 800} height={media.height || 600} quality={80} alt={media.alt && /[А-Яа-яЁё]/.test(media.alt) ? media.alt : alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'low'} decoding="async" />;
}
const safeHref = (value: unknown) => typeof value === 'string' && !value.includes('\\') && !Array.from(value).some(char => char.charCodeAt(0) <= 32) && (/^(https?:|mailto:|tel:)/i.test(value) || /^\/(?!\/)/.test(value) || value.startsWith('#')) ? value : undefined;
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX }) => <a href={safeHref(node.fields.url)} target={node.fields.newTab ? '_blank' : undefined} rel={node.fields.newTab ? 'noopener noreferrer' : undefined}>{nodesToJSX({ nodes: node.children })}</a>,
  autolink: ({ node, nodesToJSX }) => <a href={safeHref(node.fields.url)}>{nodesToJSX({ nodes: node.children })}</a>,
  upload: ({ node }) => {
    const media = node.value as unknown as PublicMedia;
    if (!media || typeof media !== 'object' || !media.url) return null;
    return media.mimeType?.startsWith('image/') ? <MediaImage media={media} alt={media.title || 'Иллюстрация'} /> : <a href={media.url}>{media.title || media.filename}</a>;
  },
});
export async function RichContent({ data, className = 'product-rich' }: { data: Product['description']; className?: string }) {
  const publicData = await publicRichText(data);
  return publicData ? <RichText data={publicData} converters={converters} className={className} /> : null;
}
export function Breadcrumbs({ items }: { items: [string, string?][] }) {
  return <nav className="products-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">{items.map(([label, href], index) => <span key={label}>{index > 0 && <span aria-hidden="true"> / </span>}{href ? <Link href={href}>{label}</Link> : <span aria-current="page">{label}</span>}</span>)}</nav>;
}
export function Hero({ title, description, image = '/media/generated/hero-quarry-dragline-wide-v11.webp', crumbs = [['Главная', '/'], [title]] }: { title: string; description?: string | null; image?: string; crumbs?: [string, string?][] }) {
  return <section className="products-hero internal-hero internal-hero--mobile-surface"><img className="products-hero__image internal-hero__image" src={image} alt="Промышленная иллюстрация" width="1920" height="800" fetchPriority="high" /><div className="products-hero__content internal-hero__content"><Breadcrumbs items={crumbs} /><h1>{title}</h1>{description && <p className="products-hero__lead">{description}</p>}</div></section>;
}
export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }} />;
}
