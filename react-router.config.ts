import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // Fully static site: no runtime server. Routes are prerendered to HTML at
  // build time (SSG) and hydrated on the client. Deploy the static
  // `build/client` output to Cloudflare Pages.
  ssr: false,
  prerender: ["/"],
} satisfies Config;
