// Renew consent: the old banner explicitly stated that analytics was absent.
export const ANALYTICS_CONSENT_KEY = "kemz-cookie-consent-v2";
export const ANALYTICS_CONSENT_EVENT = "kemz:analytics-consent";
export const LEAD_SENT_EVENT = "kemz:lead-sent";

export function readAnalyticsConsent(): "all" | "necessary" | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "all" || value === "necessary" ? value : null;
  } catch {
    return null;
  }
}

export function saveAnalyticsConsent(value: "all" | "necessary") {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    /* Storage may be blocked. */
  }
  window.dispatchEvent(
    new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }),
  );
}

/** No names, phones, emails, messages or product parameters go to analytics. */
export function trackLeadSent() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(LEAD_SENT_EVENT));
}
