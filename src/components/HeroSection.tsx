import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="about" className="flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] py-2 text-sm px-2">
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-400">В ЭФИРЕ</span>
        <span className="text-gray-300">104.5 FM • музыка без перерыва</span>
        <Icon name="Radio" size={16} className="text-gray-400" />
      </div>

      <h1 className="mb-4 max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance">
        Wave FM — волна твоей музыки
      </h1>

      <p className="mb-8 max-w-xl text-gray-400">
        Круглосуточный поток лучших хитов, свежих новинок и авторских шоу. Настраивайся на нашу волну — и пусть звучит только то, что тебе по душе.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button className="rounded-full bg-violet-600 px-6 hover:bg-violet-700 text-white">
          <Icon name="Play" size={16} className="mr-2 fill-white" /> Слушать эфир
        </Button>
        <Button variant="outline" className="rounded-full border-gray-700 bg-transparent text-white hover:bg-gray-800">
          <Icon name="ListMusic" size={16} className="mr-2 text-violet-500" /> Смотреть чарт
        </Button>
      </div>
    </section>
  )
}