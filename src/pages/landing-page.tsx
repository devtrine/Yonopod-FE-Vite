import { useState, useEffect } from "react";
import { Cloud7Navbar } from "@/components/landing/cloud7-navbar";
import { Cloud7Hero } from "@/components/landing/cloud7-hero";
import { Cloud7Features } from "@/components/landing/cloud7-features";
import { Cloud7Cases } from "@/components/landing/cloud7-cases";
import { Cloud7Calculator } from "@/components/landing/cloud7-calculator";
import { Cloud7CTA } from "@/components/landing/cloud7-cta";
import { Cloud7Footer } from "@/components/landing/cloud7-footer";
import { Cloud7AboutModal } from "@/components/landing/cloud7-about-modal";

export function LandingPage() {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  useEffect(() => {
    document.title = "YONOPOD — Always Flexible Cloud Storage | PT. Alenerlverse Nexus Technology";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f6] text-[#0f172a] antialiased selection:bg-[#1c3fc4] selection:text-white" id="main">
      {/* 1. Navbar */}
      <Cloud7Navbar onOpenAboutModal={() => setAboutModalOpen(true)} />

      {/* Main Content following exact Cloud 7 Flow */}
      <main className="flex-1">
        {/* 2. Hero & Trust/Logo Strip & Floating CTA/Quote Card */}
        <Cloud7Hero onOpenAboutModal={() => setAboutModalOpen(true)} />

        {/* 3. Feature Overview (2x2 Grid with Technical Visuals) */}
        <Cloud7Features />

        {/* 4. Case Studies / Use Cases Slider */}
        <Cloud7Cases />

        {/* 5. Pricing / Pay-as-you-use Calculator & Comparison Chart */}
        <Cloud7Calculator />

        {/* 6. Final CTA */}
        <Cloud7CTA />
      </main>

      {/* 7. Footer */}
      <Cloud7Footer onOpenAboutModal={() => setAboutModalOpen(true)} />

      {/* 8. About & Contact Modal */}
      <Cloud7AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </div>
  );
}

export default LandingPage;
