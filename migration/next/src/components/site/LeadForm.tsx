'use client';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { ContactLeadField } from '@/lib/contact-validation';

export function LeadForm({ variant = 'simple', header, className = '' }: { variant?: 'simple' | 'technical'; header?: string; className?: string }) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const [state, setState] = useState<'form' | 'sending' | 'success'>('form');
  const [errors, setErrors] = useState<Partial<Record<ContactLeadField, string>>>({});
  const [error, setError] = useState('');
  const lock = useRef(false);
  const submission = useRef<{ fingerprint: string; requestId: string } | null>(null);
  useEffect(() => { if (state !== 'form') heading.current?.focus(); }, [state]);
  async function blur(field: ContactLeadField, value: unknown) {
    try {
      const { validateContactField, normalizeRuPhone, formatRuPhoneDisplay } = await import('@/lib/contact-validation');
      const control = form.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${field}"]`);
      if (typeof value === 'string' && control && control.value !== value) return;
      if (field === 'phone' && typeof value === 'string') {
        const phone = normalizeRuPhone(value);
        const input = form.current?.querySelector<HTMLInputElement>('[name="phone"]');
        if (phone && input && input.value === value) input.value = formatRuPhoneDisplay(phone);
      }
      setErrors(current => ({ ...current, [field]: validateContactField(field, value) }));
    } catch { setError('Не удалось загрузить проверку формы. Обновите страницу и попробуйте ещё раз.'); }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (lock.current) return;
    const data = new FormData(event.currentTarget);
    const raw = { name: data.get('name'), email: data.get('email'), phone: data.get('phone'), message: data.get('message'), consent: data.get('consent') === 'on' };
    let validation: typeof import('@/lib/contact-validation');
    try { validation = await import('@/lib/contact-validation'); }
    catch { setError('Не удалось загрузить проверку формы. Обновите страницу и попробуйте ещё раз.'); return; }
    if (lock.current) return;
    const { validateContactLead, validateTechnicalLeadDetails } = validation;
    const parsed = validateContactLead(raw);
    const nextErrors: Partial<Record<ContactLeadField, string>> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) nextErrors[issue.path[0] as ContactLeadField] = issue.message;
      setErrors(nextErrors); form.current?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus(); return;
    }
    const technical = variant === 'technical' ? validateTechnicalLeadDetails(Object.fromEntries(['equipment','machine','power','company'].map(key => [key, data.get(key)]))) : undefined;
    if (technical && !technical.success) { setError('Проверьте параметры оборудования.'); return; }
    // Keep an existing error row in the hidden form during a retry: its
    // dimensions reserve the same surface for sending and success.
    lock.current = true; setState('sending');
    const fields = { ...parsed.data, ...(technical?.success ? { technical: technical.data } : {}), sourcePath: window.location.pathname };
    const fingerprint = JSON.stringify(fields);
    try {
      if (submission.current?.fingerprint !== fingerprint) submission.current = { fingerprint, requestId: crypto.randomUUID() };
      const response = await fetch('/api/sendMail', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(60_000),
        body: JSON.stringify({ ...fields, requestId: submission.current!.requestId, website: data.get('website') || '' }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Не удалось отправить заявку.');
      form.current?.reset(); setState('success'); window.dispatchEvent(new Event('kemz:lead-sent'));
    } catch (failure) { setState('form'); setError(failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'Не удалось отправить заявку. Попробуйте позже.'); }
    finally { lock.current = false; }
  }
  const field = (name: ContactLeadField, title: string, type = 'text', placeholder = title, maxLength = 120) => <label className={`next-lead-field technical-form__${name}`} style={variant === 'technical' ? { gridArea: name } : undefined}>
    <span>{title}</span>{name === 'message' ? <textarea name={name} rows={4} maxLength={2000} placeholder={placeholder} required aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${id}-${name}` : undefined} onBlur={event => blur(name,event.target.value)} /> : <input name={name} type={type} maxLength={maxLength} placeholder={placeholder} required autoComplete={name === 'phone' ? 'tel' : name === 'email' ? 'email' : 'name'} inputMode={type === 'tel' ? 'tel' : undefined} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${id}-${name}` : undefined} onBlur={event => blur(name,event.target.value)} />}
    {errors[name] && <small id={`${id}-${name}`}>{errors[name]}</small>}</label>;
  return <div className={`next-lead-surface next-lead-surface--${variant} ${className}`}>
    <form ref={form} className="next-lead-form" noValidate onSubmit={submit} aria-hidden={state !== 'form'} inert={state !== 'form'}>
      {header && <h3>{header}</h3>}
      <label className="next-lead-honeypot" aria-hidden="true">Сайт<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <div className="next-lead-fields">
        {variant === 'technical' && <><label className="next-lead-field" style={{ gridArea:'equipment' }}><span>Тип оборудования</span><select name="equipment"><option value="">Выберите тип</option>{['Экскаваторное оборудование','Буровые установки','Шахтное оборудование','Железнодорожный транспорт','Высоковольтная аппаратура'].map(label => <option key={label}>{label}</option>)}</select></label>{[['machine','Модель техники','Например, ЭКГ-10'],['power','Необходимая мощность, кВт','Например, 560'],['company','Компания','Название компании']].map(([name,title,placeholder]) => <label key={name} className="next-lead-field" style={{ gridArea:name }}><span>{title}</span><input name={name} placeholder={placeholder} maxLength={name === 'power' ? 30 : 120} autoComplete={name === 'company' ? 'organization' : 'off'} /></label>)}</>}
        {field('name',variant === 'technical' ? 'Имя' : 'Имя / организация')}{variant === 'simple' && field('email','Email','email','Ваш почтовый адрес',160)}{field('phone','Телефон','tel','+7 (___) ___-__-__',30)}{variant === 'technical' && field('email','Email','email','Ваш почтовый адрес',160)}{field('message',variant === 'technical' ? 'Задача' : 'Сообщение','text','Привод, условия работы, сроки')}
      </div>
      <label className="form-consent"><input className="form-consent__input" name="consent" type="checkbox" required aria-invalid={Boolean(errors.consent)} onChange={event => blur('consent',event.target.checked)} /><span className="form-consent__text">Я даю согласие на обработку персональных данных в соответствии с документом на странице «Правовая информация». <Link className="form-consent__link" href="/legal#consent">Правовая информация</Link></span></label>
      {errors.consent && <p id={`${id}-consent`} className="next-lead-error">{errors.consent}</p>}{error && <p role="alert" className="next-lead-error">{error}</p>}
      <button type="submit" className="kemz-action">{variant === 'technical' ? 'Отправить в технический отдел' : 'Отправить сообщение'}<span aria-hidden="true">→</span></button>
    </form>
    {state !== 'form' && <section className={`lead-submit-state next-lead-state lead-submit-state--${state}`} aria-live="polite" aria-atomic="true" aria-busy={state === 'sending'}>
      {state === 'sending' ? <div className="lead-submit-state__spinner" aria-hidden="true" /> : <div className="lead-submit-state__check" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="27" /><path d="m20 33 8 8 17-18" /></svg></div>}
      <h2 ref={heading} tabIndex={-1} className="lead-submit-state__title">{state === 'sending' ? 'Отправляем вашу заявку…' : 'Заявка отправлена!'}</h2>
      <p className="lead-submit-state__text">{state === 'sending' ? 'Пожалуйста, подождите. Это займёт несколько секунд.' : <>Спасибо за обращение.<br />Наш специалист свяжется с вами в ближайшее рабочее время.</>}</p>
      {state === 'success' && <div className="lead-submit-state__contact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 2.8 9.5 6l-1.8 3.2c1.1 2.3 2.9 4.1 5.2 5.2l3.2-1.8 3.2 2.9-1.1 3.6c-.3.9-1.2 1.5-2.2 1.4C8.7 19.8 4.2 15.3 3.5 8c-.1-1 .5-1.9 1.4-2.2l1.7-3Z" /></svg><div><a href="tel:+73432783743">+7 (343) 278-37-43</a><span>Если вопрос срочный, позвоните нам.</span></div></div>}
    </section>}
  </div>;
}
