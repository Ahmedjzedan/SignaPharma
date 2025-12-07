"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="prose prose-slate prose-lg max-w-none">
          <h1>Terms of Service</h1>
          <p className="lead">
            Last updated: {new Date().getFullYear()}
          </p>
          <p>
            Welcome to SignaPharma. By accessing or using our website, you agree
            to be bound by these Terms of Service. If you do not agree to these
            terms, please do not use our services.
          </p>

          <h2>1. Educational Purpose</h2>
          <p>
            SignaPharma is an educational tool designed for pharmacy students.
            The content provided is for study purposes only and should not be
            used as a substitute for professional medical advice, diagnosis, or
            treatment. Always consult with a qualified healthcare provider for
            clinical decision-making.
          </p>

          <h2>2. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All content, features, and functionality of SignaPharma, including
            but not limited to text, graphics, logos, and software, are the
            exclusive property of SignaPharma and are protected by copyright,
            trademark, and other intellectual property laws.
          </p>

          <h2>4. Prohibited Conduct</h2>
          <p>
            You agree not to use SignaPharma for any unlawful purpose or in any
            way that could damage, disable, overburden, or impair our servers or
            networks. You also agree not to attempt to gain unauthorized access
            to any part of our services.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall SignaPharma be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out
            of or related to your use of our services.
          </p>

          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time.
            We will notify you of any material changes by posting the new Terms
            on this page.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
