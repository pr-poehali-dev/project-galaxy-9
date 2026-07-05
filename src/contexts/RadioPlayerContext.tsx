import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react"

const STREAM_URL = "https://myradio24.org/19486"
const PLAYLIST_API = "https://functions.poehali.dev/6cc1d340-a31e-4b50-ae1e-5b33f37cae78"

interface CurrentTrack {
  artist: string
  title: string
}

interface RadioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  currentTrack: CurrentTrack | null
  toggleStream: () => void
}

const RadioPlayerContext = createContext<RadioPlayerState | null>(null)

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null)

  useEffect(() => {
    const loadCurrentTrack = () => {
      fetch(PLAYLIST_API)
        .then((res) => res.json())
        .then((data) => {
          if (data.current?.title) {
            setCurrentTrack(data.current)
          }
        })
        .catch(() => {})
    }

    loadCurrentTrack()
    const interval = setInterval(loadCurrentTrack, 20000)
    return () => clearInterval(interval)
  }, [])

  const toggleStream = () => {
    if (!audioRef.current) {
      const audio = new Audio(STREAM_URL)
      audio.preload = "none"
      audio.volume = 1
      audio.muted = false
      audio.addEventListener("waiting", () => setIsLoading(true))
      audio.addEventListener("playing", () => setIsLoading(false))
      audioRef.current = audio
    }

    const audio = audioRef.current
    audio.muted = false
    audio.volume = 1

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      audio
        .play()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
      setIsPlaying(true)
    }
  }

  return (
    <RadioPlayerContext.Provider value={{ isPlaying, isLoading, currentTrack, toggleStream }}>
      {children}
    </RadioPlayerContext.Provider>
  )
}

export function useRadioPlayer() {
  const ctx = useContext(RadioPlayerContext)
  if (!ctx) throw new Error("useRadioPlayer must be used within RadioPlayerProvider")
  return ctx
}
