import { useEffect, useState } from "react"
import Icon from "@/components/ui/icon"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const PLAYLIST_API = "https://functions.poehali.dev/6cc1d340-a31e-4b50-ae1e-5b33f37cae78"

const tracks = [
  { pos: 1, title: "Шадэ", artist: "By Индия, Xcho, MOT", trend: "up" },
  { pos: 2, title: "KARMA", artist: "ЕГОР КРИД, Artik & Asti", trend: "up" },
  { pos: 3, title: "GAZ", artist: "ZIVERT", trend: "same" },
  { pos: 4, title: "Давай не ждать", artist: "Мари Краймбрери", trend: "up" },
  { pos: 5, title: "Хэппи Энд", artist: "Сергей Лазарев, Полина Гагарина", trend: "down" },
  { pos: 6, title: "Проще", artist: "Ёлка", trend: "up" },
  { pos: 7, title: "Ртуть", artist: "Ваня Дмитриенко", trend: "same" },
  { pos: 8, title: "Феникс", artist: "BEARWOLF", trend: "down" },
  { pos: 9, title: "Кассеты", artist: "LYRIQ", trend: "up" },
  { pos: 10, title: "Намёк на нас", artist: "MOT", trend: "same" },
  { pos: 11, title: "Малахит", artist: "Винтаж", trend: "up" },
  { pos: 12, title: "Leto", artist: "Jony, Feduk", trend: "down" },
  { pos: 13, title: "Эпилог", artist: "ANNA ASTI, Дима Билан", trend: "up" },
  { pos: 14, title: "Довольна", artist: "Nemiga", trend: "same" },
  { pos: 15, title: "Тону", artist: "HOLLYFLAME", trend: "down" },
]

const trendConfig: Record<string, { icon: string; color: string }> = {
  up: { icon: "TrendingUp", color: "text-emerald-400" },
  down: { icon: "TrendingDown", color: "text-red-400" },
  same: { icon: "Minus", color: "text-gray-500" },
}

interface PlaylistItem {
  time: string
  artist: string
  title: string
  cover: string
}

export function ChartSection() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [playingPos, setPlayingPos] = useState<number | null>(null)
  const [previewLoadingPos, setPreviewLoadingPos] = useState<number | null>(null)
  const [notFoundPos, setNotFoundPos] = useState<number | null>(null)
  const audioRef = useState(() => new Audio())[0]

  useEffect(() => {
    const onEnd = () => setPlayingPos(null)
    audioRef.addEventListener("ended", onEnd)
    return () => audioRef.removeEventListener("ended", onEnd)
  }, [audioRef])

  const playTrack = async (pos: number, title: string, artist: string) => {
    if (playingPos === pos) {
      audioRef.pause()
      setPlayingPos(null)
      return
    }

    audioRef.pause()
    setPlayingPos(null)
    setNotFoundPos(null)
    setPreviewLoadingPos(pos)

    try {
      const mainArtist = artist.split(",")[0].trim()
      const query = encodeURIComponent(`${mainArtist} ${title}`)
      const res = await fetch(
        `https://itunes.apple.com/search?term=${query}&media=music&limit=1`
      )
      const data = await res.json()
      const previewUrl = data.results?.[0]?.previewUrl

      if (previewUrl) {
        audioRef.src = previewUrl
        await audioRef.play()
        setPlayingPos(pos)
      } else {
        setNotFoundPos(pos)
        setTimeout(() => setNotFoundPos(null), 2500)
      }
    } catch {
      setPlayingPos(null)
      setNotFoundPos(pos)
      setTimeout(() => setNotFoundPos(null), 2500)
    } finally {
      setPreviewLoadingPos(null)
    }
  }

  const loadPlaylist = () => {
    setLoading(true)
    setError(false)
    fetch(PLAYLIST_API)
      .then((res) => res.json())
      .then((data) => setPlaylist(data.playlist?.slice().reverse() ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadPlaylist()
    const interval = setInterval(loadPlaylist, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="chart" className="px-4 md:px-8 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
            ГОРЯЧАЯ 15
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">Музыка Wave FM</h2>
          <p className="mt-2 text-gray-400">Чарт недели и треки, звучавшие в нашем эфире</p>
        </div>

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mx-auto mb-6 flex w-fit bg-[#1a1a1a]">
            <TabsTrigger value="chart" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Чарт
            </TabsTrigger>
            <TabsTrigger value="playlist" className="data-[state=active]:bg-violet-600 data-[state=active]:text-white">
              Плейлист эфира
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md divide-y divide-white/5">
              {tracks.map((track) => {
                const trend = trendConfig[track.trend]
                return (
                  <div
                    key={track.pos}
                    className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-violet-500/10"
                  >
                    <span className="w-8 text-center text-lg font-bold text-violet-400">{track.pos}</span>
                    <button
                      onClick={() => playTrack(track.pos, track.title, track.artist)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-violet-300 transition-colors hover:bg-violet-600 hover:text-white"
                    >
                      {previewLoadingPos === track.pos ? (
                        <Icon name="Loader2" size={14} className="animate-spin" />
                      ) : playingPos === track.pos ? (
                        <Icon name="Pause" size={14} className="fill-current" />
                      ) : (
                        <Icon name="Play" size={14} className="fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{track.title}</p>
                      <p className="truncate text-sm text-gray-400">
                        {notFoundPos === track.pos ? "Превью недоступно" : track.artist}
                      </p>
                    </div>
                    <Icon name={trend.icon} size={18} className={trend.color} />
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="playlist">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              {loading && playlist.length === 0 && (
                <div className="flex items-center justify-center gap-2 px-5 py-10 text-gray-400">
                  <Icon name="Loader2" size={18} className="animate-spin" /> Загружаем историю эфира...
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center gap-2 px-5 py-10 text-gray-400">
                  <Icon name="AlertCircle" size={20} className="text-red-400" />
                  Не удалось загрузить плейлист. Попробуйте позже.
                </div>
              )}

              {!loading && !error && playlist.length === 0 && (
                <div className="px-5 py-10 text-center text-gray-400">Пока нет данных об эфире</div>
              )}

              <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
                {playlist.map((item, idx) => (
                  <div key={`${item.time}-${idx}`} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-violet-600/20">
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <Icon name="Music2" size={18} className="text-violet-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{item.title || "—"}</p>
                      <p className="truncate text-sm text-gray-400">{item.artist || "Wave FM"}</p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}