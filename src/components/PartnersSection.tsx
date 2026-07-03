import Icon from "@/components/ui/icon"

const partners = [
  { name: "Melomania", icon: "Sparkles", url: "#" },
  { name: "SoundLab", icon: "AudioLines", url: "#" },
  { name: "BeatHouse", icon: "Disc3", url: "#" },
  { name: "LiveStage", icon: "Mic2", url: "#" },
  { name: "VinylClub", icon: "Disc", url: "#" },
  { name: "TuneUp", icon: "Music4", url: "#" },
  { name: "Echo Media", icon: "Radio", url: "#" },
]

export function PartnersSection() {
  return (
    <section id="partners" className="px-4 py-8">
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-gray-500">Наши партнёры</p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 transition-colors hover:text-violet-400"
          >
            <Icon name={partner.icon} size={16} />
            <span className="text-sm font-medium">{partner.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}