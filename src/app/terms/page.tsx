import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { VersifyLogo } from "@/components/ui/versify-logo"

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Versify ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Versify is an AI-powered poetry generation platform that creates poems based on uploaded images. 
                The service uses artificial intelligence to analyze visual content and generate creative written content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of any images you upload to Versify. By uploading content, you grant us a 
                limited license to process your images for the purpose of generating poems.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You are responsible for ensuring you have the right to upload any images</li>
                <li>Generated poems are considered your creative work</li>
                <li>We do not claim ownership of your generated content</li>
                <li>You may delete your content at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use Versify for any unlawful purpose or to solicit others to perform unlawful acts. 
                Prohibited content includes but is not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Copyrighted material without permission</li>
                <li>Harmful, threatening, or harassing content</li>
                <li>Content that violates privacy rights</li>
                <li>Spam or automated content generation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Privacy and Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Versify is provided "as is" without any representations or warranties. We shall not be liable 
                for any damages arising from the use of this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting to the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:support@versify.ai" className="text-primary hover:underline">
                  support@versify.ai
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
                <Link href="/privacy" className="text-sm text-primary hover:underline">
                  Privacy Policy
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