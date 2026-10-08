import type { Metadata } from 'next';
import { HomePage } from '@/components/site/home/HomePage';
import { pageMetadata } from '@/lib/static-content/page-seo';

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: 'Электрические машины для горнодобывающей техники | ОАО «КЭМЗ»',
  description:
    'Карпинский электромашиностроительный завод: двигатели и генераторы для ЭКГ, ЭШ, буровых установок и шахтного оборудования. Карпинск, с 1960 года.',
  path: '/',
});

export default async function Page() {
  return (
    <>
      <link
        rel="preload"
        as="font"
        href="/fonts/RobotoCondensed-Web.woff2"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="image"
        href="/media/generated/hero-quarry-dragline-wide-v11.webp"
        fetchPriority="high"
        media="(min-width: 601px)"
      />
      <link
        rel="preload"
        as="image"
        href="/media/generated/hero-quarry-mobile-v1-1024.avif"
        fetchPriority="high"
        type="image/avif"
        imageSrcSet="/media/generated/hero-quarry-mobile-v1-640.avif 640w, /media/generated/hero-quarry-mobile-v1-1024.avif 1024w"
        imageSizes="100vw"
        media="(max-width: 600px)"
      />
      <HomePage />
    </>
  );
}
