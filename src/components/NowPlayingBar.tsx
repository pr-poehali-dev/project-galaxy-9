import Icon from "@/components/ui/icon"
import { Slider } from "@/components/ui/slider"
import { useRadioPlayer } from "@/contexts/RadioPlayerContext"

export function NowPlayingBar() {
  const { isPlaying, isLoading, currentTrack, volume, setVolume, toggleStream } = useRadioPlayer()

  if (!isPlaying) return null

  const toggleMute = () => setVolume(volume === 0 ? 1 : 0)

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#111111]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3">
        <button
          onClick={toggleStream}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-700"
        >
          {isLoading ? (
            <Icon name="Loader2" size={16} className="animate-spin" />
          ) : (
            <Icon name="Pause" size={16} className="fill-current" />
          )}
        </button>

        <div className="flex h-8 items-end gap-0.5">
          <span className="h-3 w-1 animate-pulse rounded-full bg-violet-400 [animation-delay:0ms]" />
          <span className="h-6 w-1 animate-pulse rounded-full bg-violet-400 [animation-delay:150ms]" />
          <span className="h-4 w-1 animate-pulse rounded-full bg-violet-400 [animation-delay:300ms]" />
          <span className="h-7 w-1 animate-pulse rounded-full bg-violet-400 [animation-delay:450ms]" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-violet-400">В ЭФИРЕ · Wave FM</p>
          <p className="truncate text-sm font-medium text-white">
            {currentTrack?.title
              ? `${currentTrack.artist ? currentTrack.artist + " — " : ""}${currentTrack.title}`
              : "музыка без перерыва"}
          </p>
        </div>

        <div className="hidden sm:flex shrink-0 items-center gap-2 w-32">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
            <Icon name={volume === 0 ? "VolumeX" : volume < 0.5 ? "Volume1" : "Volume2"} size={18} />
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([v]) => setVolume(v / 100)}
            className="w-20"
          />
        </div>

        <Icon name="Radio" size={18} className="hidden sm:block shrink-0 text-gray-500" />
      </div>
    </div>
  )
}