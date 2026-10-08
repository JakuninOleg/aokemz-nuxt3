import Link from '@/components/site/PublicLink';
import { CATEGORY_EDITORIAL } from '@/lib/category-editorial';

type Props = {
  slug: string;
  products: { slug: string; title: string }[];
  publishedCategories: string[];
};

/** Server-rendered guidance after the catalogue, without client JS or invented products. */
export function CategoryOverview({ slug, products, publishedCategories }: Props) {
  const copy = CATEGORY_EDITORIAL[slug];
  if (!copy || products.length === 0) return null;
  const featured = copy.featured.flatMap(productSlug => {
    const product = products.find(item => item.slug === productSlug);
    return product ? [product] : [];
  });
  const related = copy.related.filter(category => publishedCategories.includes(category));
  return (
    <section className="category-equipment" aria-labelledby="category-selection-title">
      <div className="ref-container category-equipment__head">
        <div>
          <h2 id="category-selection-title">{copy.heading}</h2>
          {copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {featured.length > 0 && (
            <nav className="category-quicklinks" aria-label="Серии и модели этой категории">
              {featured.map(product => <Link key={product.slug} href={`/products/${slug}/${product.slug}`}>{product.title}</Link>)}
            </nav>
          )}
        </div>
        <nav className="category-quicklinks" aria-label="Связанные разделы каталога">
          {related.map(category => <Link key={category} href={`/products/${category}`}>{CATEGORY_EDITORIAL[category].label}</Link>)}
          <Link href="/documents">Каталоги и опросные листы</Link>
          <Link href="/contacts">Направить запрос в отдел продаж</Link>
        </nav>
      </div>
    </section>
  );
}
