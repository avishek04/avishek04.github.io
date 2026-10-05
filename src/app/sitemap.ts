import type { MetadataRoute } from "next";
import { profile } from "@/content/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/experience/", "/education/", "/skills/", "/projects/", "/explore/", "/contact/"];
  return routes.map((route) => ({
    url: `${profile.siteUrl}${route}`,
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : route === "/projects/" ? 0.9 : 0.7,
  }));
}
