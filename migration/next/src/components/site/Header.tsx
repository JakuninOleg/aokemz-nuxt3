'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from '@/components/site/PublicLink';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/navigation';
import '@/styles/mobile-menu.scss';

const SALES_PHONE_DISPLAY = '+7 (343) 278-37-43';
const SALES_PHONE_HREF = 'tel:+73432783743';
const SALES_EMAIL = 'sales@aokemz.ru';

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

function isActiveLink(linkPath: string, path: string) {
  if (linkPath === '/') return path === '/';
  return path === linkPath || path.startsWith(`${linkPath}/`);
}

export function Brand() {
  return (
    <Link href="/" className="site-header__brand">
      <img
        className="site-header__logo"
        src="/media/kemz-logo.webp"
        alt="Логотип КЭМЗ"
        width={44}
        height={50}
      />
      <span className="site-header__brand-text">
        <strong>КЭМЗ</strong>
        <small>
          Карпинский
          <br />
          электромашиностроительный
          <br />
          завод
        </small>
      </span>
    </Link>
  );
}

export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const path = normalizePath(pathname);
  const isHome = path === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const previousOverflow = useRef<string | null>(null);

  const restoreScroll = useCallback(() => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }, []);

  const syncExpanded = useCallback((open: boolean) => {
    setMenuOpen(open);
    trigger.current?.setAttribute('aria-expanded', open ? 'true' : 'false');
  }, []);

  const closeMenu = useCallback(() => {
    dialog.current?.close();
  }, []);

  const openMenu = useCallback(() => {
    const element = dialog.current;
    if (!element || element.open) return;
    previousOverflow.current ??= document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    syncExpanded(true);
    closeBtn.current?.focus();
  }, [syncExpanded]);

  const onDialogClose = useCallback(() => {
    syncExpanded(false);
    restoreScroll();
  }, [restoreScroll, syncExpanded]);

  useEffect(() => {
    closeMenu();
    return restoreScroll;
  }, [pathname, closeMenu, restoreScroll]);

  useEffect(() => {
    const element = dialog.current;
    const lockScroll = () => {
      if (element?.open) {
        previousOverflow.current ??= document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        syncExpanded(true);
      } else {
        restoreScroll();
        syncExpanded(false);
      }
    };
    const observer = new MutationObserver(lockScroll);
    if (element) observer.observe(element, { attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
      restoreScroll();
    };
  }, [restoreScroll, syncExpanded]);

  const ctaHref = isHome ? '/#technical-request' : '/contacts';

  return (
    <header className="site-header site-header--reference">
      <div className="site-header__bar">
        <Brand />
        <nav className="site-header__nav" aria-label="Основная навигация">
          {navigation.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`site-header__link${isActiveLink(href, path) ? ' is-active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <a href={SALES_PHONE_HREF} className="site-header__phone">
            {SALES_PHONE_DISPLAY}
          </a>
          <Link href={ctaHref} className="site-header__cta">
            Связаться
          </Link>
          <button
            ref={trigger}
            type="button"
            className="site-header__burger"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-controls="mobile-drawer"
            aria-expanded={menuOpen}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
          >
            <span
              className={`site-header__burger-lines${menuOpen ? ' open' : ''}`}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        id="mobile-drawer"
        className="next-menu site-drawer"
        aria-label="Мобильное меню"
        onClose={onDialogClose}
        onClick={(event) => {
          if (event.target === dialog.current) closeMenu();
        }}
      >
        <div className="site-drawer__head">
          <Link href="/" className="site-drawer__brand" onClick={closeMenu}>
            <img
              src="/media/kemz-logo.webp"
              alt="Логотип ОАО КЭМЗ"
              width={44}
              height={50}
            />
            <span>
              <strong>КЭМЗ</strong>
              <small>Карпинский электромашиностроительный завод</small>
            </span>
          </Link>
          <button
            ref={closeBtn}
            type="button"
            className="site-drawer__close"
            aria-label="Закрыть меню"
            onClick={closeMenu}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <p className="site-drawer__title">Меню</p>
        <ul className="site-drawer__list">
          <li>
            <Link
              href="/"
              className={`site-drawer__link${path === '/' ? ' is-active' : ''}`}
              onClick={closeMenu}
            >
              Главная
            </Link>
          </li>
          {navigation.map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className={`site-drawer__link${isActiveLink(href, path) ? ' is-active' : ''}`}
                onClick={closeMenu}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="site-drawer__foot">
          <a href={SALES_PHONE_HREF} className="site-drawer__contact">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.6 3.7 9 6.1 7.5 9.4a15.5 15.5 0 0 0 7.1 7.1l3.3-1.5 2.4 2.4-1.2 3.1c-.3.8-1.2 1.2-2 .9C9.5 18.9 5.1 14.5 2.6 6.9c-.3-.8.1-1.7.9-2Z" />
            </svg>
            <span>{SALES_PHONE_DISPLAY}</span>
          </a>
          <a href={`mailto:${SALES_EMAIL}`} className="site-drawer__contact">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5h18v14H3zM3 6l9 7 9-7" />
            </svg>
            <span>{SALES_EMAIL}</span>
          </a>
          <Link
            href="/contacts"
            className="kemz-action site-drawer__cta"
            onClick={closeMenu}
          >
            <span>Связаться</span>
            <span aria-hidden="true">→</span>
          </Link>
          <p className="site-drawer__tagline">
            Надёжные решения
            <br />
            для реальных задач
          </p>
        </div>
        <div className="site-drawer__blueprint" aria-hidden="true" />
      </dialog>
    </header>
  );
}
