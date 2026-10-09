import type { AdminViewServerProps, CollectionSlug, Where } from 'payload';
import { formatAdminURL } from 'payload/shared';
import Link from 'next/link';
import OJAnalytics from './OJAnalytics';
import OJIcon from './OJIcon';
import OJCalendar from './OJCalendar';
import { readableDashboardCollections } from '../../lib/dashboard-access';
import { editors } from '../../access';

const COLLECTIONS = [
  { slug: 'products', label: 'Продукция', create: 'Добавить продукцию' },
  { slug: 'categories', label: 'Категории', create: 'Добавить категорию' },
  { slug: 'documents', label: 'Документы', create: 'Загрузить документ' },
  { slug: 'news', label: 'Новости', create: 'Добавить новость' },
] as const;
const LABELS = { products: 'Продукция', categories: 'Категория', documents: 'Документ', news: 'Новость', media: 'Медиа' };
const date = (value: string) => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', timeZone: 'Asia/Yekaterinburg' }).format(new Date(value));
const clock = (value: string) => new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Yekaterinburg' }).format(new Date(value));
const filterQuery = (where: Where) => {
  const params = new URLSearchParams();
  const visit = (value: unknown, key: string) => {
    if (value && typeof value === 'object') Object.entries(value).forEach(([child, item]) => visit(item, `${key}[${child}]`));
    else params.set(key, String(value));
  };
  visit(where, 'where');
  return params.toString();
};

/** Native dashboard extension. Every query uses the current authenticated request. */
export default async function OJDashboard({ initPageResult }: AdminViewServerProps) {
  const { req, visibleEntities, permissions } = initPageResult;
  if (!req.user) return null;
  const visible = readableDashboardCollections(visibleEntities?.collections ?? [], permissions);
  const canViewAnalytics = editors({ req });
  const url = (slug: CollectionSlug, suffix = '') => formatAdminURL({ adminRoute: req.payload.config.routes.admin, path: `/collections/${slug}${suffix}` });
  const checks: { collection: CollectionSlug; label: string; where: Where; icon: string }[] = [
    { collection: 'products', label: 'Продукция без изображения', where: { image: { exists: false } }, icon: 'products' },
    { collection: 'documents', label: 'Документы без файла', where: { file: { exists: false } }, icon: 'documents' },
    { collection: 'news', label: 'Черновики новостей старше 7 дней', where: { and: [{ _status: { equals: 'draft' } }, { updatedAt: { less_than: new Date(Date.now() - 7 * 86400000).toISOString() } }] }, icon: 'news' },
    { collection: 'leads', label: 'Заявки ожидают обработки', where: { status: { equals: 'new' } }, icon: 'leads' },
  ];
  const [cards, recentGroups, attention, leads] = await Promise.all([
    Promise.all(COLLECTIONS.filter(item => visible.has(item.slug)).map(async item => {
      const [total, published] = await Promise.all([
        req.payload.count({ collection: item.slug, overrideAccess: false, req }),
        req.payload.count({ collection: item.slug, overrideAccess: false, req, where: { _status: { equals: 'published' } } }),
      ]);
      return { ...item, count: total.totalDocs, published: published.totalDocs, canCreate: permissions?.collections?.[item.slug]?.create };
    })),
    Promise.all((['products', 'categories', 'documents', 'news', 'media'] as const).filter(slug => visible.has(slug)).map(async collection => {
      const result = await req.payload.find({ collection, overrideAccess: false, req, depth: 1, draft: collection !== 'media', limit: 5, sort: '-updatedAt' });
      return result.docs.map(doc => {
        const image = 'image' in doc ? doc.image : collection === 'media' ? doc : null;
        return { id: doc.id, title: 'title' in doc ? doc.title || ('filename' in doc ? doc.filename : '') || 'Без названия' : 'names' in doc ? doc.names?.join(', ') || 'Документ' : 'filename' in doc ? doc.filename || 'Файл' : 'Без названия',
          updatedAt: doc.updatedAt, status: '_status' in doc ? doc._status : null, collection,
          thumbnail: image && typeof image === 'object' && 'url' in image ? image.url : null };
      });
    })),
    Promise.all(checks.filter(check => visible.has(check.collection)).map(async check => ({ ...check,
      count: (await req.payload.count({ collection: check.collection, req, overrideAccess: false, where: check.where })).totalDocs }))),
    visible.has('leads') ? req.payload.find({ collection: 'leads', overrideAccess: false, req, depth: 0, limit: 3, sort: '-createdAt', select: { name: true, status: true, mailStatus: true, createdAt: true, sourcePath: true } }) : null,
  ]);
  const recent = recentGroups.flat().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const issues = attention.filter(item => item.count > 0);
  const issueCount = issues.reduce((sum, item) => sum + item.count, 0);
  const name = (req.user.name || '').trim().split(' ')[0];
  const now = new Date().toISOString();
  return <div className="oj-dashboard oj-overview">
    <header className="oj-overview__intro">
      <div><h1>{name ? `Добрый день, ${name}!` : 'Добрый день!'}</h1><p>Здесь всё самое важное по сайту КЭМЗ. Последние обновления, статистика и заявки.</p></div>
      <OJCalendar initialNow={now} />
      <Link href="/production" target="_blank" rel="noopener noreferrer" className="oj-overview__banner"><img src="/media/cms/kemz-workshop.webp" alt="Иллюстрация сборочного цеха электрических машин" width="1536" height="1024" /><span>Электрические машины<br />для горнодобывающей техники</span><i><OJIcon name="arrow" /></i></Link>
    </header>
    <section className={`oj-overview__stats${canViewAnalytics ? '' : ' oj-overview__stats--editor'}`} aria-label="Показатели сайта">
      {cards.map(card => <article className="oj-overview__stat" key={card.slug}>
        <Link href={url(card.slug)}><span className="oj-icon-tile"><OJIcon name={card.slug} size={24} /></span><span>{card.label}</span><span className="oj-overview__chevron" aria-hidden="true">›</span></Link>
        <strong>{card.count}</strong><p><span className="oj-dot" />{card.published} опубликовано<br /><span className="oj-overview__drafts">{card.count - card.published} в черновиках</span></p>
      </article>)}
      {canViewAnalytics && <OJAnalytics compact />}
    </section>
    <div className="oj-overview__columns">
      <div className="oj-overview__main">
        <section className="oj-panel oj-overview__changes" aria-labelledby="oj-recent-title">
          <header><h2 id="oj-recent-title">Последние изменения</h2><span>Контент сайта</span></header>
          {recent.length ? <div className="oj-overview__table-wrap"><table><thead><tr><th>Название</th><th>Тип</th><th>Статус</th><th>Дата</th></tr></thead><tbody>{recent.map(item => <tr key={`${item.collection}-${item.id}`}>
            <td><Link href={url(item.collection, `/${item.id}`)}><span className={`oj-icon-tile oj-icon-tile--${item.collection}`}>{item.thumbnail ? <img src={item.thumbnail} alt="" width="40" height="40" loading="lazy" /> : <OJIcon name={item.collection} />}</span><span><strong>{item.title}</strong><small>Запись обновлена</small></span></Link></td>
            <td><span className="oj-type">{LABELS[item.collection]}</span></td><td><span className={`oj-status oj-status--${item.status === 'draft' ? 'draft' : 'published'}`}>{item.status === 'draft' ? 'Черновик' : item.status === 'published' ? 'Опубликовано' : 'Загружено'}</span></td>
            <td><time dateTime={item.updatedAt}>{date(item.updatedAt)}<small>{clock(item.updatedAt)}</small></time></td>
          </tr>)}</tbody></table></div> : <p className="oj-overview__empty">Здесь появятся обновлённые записи.</p>}
        </section>
        {canViewAnalytics && <OJAnalytics />}
      </div>
      <aside className="oj-overview__aside">
        <section className="oj-panel oj-overview__attention" aria-labelledby="oj-attention-title"><header><h2 id="oj-attention-title">Требует внимания {issueCount > 0 && <span className="oj-attention-count">{issueCount}</span>}</h2></header>
          {issues.length ? <ul>{issues.map(issue => <li key={issue.collection}><Link href={`${url(issue.collection)}?${filterQuery(issue.where)}`}><span className="oj-icon-tile oj-icon-tile--warning"><OJIcon name={issue.icon} /></span><span>{issue.label}<small>{issue.count} записей · {LABELS[issue.collection as keyof typeof LABELS] || 'Заявки'}</small></span><span aria-hidden="true">›</span></Link></li>)}</ul> : <p className="oj-overview__empty">По этим проверкам замечаний нет.</p>}
        </section>
        <section className="oj-panel oj-overview__quick"><header><h2>Быстрые действия</h2></header><div>{[...cards, ...(visible.has('media') ? [{ slug: 'media' as const, create: 'Загрузить медиа', canCreate: permissions?.collections?.media?.create }] : [])].filter(card => card.canCreate).map(card => <Link key={card.slug} href={url(card.slug, '/create')}><span className="oj-icon-tile"><OJIcon name={card.slug} /></span>{card.create}</Link>)}<Link href="/admin/account"><span className="oj-icon-tile"><OJIcon name="user" /></span>Мой аккаунт</Link></div></section>
        {leads && <section className="oj-panel oj-overview__leads"><header><h2>Последние заявки</h2><Link href={url('leads')}>Все ({leads.totalDocs})</Link></header>
          {leads.docs.length ? <ul>{leads.docs.map(lead => <li key={lead.id}><Link href={url('leads', `/${lead.id}`)}><strong>{lead.name}</strong><small>{date(lead.createdAt)} · {({ new: 'Новая', in_progress: 'В работе', closed: 'Закрыта', spam: 'Спам' })[lead.status]}</small>{lead.mailStatus !== 'sent' && <small className="oj-leads__warning">Нет подтверждения отправки письма</small>}</Link></li>)}</ul> : <p className="oj-overview__empty">Пока заявок нет. Обращения с форм нового сайта будут сохраняться здесь.</p>}
        </section>}
      </aside>
    </div>
  </div>;
}
