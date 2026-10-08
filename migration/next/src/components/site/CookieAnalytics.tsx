'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
const key = 'kemz-cookie-consent-v2';
type Consent = 'all' | 'necessary';
type Metrika = ((...args:unknown[])=>void) & { a?:unknown[][]; l?:number };
function stored(): Consent | null { try { const value=localStorage.getItem(key); return value === 'all' || value === 'necessary' ? value : null; } catch { return null; } }
export function CookieAnalytics() {
  const [visible,setVisible] = useState(false), [allowed,setAllowed] = useState(false);
  const initialized = useRef(false), previous = useRef('');
  const pathname = usePathname();
  useEffect(()=>{
    const update = () => { const value=stored(); setVisible(!value); setAllowed(value === 'all'); };
    update();
    const storage = (event:StorageEvent) => { if (event.key === key || event.key === null) update(); };
    const settings = () => setVisible(true);
    window.addEventListener('storage',storage); window.addEventListener('kemz:cookie-settings',settings);
    return ()=>{window.removeEventListener('storage',storage);window.removeEventListener('kemz:cookie-settings',settings);};
  },[]);
  useEffect(()=>{
    if (!['aokemz.ru','www.aokemz.ru'].includes(location.hostname)) return;
    const target = window as Window & { ym?:Metrika };
    const id=113528354;
    if (!allowed) { if (initialized.current) target.ym?.(id,'destruct'); initialized.current=false;previous.current='';return; }
    if (!initialized.current) {
      target.ym ||= Object.assign((...args:unknown[])=>{target.ym!.a ||= [];target.ym!.a.push(args);},{l:Date.now()});
      let referrer=''; try { const url=new URL(document.referrer); referrer=url.origin+url.pathname; } catch { /* No referrer */ }
      target.ym(id,'init',{defer:true,url:location.origin+pathname,referrer,webvisor:false,clickmap:false,trackLinks:false,accurateTrackBounce:true});
      if (!document.getElementById('kemz-metrika')) { const script=document.createElement('script');script.id='kemz-metrika';script.async=true;script.src='https://mc.yandex.ru/metrika/tag.js';document.head.appendChild(script); }
      initialized.current=true;
    }
    const url=location.origin+pathname;
    if (url !== previous.current) { target.ym?.(id,'hit',url,{title:document.title,referer:previous.current});previous.current=url; }
    const lead=()=>{target.ym?.(id,'reachGoal','lead_sent');};
    window.addEventListener('kemz:lead-sent',lead);
    return ()=>window.removeEventListener('kemz:lead-sent',lead);
  },[allowed,pathname]);
  function save(value:Consent) { try {localStorage.setItem(key,value);}catch{/* blocked storage */}setAllowed(value==='all');setVisible(false); }
  return visible ? <div className="cookie-banner" role="dialog" aria-label="Уведомление об использовании cookie"><div className="cookie-banner__inner"><div className="cookie-banner__copy"><p className="cookie-banner__title">Файлы cookie</p><p>Сайт сохраняет ваш выбор cookie. С вашего согласия Яндекс Метрика собирает статистику посещений и успешных заявок без записи содержимого форм. Подробнее: <Link href="/legal#cookies">политика cookie</Link>.</p></div><div className="cookie-banner__actions"><button className="cookie-banner__ghost" onClick={()=>save('necessary')}>Только необходимые</button><button className="cookie-banner__primary" onClick={()=>save('all')}>Принять все</button></div></div></div> : null;
}
export function CookieSettings() { return <button className="next-cookie-settings" type="button" onClick={()=>window.dispatchEvent(new Event('kemz:cookie-settings'))}>Настройки cookie</button>; }
