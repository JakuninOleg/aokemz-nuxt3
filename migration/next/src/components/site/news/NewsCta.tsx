import { NEWS_CTA } from '@/lib/news-content';
import { CatalogCtaBand } from '@/components/site/catalog/CatalogCtaBand';

export function NewsCta() {
  return (
    <CatalogCtaBand
      title={NEWS_CTA.title}
      lead={NEWS_CTA.lead}
      image={NEWS_CTA.image}
      imageAlt={NEWS_CTA.imageAlt}
      buttonLabel={NEWS_CTA.button}
      aside={NEWS_CTA.aside}
      titleId="news-cta-title"
    />
  );
}
