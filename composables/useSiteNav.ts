export type SiteNavLink = {
  name: string
  link: string
}

export function useSiteNav() {
  const links: SiteNavLink[] = [
    { name: 'О заводе', link: '/about' },
    { name: 'Каталог', link: '/products' },
    { name: 'Новости', link: '/news' },
    { name: 'Документы', link: '/documents' },
    { name: 'Контакты', link: '/contacts' },
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
