"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none dark:prose-headings:text-white dark:prose-p:text-muted-foreground dark:prose-strong:text-white dark:prose-li:text-muted-foreground">
          <h1 className="text-foreground">Privacy Policy</h1>
          <p className="lead">
            Last updated: {new Date().getFullYear()}
          </p>
          <p>
            At SignaPharma, we take your privacy seriously. We understand that
            you&apos;re here to learn pharmacology, not to have your data sold. This
            Privacy Policy explains how we collect, use, and protect your
            information.
          </p>

          <h2 className="text-foreground">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, update your profile, or save study materials.
            This may include:
          </p>
          <ul>
            <li>Name and contact information</li>
            <li>Educational background (e.g., pharmacy school year)</li>
            <li>Study progress and quiz results</li>
          </ul>

          <h2 className="text-foreground">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Personalize your learning experience</li>
            <li>Track your progress through study modules</li>
            <li>Send you technical notices and support messages</li>
          </ul>

          <h2 className="text-foreground">3. Data Storage</h2>
          <p>
            Your study progress and preferences are stored securely. We use
            modern encryption standards to protect your data both in transit and
            at rest.
          </p>

          <h2 className="text-foreground">4. Cookies</h2>
          <p>
            We use cookies to maintain your session and preferences. You can
            control cookie settings through your browser, but disabling them may
            limit your ability to use certain features of the platform.
          </p>

          <h2 className="text-foreground">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us through our support channels.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
