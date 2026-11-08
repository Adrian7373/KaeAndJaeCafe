import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { P, UL, type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund, Cancellation and Delivery Policy · Kae & Jae Cafe",
  description: "How cancellations, refunds, replacements and delivery work at Kae & Jae Cafe.",
};

const sections: LegalSection[] = [
  {
    id: "delivery",
    title: "Delivery",
    body: (
      <UL>
        <li>We deliver within the radius shown at checkout. If your pin is outside it, the order cannot be placed for delivery, but you can choose pickup.</li>
        <li>The delivery fee is based on distance and is shown before you place your order.</li>
        <li>Delivery times are estimates. Traffic, weather and kitchen volume can cause delays. We will tell you if your order will be late by a significant amount.</li>
        <li>Make sure your address, pin and mobile number are correct. If our rider cannot reach you after reasonable attempts, or no one receives the order, we may cancel it. Food that has already been prepared and delivered or attempted cannot be refunded in that case.</li>
      </UL>
    ),
  },
  {
    id: "pickup",
    title: "Pickup",
    body: (
      <P>
        Pick up at Zone 3, Camp Tinio during your chosen time slot, within our opening hours (Monday to Saturday, 10:00 AM to 6:00 PM). Food left uncollected for too long loses quality and may be unsafe, so we may discard it after 30 minutes past your pickup time.
      </P>
    ),
  },
  {
    id: "cancel",
    title: "Cancelling an order",
    body: (
      <>
        <P>
          Orders are cancelled by our staff. To cancel, call or text 0966 632 8432 or message us on Facebook Messenger as soon as possible, with your order number from the tracking page.
        </P>
        <UL>
          <li>Before we start cooking: free cancellation.</li>
          <li>After cooking has started or the order is out for delivery: we can no longer cancel because the food is made to order.</li>
          <li>If we cancel your order (item sold out, we are closed, outside the delivery area, unreachable), you pay nothing, and anything already paid online is refunded in full.</li>
        </UL>
      </>
    ),
  },
  {
    id: "problems",
    title: "Wrong, missing, damaged or unsafe food",
    body: (
      <>
        <P>
          If your order is wrong, incomplete, spilled, not fresh or unsafe to eat, tell us within 2 hours of receiving it, with your order number and a photo if possible. We will, at your choice where practical:
        </P>
        <UL>
          <li>replace the affected item at no charge; or</li>
          <li>refund the price of the affected item (and the delivery fee if the whole order is affected).</li>
        </UL>
        <P>If you suspect food-borne illness, stop eating, keep the food and packaging, get medical help if needed, and tell us immediately so we can investigate.</P>
      </>
    ),
  },
  {
    id: "no-refund",
    title: "What we cannot refund",
    body: (
      <UL>
        <li>Change of mind after the food has been prepared.</li>
        <li>Orders delivered correctly where nobody received them.</li>
        <li>Taste preferences, such as a dish being spicier than expected, when it was described as spicy. Please ask us beforehand about spice level.</li>
      </UL>
    ),
  },
  {
    id: "how",
    title: "How refunds are paid",
    body: (
      <UL>
        <li><strong>Cash orders:</strong> refunded in cash or by GCash transfer, as you prefer.</li>
        <li><strong>Online payments (when available):</strong> returned to the same account through PayMongo. The time to show up depends on your payment provider, usually within several business days.</li>
      </UL>
    ),
  },
  {
    id: "rights",
    title: "Your rights under the law",
    body: (
      <>
        <P>
          This policy does not take away any rights you have under the Consumer Act of the Philippines (RA 7394), the Internet Transactions Act of 2023 (RA 11967) or other laws. If we cannot resolve your concern, you can contact the Department of Trade and Industry (DTI) Consumer Care hotline at 1-384 or visit <a className="font-bold underline" href="https://www.dti.gov.ph" target="_blank" rel="noreferrer">dti.gov.ph</a>.
        </P>
        <P>See also our <Link className="font-bold underline" href="/terms">Terms and Conditions</Link>.</P>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <UL>
        <li>Phone or text: 0966 632 8432</li>
        <li>Email: <a className="font-bold underline" href="mailto:kaeandjae@gmail.com">kaeandjae@gmail.com</a></li>
        <li>Facebook Messenger: Kae and Jae Cafe</li>
      </UL>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      current="/refund-policy"
      title="Refund, Cancellation and Delivery Policy"
      intro="What happens if you need to cancel, if something goes wrong, or if your order is late."
      sections={sections}
    />
  );
}
