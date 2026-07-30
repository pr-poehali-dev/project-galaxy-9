import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { useRadioPlayer } from "@/contexts/RadioPlayerContext"

export function HeroSection() {
  const { isPlaying, isLoading, currentTrack, toggleStream } = useRadioPlayer()

  return (
    <section id="about" className="flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] py-2 text-sm px-2">
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">
          {isPlaying ? "В ЭФИРЕ" : "СЛУШАЙТЕ"}
        </span>
        <span className="text-gray-300">
          {currentTrack?.title
            ? `${currentTrack.artist ? currentTrack.artist + " — " : ""}${currentTrack.title}`
            : "музыка без перерыва"}
        </span>
        <Icon name="Radio" size={16} className="text-gray-400" />
      </div>

      {currentTrack?.title && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-600/20">
            {currentTrack.cover ? (
              <img src={currentTrack.cover} alt={currentTrack.title} className="h-full w-full object-cover" />
            ) : (
              <Icon name="Music2" size={20} className="text-violet-300" />
            )}
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-medium text-violet-400">Сейчас играет</p>
            <p className="truncate font-medium text-white">{currentTrack.title}</p>
            {currentTrack.artist && (
              <p className="truncate text-sm text-gray-400">{currentTrack.artist}</p>
            )}
          </div>
        </div>
      )}

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