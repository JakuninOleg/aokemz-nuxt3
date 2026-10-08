import type { Metadata } from 'next';
import { NEWS_HERO } from '@/lib/news-content';
import { NewsHero } from '@/components/site/news/NewsHero';
import { NewsList } from '@/components/site/news/NewsList';
import { NewsCta } from '@/components/site/news/NewsCta';
import { JsonLd } from '@/components/site/Content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Новости завода',
  description:
    'Новости ОАО «КЭМЗ»: поставки, испытания, модернизация производства и работа с карьерной техникой.',
  alternates: { canonical: 'https://aokemz.ru/news' },
  openGraph: {
    title: 'Новости завода | ОАО «КЭМЗ»',
    description: NEWS_HERO.lead,
    url: 'https://aokemz.ru/news',
    images: [{ url: NEWS_HERO.image }],
  },
};

export default function NewsPage() {
  return (
    <div className="kemz-home kemz-news">
      <NewsHero />
      <NewsList />
      <NewsCta />
      <JsonLd
        value={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Новости ОАО «КЭМЗ»',
          url: 'https://aokemz.ru/news',
          description: NEWS_HERO.lead,
        }}
      />
    </div>
  );
}
