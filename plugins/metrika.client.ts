import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  LEAD_SENT_EVENT,
  readAnalyticsConsent,
} from "~/utils/analyticsConsent";

type Metrika = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

export default defineNuxtPlugin((nuxtApp) => {
  if (!["aokemz.ru", "www.aokemz.ru"].includes(window.location.hostname))
    return;
  const id = Number(useRuntimeConfig().public.metrikaId);
  if (!Number.isSafeInteger(id) || id <= 0) return;
  const target = window as Window & { ym?: Metrika };
  let allowed = readAnalyticsConsent() === "all";
  let initialized = false;
  let lastUrl = "";

  function hit() {
    if (!allowed || !initialized) return;
    const url = window.location.origin + window.location.pathname;
    if (url === lastUrl) return;
    target.ym?.(id, "hit", url, {
      title: document.title,
      referer: lastUrl || cleanReferrer(),
    });
    lastUrl = url;
  }

  function cleanReferrer() {
    try {
      const url = new URL(document.referrer);
      return url.origin + url.pathname;
    } catch {
      return "";
    }
  }

  function start() {
    if (!allowed || initialized) return;
    initialized = true;
    target.ym =
      target.ym ||
      Object.assign(
        (...args: unknown[]) => {
          target.ym!.a = target.ym!.a || [];
          target.ym!.a.push(args);
        },
        { l: Date.now() },
      );
    target.ym(id, "init", {
      defer: true,
      url: window.location.origin + window.location.pathname,
      referrer: cleanReferrer(),
      webvisor: false,
      clickmap: false,
      trackLinks: false,
      accurateTrackBounce: true,
    });
    if (!document.getElementById("kemz-metrika")) {
      const script = document.createElement("script");
      script.id = "kemz-metrika";
      script.async = true;
      script.src = "https://mc.yandex.ru/metrika/tag.js";
      document.head.appendChild(script);
    }
    hit();
  }

  function consent(value: unknown) {
    allowed = value === "all";
    if (allowed) start();
    else if (initialized) {
      target.ym?.(id, "destruct");
      initialized = false;
      lastUrl = "";
    }
  }
  window.addEventListener(ANALYTICS_CONSENT_EVENT, (event) =>
    consent((event as CustomEvent).detail),
  );
  window.addEventListener("storage", (event) => {
    if (event.key === ANALYTICS_CONSENT_KEY || event.key === null)
      consent(readAnalyticsConsent());
  });
  window.addEventListener(LEAD_SENT_EVENT, () => {
    if (allowed && initialized) target.ym?.(id, "reachGoal", "lead_sent");
  });
  nuxtApp.hook("page:finish", hit);
  nuxtApp.hook("app:mounted", start);
});
