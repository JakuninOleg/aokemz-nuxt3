import type { Metadata } from 'next';
import { HomePage } from '@/components/site/home/HomePage';
import { pageMetadata } from '@/lib/static-content/page-seo';

export const dynamic = 'force-dynamic';

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
        href="/fonts/RobotoCondensed-Variable.subset.woff2"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="image"
        href="/media/generated/hero-quarry-dragline-wide-v11.webp"
        media="(min-width: 601px)"
      />
      <link
        rel="preload"
        as="image"
        href="/media/generated/hero-quarry-dragline-wide-v11-480.webp"
        media="(max-width: 480px)"
      />
      <link
        rel="preload"
        as="image"
        href="/media/generated/hero-quarry-dragline-wide-v11-640.webp"
        media="(min-width: 481px) and (max-width: 600px)"
      />
      <HomePage />
    </>
  );
}
