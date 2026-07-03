import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { PartnersSection } from "@/components/PartnersSection"
import { ChartSection } from "@/components/ChartSection"

export default function Index() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <HeroSection />
      <ChartSection />
      <PartnersSection />
      <footer id="contacts" className="py-8 text-center text-sm text-gray-400">
        Wave FM 104.5 • Твоя волна звучит{" "}
        <span className="font-medium text-white">24 часа в сутки.</span>
      </footer>
    </main>
  )
}