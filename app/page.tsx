"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ForkInRoadHero } from '@/components/features/ForkInRoadHero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ForkInRoadHero />
      </main>
      <Footer />
    </div>
  );
}

