import { createFileRoute } from "@tanstack/react-router";
import { BrandStudio } from "@/components/brand-studio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ink Loom Studio — AI Brand Builder" },
      { name: "description", content: "Build expressive brand systems and dynamic landing pages in one live AI studio." },
      { property: "og:title", content: "Ink Loom Studio — AI Brand Builder" },
      { property: "og:description", content: "Build expressive brand systems and dynamic landing pages in one live AI studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <BrandStudio />;
}
