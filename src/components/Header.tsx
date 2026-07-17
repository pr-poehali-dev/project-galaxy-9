import Icon from "@/components/ui/icon"
import { Button } from "@/components/ui/button"
import { useRadioPlayer } from "@/contexts/RadioPlayerContext"

export function Header() {
  const { isPlaying, isLoading, toggleStream } = useRadioPlayer()

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <WaveLogo />
        <span className="text-lg font-semibold text-white">
          Wave FM<sup className="text-xs">™</sup>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a href="#chart" className="text-sm text-gray-300 hover:text-white transition-colors">
          Чарт
        </a>
        <a href="#podcasts" className="text-sm text-gray-300 hover:text-white transition-colors">
          Подкасты
        </a>
        <a href="#partners" className="text-sm text-gray-300 hover:text-white transition-colors">
          Партнёры
        </a>
        <a href="#about" className="text-sm text-gray-300 hover:text-white transition-colors">
          Об эфире
        </a>
        <a href="#contacts" className="text-sm text-gray-300 hover:text-white transition-colors">
          Контакты
        </a>
      </nav>

      <Button
        onClick={toggleStream}
        className="rounded-full bg-violet-600 text-white hover:bg-violet-700"
      >
        {isLoading ? (
          <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
        ) : (
          <Icon name={isPlaying ? "Pause" : "Radio"} size={16} className="mr-2" />
        )}
        {isPlaying ? "Пауза" : "Слушать эфир"}
      </Button>
    </header>
  )
}

function WaveLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="9" width="2.5" height="6" rx="1.25" fill="#8B5CF6" opacity="0.5" />
      <rect x="6.5" y="5" width="2.5" height="14" rx="1.25" fill="#8B5CF6" opacity="0.75" />
      <rect x="11" y="2" width="2.5" height="20" rx="1.25" fill="#8B5CF6" />
      <rect x="15.5" y="5" width="2.5" height="14" rx="1.25" fill="#8B5CF6" opacity="0.75" />
      <rect x="20" y="9" width="2.5" height="6" rx="1.25" fill="#8B5CF6" opacity="0.5" />
    </svg>
  )
}