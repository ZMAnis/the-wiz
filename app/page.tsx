import { About } from "@/components/sections/about";
import { Audience } from "@/components/sections/audience";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Inside } from "@/components/sections/inside";
import { Order } from "@/components/sections/order";
import { Series } from "@/components/sections/series";
import { Testimonials } from "@/components/sections/testimonials";
import { Why } from "@/components/sections/why";
import { faqs } from "@/lib/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <Why />
      <Inside />
      <Audience />
      <Testimonials />
      <About />
      <Order />
      <Series />
      <Faq />
    </>
  );
}
