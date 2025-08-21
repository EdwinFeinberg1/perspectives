"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="flex items-center h-16 px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Privacy Policy</h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 max-w-4xl mx-auto pb-20">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p className="mb-4 leading-relaxed">
                Welcome to Sephira. We respect your privacy and are committed to
                protecting your personal data. This privacy policy explains how
                we collect, use, and safeguard your information when you use our
                mobile application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <p className="leading-relaxed text-sm">
                    When you create an account, we collect your email address
                    and any profile information you choose to provide.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Usage Data</h3>
                  <p className="leading-relaxed text-sm">
                    We collect information about how you use our app, including
                    your interactions with different features, conversation
                    history, and preferences.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Device Information</h3>
                  <p className="leading-relaxed text-sm">
                    We may collect device-specific information such as your
                    device type, operating system, and app version for technical
                    support and optimization purposes.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>To provide and maintain our service</li>
                <li>To personalize your experience with spiritual guidance</li>
                <li>To send you prayer notifications (if enabled)</li>
                <li>
                  To improve our app&apos;s functionality and user experience
                </li>
                <li>To communicate with you about updates and support</li>
                <li>To ensure the security and integrity of our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Data Sharing and Disclosure
              </h2>
              <p className="mb-4 leading-relaxed text-sm">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and the safety of our users</li>
                <li>
                  With trusted service providers who help us operate our app
                  (under strict confidentiality agreements)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Data Security</h2>
              <p className="leading-relaxed text-sm">
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4 leading-relaxed text-sm">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>
                  Data portability (receive your data in a structured format)
                </li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Cookies and Tracking
              </h2>
              <p className="leading-relaxed text-sm">
                Our app may use cookies and similar tracking technologies to
                enhance your experience, analyze usage patterns, and provide
                personalized content. You can manage your cookie preferences
                through your device settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="leading-relaxed text-sm">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected such
                information, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Changes to This Policy
              </h2>
              <p className="leading-relaxed text-sm">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &quot;Last updated&quot; date. Continued use of
                our service after changes constitutes acceptance of the updated
                policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="leading-relaxed text-sm mb-4">
                If you have any questions about this privacy policy or our data
                practices, please contact us:
              </p>
              <div className="bg-accent/50 rounded-lg p-4 text-sm">
                <p className="mb-2">
                  <strong>Email:</strong> asksephira@gmail.com
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to respond to all
                  privacy-related inquiries within 48 hours.
                </p>
              </div>
            </section>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-xs text-muted-foreground text-center">
                This privacy policy is effective as of{" "}
                {new Date().toLocaleDateString()} and applies to all users of
                the Sephira mobile application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
