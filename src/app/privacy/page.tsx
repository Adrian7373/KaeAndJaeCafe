import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { P, UL, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Kae & Jae Cafe",
  description: "How Kae & Jae Cafe collects, uses and protects your personal data under the Data Privacy Act of 2012 (RA 10173).",
};

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are and what this covers",
    body: (
      <>
        <P>
          Kae &amp; Jae Cafe (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a mobile kitchen at Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100. We run this website so you can browse our menu, order for delivery or pickup, and track your order.
        </P>
        <P>
          We are the personal information controller for the data described here. This policy follows the Data Privacy Act of 2012 (Republic Act No. 10173), its Implementing Rules and Regulations, and the issuances of the National Privacy Commission (NPC).
        </P>
        <P>By using this website, placing an order or logging in as staff, you confirm that you have read this policy.</P>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <P>We collect only what we need to take and deliver your order.</P>
        <UL>
          <li><strong>When you place an order:</strong> first and last name, mobile number, order type (delivery or pickup), pickup time, delivery address, the map pin and GPS coordinates of your delivery location, notes you add, the items ordered, payment method and order status.</li>
          <li><strong>When you send us a message:</strong> your name, email address and the message.</li>
          <li><strong>When staff log in:</strong> the role chosen (Admin, Cashier or Rider) and a password. Passwords are checked by our authentication provider and are not visible to us in readable form.</li>
          <li><strong>Technical data:</strong> basic device and browser information and IP address, which our hosting and database providers record for security and reliability.</li>
          <li><strong>On your device:</strong> a few small items stored in your browser. See our <Link className="font-bold underline" href="/cookies">Cookies and Local Storage</Link> page.</li>
        </UL>
        <P>We do not knowingly collect sensitive personal information as defined by the Data Privacy Act (such as government IDs, health or financial account details). Please do not put such information in your order notes or messages. We never see or store your card or e-wallet credentials; online payments are handled by our payment provider.</P>
      </>
    ),
  },
  {
    id: "why",
    title: "Why we use your data",
    body: (
      <>
        <UL>
          <li>To receive, prepare, deliver or hand over your order, and contact you about it (performance of a contract with you).</li>
          <li>To check that your delivery address is inside our delivery area and to compute the delivery fee.</li>
          <li>To process payments and keep sales records (contract and legal obligations, including tax and accounting rules).</li>
          <li>To answer your questions and complaints.</li>
          <li>To keep the website and our staff portal secure and prevent fraud or abuse (legitimate interests).</li>
          <li>To improve our menu and service using order totals and trends, without identifying you where possible.</li>
        </UL>
        <P>Where we rely on your consent, such as when you tick the box confirming you agree to this policy, you can withdraw it at any time (see &ldquo;Your rights&rdquo;). We do not use your data for advertising and we do not sell it.</P>
      </>
    ),
  },
  {
    id: "location",
    title: "Location data",
    body: (
      <>
        <P>
          Checkout can ask your browser for your current location so we can place the delivery pin and confirm you are within our delivery radius. This happens only if you allow it in your browser. You can instead drop the pin on the map or type your address yourself.
        </P>
        <P>
          To turn a map pin into a street address, your pin coordinates are sent to the OpenStreetMap Nominatim service. Map images load from OpenStreetMap servers, which can see your IP address.
        </P>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <P>We share personal data only with those who help us serve you:</P>
        <UL>
          <li><strong>Our riders and staff</strong> see your name, mobile number, address and order details so they can prepare and deliver your order.</li>
          <li><strong>Supabase</strong>, our database, authentication and file storage provider, hosts the data we collect.</li>
          <li><strong>PayMongo</strong>, our payment processor, receives the order amount and details needed to complete online payments (such as GCash, once available).</li>
          <li><strong>OpenStreetMap</strong> services for maps and address lookup, as described above.</li>
          <li><strong>Government agencies, courts or law enforcement</strong> where the law requires or a valid order compels us.</li>
        </UL>
        <P>These providers may only use your data to provide their services to us. We require appropriate safeguards from them as the Data Privacy Act requires.</P>
      </>
    ),
  },
  {
    id: "transfer",
    title: "Storage and transfers outside the Philippines",
    body: (
      <P>
        Our providers run servers in other countries, so your data may be stored or processed outside the Philippines. When this happens we rely on providers that apply security and contractual protections comparable to those required by Philippine law.
      </P>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <UL>
          <li>Order records (including name, contact number and address): up to 3 years from the order date for accounting, tax and dispute purposes, then deleted or anonymized.</li>
          <li>Messages and inquiries: up to 1 year after we resolve them.</li>
          <li>Staff login records: while the person works with us, then removed.</li>
        </UL>
        <P>We may keep data longer where the law requires or where it is needed to handle a claim or complaint.</P>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <P>
        We use access controls by staff role, encrypted connections (HTTPS), and reputable hosting and database providers. Only staff who need your data to do their job can view it. No system is perfectly secure. If a breach puts your rights at risk, we will notify you and the NPC within the time the Data Privacy Act requires (72 hours from knowledge of the breach).
      </P>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <P>Under Section 16 of the Data Privacy Act you have the right to:</P>
        <UL>
          <li>be informed about how your data is processed;</li>
          <li>access a copy of the personal data we hold about you;</li>
          <li>object to processing, or withdraw your consent;</li>
          <li>correct inaccurate or outdated data;</li>
          <li>request erasure or blocking of data that is unlawfully held or no longer needed;</li>
          <li>data portability, meaning to obtain your data in a commonly used electronic format;</li>
          <li>claim compensation for damages caused by inaccurate, unlawfully obtained or unauthorized use of your data.</li>
        </UL>
        <P>To use any of these rights, contact us using the details below. We may ask you to confirm your identity first and will respond within a reasonable time. Some data (such as sales records) must be kept by law even after an erasure request.</P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        This website is meant for people aged 18 and above. A minor may order only with a parent or guardian&rsquo;s permission and supervision. If you believe a child gave us data without that permission, contact us and we will delete it.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        We may update this policy. The date at the top shows the latest version. If a change is significant we will tell you on the website before it applies.
      </P>
    ),
  },
  {
    id: "contact",
    title: "Contact us and complain",
    body: (
      <>
        <P>
          Our Data Protection Officer (the cafe owner) handles privacy questions and requests:
        </P>
        <UL>
          <li>Email: <a className="font-bold underline" href="mailto:kaeandjae@gmail.com">kaeandjae@gmail.com</a></li>
          <li>Phone or text: 0966 632 8432</li>
          <li>Address: Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100</li>
        </UL>
        <P>
          If you think we did not handle your data properly, you may also file a complaint with the National Privacy Commission at <a className="font-bold underline" href="https://privacy.gov.ph" target="_blank" rel="noreferrer">privacy.gov.ph</a>.
        </P>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      current="/privacy"
      title="Privacy Policy"
      intro="We only collect what we need to cook and deliver your order. This page explains what that is, who sees it and what control you have."
      sections={sections}
    />
  );
}
