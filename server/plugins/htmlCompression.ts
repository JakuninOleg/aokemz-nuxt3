import { brotliCompressSync, gzipSync, constants } from "node:zlib";
import { getRequestHeader } from "h3";

const MIN_COMPRESSIBLE_BYTES = 1024;

/**
 * The node Nitro preset does not compress SSR HTML on its own. CDN hosts may
 * already do that, so this only fills the gap when a response is still plain.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response, { event }) => {
    const contentType = response.headers?.["content-type"] || "";
    const accepts = getRequestHeader(event, "accept-encoding") || "";

    if (
      typeof response.body !== "string" ||
      response.body.length < MIN_COMPRESSIBLE_BYTES ||
      !contentType.includes("text/html") ||
      response.headers?.["content-encoding"] ||
      !accepts
    ) {
      return;
    }

    const body = Buffer.from(response.body);
    const headers = response.headers || (response.headers = {});
    const previousVary = headers.vary || headers.Vary || "";
    headers.vary = previousVary
      ? `${previousVary}, Accept-Encoding`
      : "Accept-Encoding";

    if (/\bbr\b/i.test(accepts)) {
      response.body = brotliCompressSync(body, {
        params: {
          [constants.BROTLI_PARAM_QUALITY]: 5,
        },
      });
      headers["content-encoding"] = "br";
      return;
    }

    if (/\bgzip\b/i.test(accepts)) {
      response.body = gzipSync(body, { level: 6 });
      headers["content-encoding"] = "gzip";
    }
  });
});
