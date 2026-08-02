import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"

const STREAM_URL = "https://myradio24.org/19486"
const PLAYLIST_API = "https://functions.poehali.dev/6cc1d340-a31e-4b50-ae1e-5b33f37cae78"

interface CurrentTrack {
  artist: string
  title: string
  cover: string
}

export interface PlaylistItem {
  date?: string
  time: string
  artist: string
  title: string
  cover: string
}

const FALLBACK_PLAYLIST: PlaylistItem[] = [
  { date: "2026-07-31", time: "00:47:53", artist: "Filatov & Karas/DJ Groove", title: "Счастье Есть", cover: "" },
  { date: "2026-07-31", time: "00:50:16", artist: "Асия, Zvonkiy", title: "Фонари", cover: "" },
  { date: "2026-07-31", time: "00:53:34", artist: "5Утра", title: "Чуйка", cover: "https://myradio24.org/artists/6f0c13a7a3424328.jpg" },
  { date: "2026-07-31", time: "00:55:53", artist: "Zivert", title: "В Городе Лето", cover: "https://myradio24.org/artists/76e58f8d0b62db50.jpg" },
  { date: "2026-07-31", time: "00:57:53", artist: "Alex Warren", title: "Fever dream", cover: "https://myradio24.org/artists/837cfd34d48241e5.jpg" },
  { date: "2026-07-31", time: "01:00:57", artist: "Blackpink", title: "Jump", cover: "https://myradio24.org/artists/a37b4d0b367e5cfc.jpg" },
  { date: "2026-07-31", time: "01:04:07", artist: "Дима Билан, Мари Краймбрери", title: "It's My Life", cover: "" },
  { date: "2026-07-31", time: "01:07:16", artist: "Моя Мишель", title: "На малиновой луне", cover: "https://myradio24.org/artists/bfbefb37eb776942.jpg" },
  { date: "2026-07-31", time: "01:11:25", artist: "Artik & Asti", title: "Качели", cover: "https://myradio24.org/artists/9966dec3223b9615.jpg" },
  { date: "2026-07-31", time: "01:15:25", artist: "Сергей Лазарев", title: "Танцуй", cover: "https://myradio24.org/artists/62c930b379a67f15.jpg" },
  { date: "2026-07-31", time: "01:18:52", artist: "Pizza", title: "Пятница", cover: "https://myradio24.org/artists/50ddb91a3d195e3f.jpg" },
  { date: "2026-07-31", time: "01:22:16", artist: "Градусы", title: "О Тебе Думаю", cover: "https://myradio24.org/artists/766b5184cafae1f7.jpg" },
  { date: "2026-07-31", time: "01:26:06", artist: "Jony", title: "Лечу", cover: "https://myradio24.org/artists/f2e3e1ac720e5776.jpg" },
  { date: "2026-07-31", time: "01:29:07", artist: "Клава Кока", title: "Катастрофа", cover: "https://myradio24.org/artists/8f18c9cd211e5272.jpg" },
  { date: "2026-07-31", time: "01:31:35", artist: "Братья Грим", title: "Ресницы", cover: "https://myradio24.org/artists/8251c7502125ef93.jpg" },
  { date: "2026-07-31", time: "01:34:43", artist: "2Маши", title: "Мама, я танцую", cover: "" },
  { date: "2026-07-31", time: "01:39:07", artist: "Женя Трофимов, Комната культур", title: "Осень (OST «Ландыши. Вторая весна»)", cover: "" },
  { date: "2026-07-31", time: "01:43:07", artist: "Ofenbach", title: "Miles Away", cover: "https://myradio24.org/artists/8a357b45448af413.jpg" },
  { date: "2026-07-31", time: "01:45:53", artist: "Stromae", title: "Papaoutai", cover: "https://myradio24.org/artists/e64c4e0bf6559bfc.jpg" },
  { date: "2026-07-31", time: "01:50:07", artist: "Мот, Jony", title: "Лилии", cover: "" },
  { date: "2026-07-31", time: "01:53:34", artist: "R3Hab, Sophie And The Giants", title: "All Night", cover: "" },
  { date: "2026-07-31", time: "01:55:44", artist: "Dj Smash", title: "Моя Любовь 18", cover: "" },
  { date: "2026-07-31", time: "01:57:44", artist: "Nemiga", title: "Довольна", cover: "https://myradio24.org/artists/7a03966281c25723.jpg" },
  { date: "2026-07-31", time: "02:00:48", artist: "Cream Soda, Хлеб", title: "Плачу На Техно", cover: "" },
  { date: "2026-07-31", time: "02:03:44", artist: "Jony, Feduk", title: "Leto", cover: "" },
]

interface RadioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  currentTrack: CurrentTrack | null
  playlist: PlaylistItem[]
  playlistLoading: boolean
  volume: number
  setVolume: (value: number) => void
  toggleStream: () => void
}

const RadioPlayerContext = createContext<RadioPlayerState | null>(null)

const decodeTrackText = (text: string) => {
  let result = text
  let previous = ""
  while (previous !== result) {
    previous = result
    result = result
      .replace(/&#0?39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
  }
  return result
    .replace(/[[(]?\s*drivemusic\.me\s*[\])]?/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const manualStopRef = useRef(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(() => {
    const last = FALLBACK_PLAYLIST[FALLBACK_PLAYLIST.length - 1]
    return last ? { artist: last.artist, title: last.title, cover: last.cover } : null
  })
  const [playlist, setPlaylist] = useState<PlaylistItem[]>(FALLBACK_PLAYLIST)
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [volume, setVolumeState] = useState(1)

  useEffect(() => {
    const loadData = () => {
      setPlaylistLoading(true)
      fetch(PLAYLIST_API)
        .then((res) => res.json())
        .then((data) => {
          if (data.current?.title) {
            setCurrentTrack({
              artist: decodeTrackText(data.current.artist || ""),
              title: decodeTrackText(data.current.title),
              cover: data.current.cover || "",
            })
          }
          if (Array.isArray(data.playlist)) {
            setPlaylist(data.playlist.slice().reverse())
          }
        })
        .catch(() => {})
        .finally(() => setPlaylistLoading(false))
    }

    loadData()
    const interval = setInterval(loadData, 20000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const defaultTitle = "Радио Wave FM Россия"
    if (isPlaying && currentTrack?.title) {
      const label = currentTrack.artist
        ? `${currentTrack.artist} — ${currentTrack.title}`
        : currentTrack.title
      document.title = `▶ ${label}`
    } else {
      document.title = defaultTitle
    }
    return () => {
      document.title = defaultTitle
    }
  }, [isPlaying, currentTrack])

  const setVolume = (value: number) => {
    setVolumeState(value)
    if (audioRef.current) {
      audioRef.current.volume = value
      audioRef.current.muted = value === 0
    }
  }

  const toggleStream = () => {
    if (!audioRef.current) {
      const audio = new Audio(STREAM_URL)
      audio.preload = "none"
      audio.volume = volume
      audio.muted = volume === 0
      audio.addEventListener("waiting", () => setIsLoading(true))
      audio.addEventListener("playing", () => setIsLoading(false))
      audio.addEventListener("error", () => {
        if (manualStopRef.current) return
        setIsLoading(true)
        audio.load()
        audio
          .play()
          .then(() => setIsLoading(false))
          .catch(() => setIsLoading(false))
      })
      audio.addEventListener("stalled", () => {
        if (manualStopRef.current) return
        audio.load()
        audio.play().catch(() => {})
      })
      audio.addEventListener("ended", () => {
        if (manualStopRef.current) return
        audio.play().catch(() => {})
      })
      audioRef.current = audio
    }

    const audio = audioRef.current
    audio.volume = volume
    audio.muted = volume === 0

    if (isPlaying) {
      manualStopRef.current = true
      audio.pause()
      setIsPlaying(false)
    } else {
      manualStopRef.current = false
      setIsLoading(true)
      audio
        .play()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
      setIsPlaying(true)
    }
  }

  return (
    <RadioPlayerContext.Provider
      value={{ isPlaying, isLoading, currentTrack, playlist, playlistLoading, volume, setVolume, toggleStream }}
    >
      {children}
    </RadioPlayerContext.Provider>
  )
}

export function useRadioPlayer() {
  const ctx = useContext(RadioPlayerContext)
  if (!ctx) throw new Error("useRadioPlayer must be used within RadioPlayerProvider")
  return ctx
}