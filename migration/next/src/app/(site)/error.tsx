'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { error:Error; reset:()=>void }) {
  return <section className="ref-container next-error"><h1>Ошибка загрузки страницы</h1><p>Попробуйте открыть раздел ещё раз или перейдите в каталог продукции.</p><button className="kemz-action" onClick={reset}>Попробовать ещё раз</button><Link href="/products">Перейти в каталог</Link></section>;
}
