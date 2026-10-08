import Link from 'next/link';
import { HomeEngineeringIcon } from '@/components/site/home/HomeEngineeringIcon';

type Props = {
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
};

export function CategoryHero({ title, lead, image, imageAlt }: Props) {
  return (
    <section
      className="category-hero internal-hero internal-hero--mobile-surface internal-hero--mobile-about"
      aria-labelledby="category-title"
    >
      <img
        className="category-hero__image internal-hero__image"
        src={image}
        alt={imageAlt}
        width={1920}
        height={800}
        fetchPriority="high"
      />
      <div className="ref-container category-hero__content internal-hero__content">
        <nav className="category-hero__crumbs internal-hero__crumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <Link href="/products">Продукция</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1 id="category-title">{title}</h1>
        <p className="category-hero__lead">{lead}</p>
        <ul className="category-hero__benefits">
          <li>
            <HomeEngineeringIcon name="factory" />
            <span>
              Собственное
              <br />
              производство
            </span>
          </li>
          <li>
            <HomeEngineeringIcon name="test" />
            <span>
              Испытания
              <br />
              на стендах завода
            </span>
          </li>
          <li>
            <HomeEngineeringIcon name="globe" />
            <span>
              Поставка по России
              <br />и странам СНГ
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
