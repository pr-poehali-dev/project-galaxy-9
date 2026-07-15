import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { PartnersSection } from "@/components/PartnersSection"
import { ChartSection } from "@/components/ChartSection"
import { NowPlayingBar } from "@/components/NowPlayingBar"
import { RadioPlayerProvider } from "@/contexts/RadioPlayerContext"

export default function Index() {
  return (
    <RadioPlayerProvider>
      <main className="min-h-screen bg-[#0a0a0a] pb-20">
        <Header />
        <HeroSection />
        <ChartSection />
        <PartnersSection />
        <footer id="contacts" className="py-8 text-center text-sm text-gray-400">
          Wave FM • Твоя волна звучит{" "}
          <span className="font-medium text-white">24 часа в сутки.</span>
        </footer>
      </main>
      <NowPlayingBar />
    </RadioPlayerProvider>
  )
}