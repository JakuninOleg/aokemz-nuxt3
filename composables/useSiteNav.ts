export type SiteNavLink = {
  name: string
  link: string
}

export function useSiteNav() {
  const links: SiteNavLink[] = [
    { name: 'Продукция', link: '/products' },
    { name: 'Производство', link: '/production' },
    { name: 'О заводе', link: '/about' },
    { name: 'Документы', link: '/documents' },
    { name: 'Новости', link: '/news' },
  ]

  const salesPhoneDisplay = '+7 (343) 278-37-43'
  const salesPhoneHref = 'tel:+73432783743'
  const salesEmail = 'sales@aokemz.ru'

  const isActiveLink = (linkPath: string, path: string) => {
    if (linkPath === '/') return path === '/'
    return path === linkPath || path.startsWith(`${linkPath}/`)
  }

  return {
    links,
    salesPhoneDisplay,
    salesPhoneHref,
    salesEmail,
    isActiveLink,
  }
}
