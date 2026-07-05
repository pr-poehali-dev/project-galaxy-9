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
  volume: number
  setVolume: (value: number) => void
  toggleStream: () => void
}

const RadioPlayerContext = createContext<RadioPlayerState | null>(null)

export function RadioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null)
  const [volume, setVolumeState] = useState(1)

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
      audioRef.current = audio
    }

    const audio = audioRef.current
    audio.volume = volume
    audio.muted = volume === 0

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
    <RadioPlayerContext.Provider value={{ isPlaying, isLoading, currentTrack, volume, setVolume, toggleStream }}>
      {children}
    </RadioPlayerContext.Provider>
  )
}

export function useRadioPlayer() {
  const ctx = useContext(RadioPlayerContext)
  if (!ctx) throw new Error("useRadioPlayer must be used within RadioPlayerProvider")
  return ctx
}