import { useEffect, useState } from "react"
import Icon from "@/components/ui/icon"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const PLAYLIST_API = "https://functions.poehali.dev/6cc1d340-a31e-4b50-ae1e-5b33f37cae78"

const tracks = [
  { pos: 1, title: "Давай не ждать", artist: "Мари Краймбрери", trend: "up" },
  { pos: 2, title: "Хэппи Энд", artist: "Сергей Лазарев, Полина Гагарина", trend: "up" },
  { pos: 3, title: "На малиновой луне", artist: "Моя Мишель", trend: "up" },
  { pos: 4, title: "Невероятно", artist: "Zvonkiy", trend: "up" },
  { pos: 5, title: "Шадэ", artist: "By Индия, Xcho, MOT", trend: "down" },
  { pos: 6, title: "8901", artist: "SERYABKINA, Dimma Urih", trend: "up", isNew: true },
  { pos: 7, title: "Ртуть", artist: "Ваня Дмитриенко", trend: "same" },
  { pos: 8, title: "Leto", artist: "Jony, Feduk", trend: "up" },
  { pos: 9, title: "Малахит", artist: "Винтаж", trend: "up" },
  { pos: 10, title: "KARMA", artist: "Егор Крид, Artik & Asti", trend: "down" },
  { pos: 11, title: "Заново", artist: "MARY GU", trend: "up" },
  { pos: 12, title: "Тону", artist: "HOLLYFLAME", trend: "up" },
  { pos: 13, title: "Намёк на нас", artist: "MOT", trend: "down" },
  { pos: 14, title: "Кассеты", artist: "LYRIQ", trend: "down" },
  { pos: 15, title: "Эпилог", artist: "ANNA ASTI, Дима Билан", trend: "down" },
]

const trendConfig: Record<string, { icon: string; color: string; className?: string }> = {
  up: { icon: "Triangle", color: "text-emerald-400", className: "fill-emerald-400" },
  down: { icon: "Triangle", color: "text-red-400", className: "fill-red-400 rotate-180" },
  same: { icon: "Minus", color: "text-gray-500" },
}

const decodeHtml = (text: string) => {
  let result = text
  let previous = ""
  while (previous !== result) {
    previous = result
    result = result
      .replace(/&#0?39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
  }
  result = result
    .replace(/[[(]?\s*drivemusic\.me\s*[\])]?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
  return result
}

interface PlaylistItem {
  date?: string
  time: string
  artist: string
  title: string
  cover: string
}

const formatPlaylistDate = (dateStr?: string) => {
  if (!dateStr) return ""
  const today = new Date().toISOString().slice(0, 10)
  if (dateStr === today) return ""
  const [, month, day] = dateStr.split("-")
  return `${day}.${month} · `
}

export function ChartSection() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [playingPos, setPlayingPos] = useState<number | null>(null)
  const [previewLoadingPos, setPreviewLoadingPos] = useState<number | null>(null)
  const [notFoundPos, setNotFoundPos] = useState<number | null>(null)
  const [covers, setCovers] = useState<Record<number, string>>({})
  const audioRef = useState(() => new Audio())[0]

  useEffect(() => {
    let cancelled = false
    tracks.forEach(async (track) => {
      try {
        const mainArtist = track.artist.split(",")[0].trim()
        const query = encodeURIComponent(`${mainArtist} ${track.title}`)
        const res = await fetch(
          `https://itunes.apple.com/search?term=${query}&media=music&limit=1`
        )
        const data = await res.json()
        const artwork = data.results?.[0]?.artworkUrl100?.replace("100x100", "300x300")
        if (artwork && !cancelled) {
          setCovers((prev) => ({ ...prev, [track.pos]: artwork }))
        }
      } catch {
        // ignore
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

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
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-violet-600/20">
                      {covers[track.pos] ? (
                        <img
                          src={covers[track.pos]}
                          alt={track.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icon name="Music2" size={14} className="text-violet-300" />
                        </div>
                      )}
                      <button
                        onClick={() => playTrack(track.pos, track.title, track.artist)}
                        className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity hover:opacity-100 ${
                          playingPos === track.pos || previewLoadingPos === track.pos
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        {previewLoadingPos === track.pos ? (
                          <Icon name="Loader2" size={14} className="animate-spin" />
                        ) : playingPos === track.pos ? (
                          <Icon name="Pause" size={14} className="fill-current" />
                        ) : (
                          <Icon name="Play" size={14} className="fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{track.title}</p>
                      <p className="truncate text-sm text-gray-400">
                        {notFoundPos === track.pos ? "Превью недоступно" : track.artist}
                      </p>
                    </div>
                    {track.isNew ? (
                      <span className="shrink-0 rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    ) : (
                      <Icon
                        name={trend.icon}
                        size={14}
                        className={`${trend.color} ${trend.className ?? ""}`}
                      />
                    )}
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
                      <p className="truncate font-medium text-white">{item.title ? decodeHtml(item.title) : "—"}</p>
                      <p className="truncate text-sm text-gray-400">{item.artist ? decodeHtml(item.artist) : "Wave FM"}</p>
                    </div>
                    <span className="shrink-0 text-base font-medium text-gray-400">
                      {formatPlaylistDate(item.date)}
                      {item.time?.slice(0, 5)}
                    </span>
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