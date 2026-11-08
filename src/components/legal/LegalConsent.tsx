import Link from "next/link";

const a = "font-bold text-kae-purple underline underline-offset-2 hover:text-kae-dark";

/**
 * Required consent checkboxes. Fields are named `agreeTerms` and `agreePrivacy`
 * (value "on") and must also be verified on the server.
 */
export default function LegalConsent({ includeRefunds = false }: { includeRefunds?: boolean }) {
  return (
    <fieldset className="flex w-full max-w-sm flex-col gap-2 text-left text-sm">
      <legend className="sr-only">Legal agreements</legend>
      <label className="flex cursor-pointer items-start gap-2">
        <input required type="checkbox" name="agreeTerms" className="mt-0.5 h-4 w-4 shrink-0 accent-kae-purple" />
        <span>
          I have read and agree to the{" "}
          <Link href="/terms" target="_blank" className={a}>Terms and Conditions</Link>
          {includeRefunds && (
            <>
              {" "}and the{" "}
              <Link href="/refund-policy" target="_blank" className={a}>Refund, Cancellation and Delivery Policy</Link>
            </>
          )}
          .
        </span>
      </label>
      <label className="flex cursor-pointer items-start gap-2">
        <input required type="checkbox" name="agreePrivacy" className="mt-0.5 h-4 w-4 shrink-0 accent-kae-purple" />
        <span>
          I have read the{" "}
          <Link href="/privacy" target="_blank" className={a}>Privacy Policy</Link>{" "}
          and consent to the collection and use of my personal data as described, in line with the Data Privacy Act of 2012 (RA 10173).
        </span>
      </label>
    </fieldset>
  );
}
