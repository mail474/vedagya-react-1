export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">VedAgya Refund Policy</h1>

        <p className="text-sm text-gray-600 mb-1">
          <strong>Effective Date:</strong> June 27, 2026
        </p>
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last Updated:</strong> June 27, 2026
        </p>

        <p className="text-gray-700 leading-relaxed mb-10">
          At VedAgya, we are committed to providing a reliable and transparent experience for every
          user. Since our services consist of instant digital content, AI-powered astrology reports,
          and premium features, we encourage you to read this Refund Policy carefully before making
          a purchase.
        </p>

        {/* Digital Products & Services */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Digital Products &amp; Services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            VedAgya offers digital services such as astrology reports, AI consultations, premium
            features, subscriptions, and other in-app purchases. As these services are delivered
            electronically and are often available immediately after purchase, they cannot be
            returned or exchanged.
          </p>
        </section>

        {/* When a Refund May Be Granted */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">When a Refund May Be Granted</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Refunds are only considered in cases where a payment has been successfully initiated but
            the purchased service has not been delivered due to a payment-related issue.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">You may be eligible for a refund if:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>
              Your payment remains in a <strong>Pending</strong> or <strong>Processing</strong>{' '}
              state and the purchased service is not activated.
            </li>
            <li>
              The payment amount has been deducted from your account, but the purchase is{' '}
              <strong>not reflected</strong> in your VedAgya account after the standard processing
              time.
            </li>
            <li>
              You have been charged more than once for the same purchase due to a verified technical
              or payment gateway error.
            </li>
          </ul>
        </section>

        {/* Situations Where Refunds Are Not Available */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Situations Where Refunds Are Not Available
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            As our products are digital and instantly accessible, refunds cannot be provided in the
            following situations:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>
              The purchased report, subscription, or premium feature has already been successfully
              delivered or activated.
            </li>
            <li>
              You are dissatisfied with the content, interpretation, or outcome of an astrology
              report or AI-generated response.
            </li>
            <li>
              Incorrect birth details or other inaccurate information were entered during the
              purchase.
            </li>
            <li>The purchase was made accidentally or the wrong service was selected.</li>
            <li>You decide not to use the purchased service after it has been delivered.</li>
            <li>
              Delays caused by your bank, card issuer, UPI provider, or payment gateway where the
              transaction is ultimately completed successfully.
            </li>
          </ul>
        </section>

        {/* Payment Verification */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Payment Verification</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If your payment has been deducted but your purchase is not visible in the app, please
            wait for up to <strong>24 hours</strong>. In most cases, payment synchronization is
            completed automatically during this period.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            If the issue remains unresolved after 24 hours, please contact our support team with:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3">
            <li>Your registered email address or mobile number</li>
            <li>Transaction ID / UTR / Payment Reference Number</li>
            <li>Payment receipt or screenshot</li>
            <li>Date and approximate time of the transaction</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Our team will investigate the transaction and provide an update as quickly as possible.
          </p>
        </section>

        {/* Refund Processing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Processing</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Once your request has been verified and approved:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>The refund will be initiated to your original payment method.</li>
            <li>
              Processing typically takes <strong>5&#8211;10 business days</strong>, depending on
              your bank or payment provider.
            </li>
            <li>
              VedAgya is not responsible for additional delays caused by financial institutions or
              payment gateways after the refund has been initiated.
            </li>
          </ul>
        </section>

        {/* Purchases Through Google Play or Apple App Store */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Purchases Through Google Play or Apple App Store
          </h2>
          <p className="text-gray-700 leading-relaxed">
            For purchases made through the Google Play Store or Apple App Store, refunds are subject
            to the policies of the respective platform. Where applicable, users may be required to
            submit their refund request directly through the store from which the purchase was made.
          </p>
        </section>

        {/* Need Help? */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you&apos;re experiencing a payment issue or have questions about this Refund Policy,
            we&apos;re here to help.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>VedAgya Support</strong>
            <br />
            <strong>Email:</strong>{' '}
            <a
              href="mailto:help@vedagya.in"
              className="text-blue-600 underline hover:text-blue-800"
            >
              help@vedagya.in
            </a>
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Please include your payment details when contacting us so we can resolve your request as
            quickly as possible.
          </p>
        </section>

        {/* Our Commitment */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Commitment</h2>
          <p className="text-gray-700 leading-relaxed">
            We believe in fair and transparent billing practices. If your payment has not been
            successfully processed or your purchase has not been delivered, we will work promptly to
            investigate the issue and, where applicable, process a refund in accordance with this
            policy.
          </p>
        </section>
      </div>
    </main>
  )
}
