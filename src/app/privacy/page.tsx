import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { VersifyLogo } from "@/components/ui/versify-logo"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Versify</span>
            </Link>
            <div className="flex items-center gap-3">
              <VersifyLogo size={48} className="text-primary" />
              <span className="font-bold text-primary font-headline text-lg">Versify</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Account Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    When you create an account, we collect your email address, display name, and password (encrypted).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Content You Create</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We store the images you upload and the poems generated from them. This content is associated 
                    with your account for your personal library.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Usage Data</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information about how you use Versify, including features accessed, 
                    time spent, and general usage patterns.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To provide and maintain the Versify service</li>
                <li>To process your images and generate poems</li>
                <li>To save your poems in your personal library</li>
                <li>To send you notifications (if enabled)</li>
                <li>To improve our AI models and service quality</li>
                <li>To communicate with you about service updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties. 
                Your images and generated poems remain private to your account.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Service Providers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may share information with trusted service providers who help us operate Versify, 
                    such as cloud hosting and AI processing services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Legal Requirements</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may disclose information if required by law or to protect our rights and safety.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Encrypted data transmission (HTTPS)</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Export your poems and data</li>
                <li>Opt out of notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your account information and content for as long as your account is active. 
                When you delete your account, we will delete your personal information within 30 days, 
                except where required by law to retain certain information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to maintain your session and preferences. We do not use 
                tracking cookies for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Versify is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:privacy@versify.ai" className="text-primary hover:underline">
                  privacy@versify.ai
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2024 Versify. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="/terms" className="text-sm text-primary hover:underline">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-sm text-primary hover:underline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}