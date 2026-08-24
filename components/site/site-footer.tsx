import { Footer } from "@/components/nessa-ui";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <Footer
      brand={<Brand />}
      tagline="An applied AI lab building the layer between models and everyday life."
      note="© Nessa Labs"
      columns={[
        {
          title: "nessa-ui",
          links: [
            { href: "/ui/components", label: "Overview" },
            { href: "/ui/components/button", label: "Components" },
          ],
        },
        {
          title: "Lab",
          links: [
            { href: "/research", label: "Research" },
            { href: "/agents", label: "Agents" },
            {
              href: "https://github.com/nessalabs/nessalabs-website",
              label: "GitHub",
              external: true,
            },
          ],
        },
      ]}
    />
  );
}
