"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="prose prose-slate prose-lg max-w-none">
          <h1>Cookie Policy</h1>
          <p className="lead">
            Last updated: {new Date().getFullYear()}
          </p>
          <p>
            This Cookie Policy explains how SignaPharma uses cookies and similar
            technologies to recognize you when you visit our website. It
            explains what these technologies are and why we use them, as well as
            your rights to control our use of them.
          </p>

          <h2>1. What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners in order to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>

          <h2>2. Why do we use cookies?</h2>
          <p>
            We use cookies for several reasons. Some cookies are required for
            technical reasons in order for our website to operate, and we refer
            to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies. Other
            cookies also enable us to track and target the interests of our
            users to enhance the experience on our Online Properties.
          </p>

          <h2>3. Types of Cookies We Use</h2>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> These cookies are strictly
              necessary to provide you with services available through our
              website and to use some of its features, such as access to secure
              areas.
            </li>
            <li>
              <strong>Performance and Functionality Cookies:</strong> These
              cookies are used to enhance the performance and functionality of
              our website but are non-essential to their use. However, without
              these cookies, certain functionality (like videos) may become
              unavailable.
            </li>
            <li>
              <strong>Analytics and Customization Cookies:</strong> These
              cookies collect information that is used either in aggregate form
              to help us understand how our website is being used or how
              effective our marketing campaigns are, or to help us customize our
              website for you.
            </li>
          </ul>

          <h2>4. How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies.
            You can exercise your cookie rights by setting your browser controls
            to accept or refuse cookies. If you choose to reject cookies, you
            may still use our website though your access to some functionality
            and areas of our website may be restricted.
          </p>

          <h2>5. Updates to this Policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to
            reflect, for example, changes to the cookies we use or for other
            operational, legal, or regulatory reasons. Please therefore re-visit
            this Cookie Policy regularly to stay informed about our use of
            cookies and related technologies.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or other
            technologies, please contact us.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
