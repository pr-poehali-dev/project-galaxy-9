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
  { date: "2026-08-02", time: "15:04:42", artist: "Niletto", title: "Добрая Лунная", cover: "" },
  { date: "2026-08-02", time: "15:08:51", artist: "Alan Walker, Isabella Melkman, Katherine O'Ryan", title: "Broken Strings", cover: "" },
  { date: "2026-08-02", time: "15:11:33", artist: "Dj Piligrim", title: "Ты Меня Забудь", cover: "https://myradio24.org/covers/e1d483e8da248768.jpg" },
  { date: "2026-08-02", time: "15:16:16", artist: "Татьяна Куртукова", title: "Алёшенька", cover: "" },
  { date: "2026-08-02", time: "15:19:42", artist: "Filatov & Karas, Мумий Тролль", title: "Amore More, Goodbye", cover: "" },
  { date: "2026-08-02", time: "15:22:06", artist: "Pizza", title: "Пятница", cover: "" },
  { date: "2026-08-02", time: "15:25:33", artist: "Ёлка", title: "Выдохни", cover: "https://myradio24.org/covers/52ce69b490be833f.jpg" },
  { date: "2026-08-02", time: "15:28:06", artist: "Far East Movement, Justin Bieber", title: "Live My Life", cover: "" },
  { date: "2026-08-02", time: "15:32:06", artist: "Коста Лакоста", title: "А Ты Говоришь", cover: "https://myradio24.org/covers/4ab51dbba4679f3d.jpg" },
  { date: "2026-08-02", time: "15:35:24", artist: "5sta Family", title: "На костре", cover: "https://myradio24.org/covers/675789f70923dec9.jpg" },
  { date: "2026-08-02", time: "15:38:42", artist: "Mary Gu", title: "Косички", cover: "" },
  { date: "2026-08-02", time: "15:41:25", artist: "Jony", title: "Давай На Ты", cover: "https://myradio24.org/covers/0a5f943c7904f0a1.jpg" },
  { date: "2026-08-02", time: "15:43:51", artist: "ATB", title: "You're Not Alone", cover: "" },
  { date: "2026-08-02", time: "15:47:42", artist: "Elvira T", title: "Всё Решено", cover: "https://myradio24.org/covers/c4aca6bf6081bc68.jpg" },
  { date: "2026-08-02", time: "15:51:33", artist: "Дима Билан", title: "Так Устроен Этот Мир", cover: "https://myradio24.org/covers/247e0d9cd3472bc6.jpg" },
  { date: "2026-08-02", time: "15:54:51", artist: "Filatov & Karas", title: "Мимо Меня", cover: "" },
  { date: "2026-08-02", time: "15:58:06", artist: "Макsим", title: "Лучшая Ночь", cover: "https://myradio24.org/covers/59f6481fa13de366.jpg" },
  { date: "2026-08-02", time: "16:02:16", artist: "Kygo, Sandro Cavazza", title: "Hold On Me", cover: "" },
  { date: "2026-08-02", time: "16:05:15", artist: "Lyriq", title: "Обними", cover: "https://myradio24.org/covers/ed0029a5090cc70d.jpg" },
  { date: "2026-08-02", time: "16:09:06", artist: "Сергей Лазарев, Полина Гагарина", title: "Хэппи Энд", cover: "https://myradio24.org/covers/059ed376335b60f2.jpg" },
  { date: "2026-08-02", time: "16:13:07", artist: "By Индия, Xcho, Мот", title: "Шадэ", cover: "https://myradio24.org/covers/d499bf0873868564.jpg" },
  { date: "2026-08-02", time: "16:16:06", artist: "Женя Трофимов, Комната культур", title: "Осень (OST «Ландыши. Вторая весна»)", cover: "" },
  { date: "2026-08-02", time: "16:20:16", artist: "Лолита, Коста Лакоста", title: "По", cover: "" },
  { date: "2026-08-02", time: "16:23:51", artist: "Kungs, Theophilus London", title: "Galaxy", cover: "" },
  { date: "2026-08-02", time: "16:27:06", artist: "2Маши", title: "Мама, я танцую", cover: "" },
  { date: "2026-08-02", time: "16:31:25", artist: "Клава Кока", title: "Катастрофа", cover: "https://myradio24.org/covers/c6f27c71e3182961.jpg" },
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