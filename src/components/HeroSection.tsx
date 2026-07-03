import { useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"

const STREAM_URL = "https://myradio24.org/19486.m3u"
const PLAYLIST_API = "https://functions.poehali.dev/6cc1d340-a31e-4b50-ae1e-5b33f37cae78"

interface CurrentTrack {
  artist: string
  title: string
}

export function HeroSection() {
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
      audioRef.current = new Audio(STREAM_URL)
      audioRef.current.addEventListener("waiting", () => setIsLoading(true))
      audioRef.current.addEventListener("playing", () => setIsLoading(false))
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      audioRef.current.play().catch(() => setIsLoading(false))
      setIsPlaying(true)
    }
  }

  return (
    <section id="about" className="flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] py-2 text-sm px-2">
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">
          {isPlaying ? "В ЭФИРЕ" : "СЛУШАЙТЕ"}
        </span>
        <span className="text-gray-300">
          {currentTrack?.title
            ? `${currentTrack.artist ? currentTrack.artist + " — " : ""}${currentTrack.title}`
            : "104.5 FM • музыка без перерыва"}
        </span>
        <Icon name="Radio" size={16} className="text-gray-400" />
      </div>

      <h1 className="mb-4 max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
        Wave FM — волна твоей музыки
      </h1>

      <p className="mb-8 max-w-xl text-gray-400">
        Круглосуточный поток лучших хитов, свежих новинок и авторских шоу. Настраивайся на нашу волну — и пусть звучит только то, что тебе по душе.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          onClick={toggleStream}
          className="rounded-full bg-violet-600 px-6 hover:bg-violet-700 text-white"
        >
          {isLoading ? (
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
          ) : (
            <Icon
              name={isPlaying ? "Pause" : "Play"}
              size={16}
              className="mr-2 fill-white"
            />
          )}
          {isPlaying ? "Пауза" : "Слушать эфир"}
        </Button>
        <Button variant="outline" className="rounded-full border-gray-700 bg-transparent text-white hover:bg-gray-800" asChild>
          <a href="#chart">
            <Icon name="ListMusic" size={16} className="mr-2 text-violet-500" /> Смотреть чарт
          </a>
        </Button>
      </div>
    </section>
  )
}