import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { P, UL, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookies and Local Storage · Kae & Jae Cafe",
  description: "What small files and browser storage the Kae & Jae Cafe website uses.",
};

const sections: LegalSection[] = [
  {
    id: "what",
    title: "What this covers",
    body: (
      <P>
        Cookies and browser storage are small pieces of data saved on your phone or computer. We use them only to make the website work. We do not use advertising or tracking cookies, and we do not sell data to advertisers.
      </P>
    ),
  },
  {
    id: "used",
    title: "What we store",
    body: (
      <UL>
        <li><strong>Theme choice (local storage, &ldquo;kj-theme&rdquo;):</strong> remembers whether you picked light or dark mode.</li>
        <li><strong>Active order (local storage, &ldquo;active_order_id&rdquo;):</strong> remembers your latest order number so we can show a link back to your order tracking page.</li>
        <li><strong>Staff session (cookies):</strong> set by our authentication provider only when staff log in, to keep them signed in. Customers do not receive these.</li>
      </UL>
    ),
  },
  {
    id: "third",
    title: "Third parties",
    body: (
      <P>
        Map pages load map tiles from OpenStreetMap servers, and online payments are handled on PayMongo&rsquo;s own pages when available. Those services may receive your IP address and set their own cookies under their own policies.
      </P>
    ),
  },
  {
    id: "control",
    title: "Your choices",
    body: (
      <P>
        You can clear this data at any time in your browser settings. The website will still work, but it will forget your theme and recent order link. More about how we handle personal data is in the <Link className="font-bold underline" href="/privacy">Privacy Policy</Link>.
      </P>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      current="/cookies"
      title="Cookies and Local Storage"
      intro="We keep this to the minimum: a theme setting, your latest order link and, for staff only, a login session."
      sections={sections}
    />
  );
}
