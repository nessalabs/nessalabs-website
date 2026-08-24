import { Footer } from "@/components/nessa-ui";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <Footer
      brand={<Brand />}
      tagline="An applied AI lab. We build the layer between models and the rest of your life."
      note="© nessalabs — built with nessa-ui"
      columns={[
        {
          title: "Product",
          links: [
            { href: "/ui/components", label: "nessa-ui" },
            { href: "/ui/components/button", label: "components" },
            { href: "/research", label: "research" },
            { href: "/agents", label: "agents" },
          ],
        },
        {
          title: "Resources",
          links: [
            { href: "/ui/components", label: "documentation" },
            {
              href: "https://github.com/nessalabs/nessalabs-website",
              label: "source",
              external: true,
            },
          ],
        },
        {
          title: "Contact",
          links: [
            { href: "mailto:hello@nessalabs.ai", label: "hello@nessalabs.ai" },
            {
              href: "https://github.com/nessalabs",
              label: "github",
              external: true,
            },
          ],
        },
      ]}
    />
  );
}
