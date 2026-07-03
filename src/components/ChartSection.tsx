import Icon from "@/components/ui/icon"

const tracks = [
  { pos: 1, title: "Midnight Waves", artist: "Aurora Skye", trend: "up" },
  { pos: 2, title: "Neon Heartbeat", artist: "The Lumen", trend: "up" },
  { pos: 3, title: "Electric Dreams", artist: "Kova", trend: "same" },
  { pos: 4, title: "Gravity", artist: "Nova Reign", trend: "up" },
  { pos: 5, title: "Silver Lines", artist: "Marlow", trend: "down" },
  { pos: 6, title: "Afterglow", artist: "Selene", trend: "up" },
  { pos: 7, title: "Lost in Sound", artist: "Echo Park", trend: "same" },
  { pos: 8, title: "Golden Hour", artist: "Riva & Co", trend: "down" },
  { pos: 9, title: "Paper Planes", artist: "Halcyon", trend: "up" },
  { pos: 10, title: "Deep End", artist: "Tidal", trend: "same" },
  { pos: 11, title: "Chasing Light", artist: "Mira Vale", trend: "up" },
  { pos: 12, title: "Runaway", artist: "The Foxes", trend: "down" },
  { pos: 13, title: "Velvet Sky", artist: "Solene", trend: "up" },
  { pos: 14, title: "Wildfire", artist: "Atlas Moon", trend: "same" },
  { pos: 15, title: "Horizon", artist: "Cassia", trend: "down" },
]

const trendConfig: Record<string, { icon: string; color: string }> = {
  up: { icon: "TrendingUp", color: "text-emerald-400" },
  down: { icon: "TrendingDown", color: "text-red-400" },
  same: { icon: "Minus", color: "text-gray-500" },
}

export function ChartSection() {
  return (
    <section id="chart" className="px-4 md:px-8 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
            ГОРЯЧАЯ 15
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">Чарт недели Wave FM</h2>
          <p className="mt-2 text-gray-400">Самые ротируемые треки нашего эфира прямо сейчас</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md divide-y divide-white/5">
          {tracks.map((track) => {
            const trend = trendConfig[track.trend]
            return (
              <div
                key={track.pos}
                className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-violet-500/10"
              >
                <span className="w-8 text-center text-lg font-bold text-violet-400">{track.pos}</span>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-violet-300 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                  <Icon name="Play" size={14} className="fill-current ml-0.5" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{track.title}</p>
                  <p className="truncate text-sm text-gray-400">{track.artist}</p>
                </div>
                <Icon name={trend.icon} size={18} className={trend.color} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
