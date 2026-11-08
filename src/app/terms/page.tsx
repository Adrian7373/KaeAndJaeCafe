import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { P, UL, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions · Kae & Jae Cafe",
  description: "The rules for ordering from and using the Kae & Jae Cafe website.",
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement",
    body: (
      <>
        <P>
          These Terms and Conditions govern your use of the Kae &amp; Jae Cafe website and your orders from Kae &amp; Jae Cafe, a mobile kitchen at Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100. By using the website, placing an order or logging in, you agree to these Terms, our <Link className="font-bold underline" href="/privacy">Privacy Policy</Link>, our <Link className="font-bold underline" href="/refund-policy">Refund, Cancellation and Delivery Policy</Link> and our <Link className="font-bold underline" href="/cookies">Cookies and Local Storage</Link> notice.
        </P>
        <P>If you do not agree, please do not use the website. Under the Electronic Commerce Act (RA 8792), an order and agreement made electronically are valid and enforceable.</P>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "Who may order",
    body: (
      <P>
        You must be at least 18 years old, or use the website under the supervision and with the permission of a parent or guardian. You must give accurate details, including a working mobile number, so we can reach you about your order.
      </P>
    ),
  },
  {
    id: "ordering",
    title: "Ordering",
    body: (
      <>
        <UL>
          <li>Placing an order is an offer to buy. We accept it when we start preparing it, which you can see on the order tracking page. We may decline or cancel an order, for example when an item is sold out, we are closed, the address is outside our delivery area or we cannot reach you. If we cancel after you paid, we refund you in full.</li>
          <li>We are open Monday to Saturday, 10:00 AM to 6:00 PM, and closed on Sundays. Orders and scheduled pickup times outside these hours may not be available.</li>
          <li>Menu items, photos and availability may change without notice. Photos are for illustration, and some images on this site are AI-generated and may differ from the actual dish.</li>
          <li>Dishes are cooked when ordered. Preparation and delivery times shown are estimates, not guarantees.</li>
        </UL>
      </>
    ),
  },
  {
    id: "prices",
    title: "Prices and payment",
    body: (
      <>
        <UL>
          <li>All prices are in Philippine pesos (₱). The delivery fee depends on your distance from our kitchen and is shown at checkout before you place the order.</li>
          <li>You pay the total shown at checkout. We correct obvious pricing errors and will contact you before preparing the order at the corrected price; you may then cancel at no charge.</li>
          <li>Accepted payment: cash on delivery or at pickup. Online payment through GCash, processed by PayMongo, will be offered when it becomes available. Online payments are also subject to PayMongo&rsquo;s own terms.</li>
        </UL>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery and pickup",
    body: (
      <P>
        Delivery is limited to the area shown at checkout. You must provide an accurate address and be reachable on your mobile number. Delivery, cancellation and refund rules are in our <Link className="font-bold underline" href="/refund-policy">Refund, Cancellation and Delivery Policy</Link>.
      </P>
    ),
  },
  {
    id: "food-safety",
    title: "Food safety and allergens",
    body: (
      <>
        <P>
          We prepare food following the Food Safety Act of 2013 (RA 10611). Our kitchen handles ingredients that may include peanuts, tree nuts, soy, wheat, egg, milk, fish, shellfish and sesame, and some dishes are very spicy. Cross-contact is possible. If you have a food allergy or dietary restriction, message us before ordering. We cannot guarantee any item is free of an allergen.
        </P>
        <P>Please eat food soon after it arrives and keep it refrigerated if you save any. We are not responsible for food that is stored or reheated improperly after delivery.</P>
      </>
    ),
  },
  {
    id: "staff",
    title: "Staff login",
    body: (
      <P>
        The login page is for authorized Kae &amp; Jae Cafe staff only (Admin, Cashier and Rider). Do not try to access it without permission or share the password. Unauthorized access may be a crime under the Cybercrime Prevention Act of 2012 (RA 10175). Staff must handle customer data only as needed for their work and as the Privacy Policy describes. We may suspend access at any time.
      </P>
    ),
  },
  {
    id: "use",
    title: "Acceptable use",
    body: (
      <>
        <P>You agree not to:</P>
        <UL>
          <li>place false, prank or fraudulent orders;</li>
          <li>give someone else&rsquo;s details without their permission;</li>
          <li>interfere with, scrape, overload or attempt to break into the website or its systems;</li>
          <li>harass or abuse our staff and riders.</li>
        </UL>
        <P>We may refuse service or block access to anyone who breaks these rules.</P>
      </>
    ),
  },
  {
    id: "ip",
    title: "Our content",
    body: (
      <P>
        The Kae &amp; Jae Cafe name, logo, design, photos, illustrations and text belong to us or are used with permission. You may not copy or reuse them for commercial purposes without our written consent. Customer photos or reviews you send us may be shown on the site only with your permission.
      </P>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility",
    body: (
      <>
        <P>
          We work hard to keep the website accurate and available, but it is provided &ldquo;as is&rdquo;. We are not liable for interruptions, delays caused by traffic, weather, GPS or network errors, or other events beyond our reasonable control.
        </P>
        <P>
          To the extent the law allows, our liability for any order is limited to the amount you paid for that order. Nothing in these Terms removes your rights under the Consumer Act of the Philippines (RA 7394), the Internet Transactions Act of 2023 (RA 11967) or other laws that cannot be waived, or limits liability for death, personal injury caused by our negligence or fraud.
        </P>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    body: (
      <P>
        These Terms are governed by the laws of the Republic of the Philippines. We encourage you to contact us first so we can fix any problem. If it cannot be settled, the proper courts of Cabanatuan City, Nueva Ecija have jurisdiction, without affecting your right to file a complaint with the Department of Trade and Industry (DTI) or another agency.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <>
        <P>We may update these Terms. The date at the top shows the latest version, and continuing to use the website after a change means you accept it. Orders already placed follow the Terms in force when you placed them.</P>
        <UL>
          <li>Email: <a className="font-bold underline" href="mailto:kaeandjae@gmail.com">kaeandjae@gmail.com</a></li>
          <li>Phone or text: 0966 632 8432</li>
          <li>Address: Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100</li>
        </UL>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      current="/terms"
      title="Terms and Conditions"
      intro="The plain-language rules for ordering from Kae & Jae Cafe and using this website."
      sections={sections}
    />
  );
}
