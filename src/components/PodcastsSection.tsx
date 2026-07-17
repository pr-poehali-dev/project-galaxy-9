import Icon from "@/components/ui/icon"

interface Show {
  title: string
  time: string
}

interface DaySchedule {
  day: string
  shows: Show[]
}

const schedule: DaySchedule[] = [
  { day: "Понедельник", shows: [] },
  { day: "Вторник", shows: [] },
  { day: "Среда", shows: [] },
  { day: "Четверг", shows: [] },
  {
    day: "Пятница",
    shows: [
      { title: "Утренний Будильник", time: "7:00–10:00" },
      { title: "Горячая Пятнадцатка", time: "19:00–20:00" },
    ],
  },
  {
    day: "Суббота",
    shows: [{ title: "Fresh Плейлист", time: "12:00–12:30" }],
  },
  {
    day: "Воскресенье",
    shows: [{ title: "Горячая Пятнадцатка", time: "14:00–15:00" }],
  },
]

export function PodcastsSection() {
  return (
    <section id="podcasts" className="px-4 md:px-8 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
            РАСПИСАНИЕ
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">Подкасты</h2>
          <p className="mt-2 text-gray-400">Программы Wave FM по дням недели</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md divide-y divide-white/5">
          {schedule.map((item) => (
            <div key={item.day} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
              <span className="shrink-0 sm:w-40 font-semibold text-white">{item.day}</span>
              {item.shows.length === 0 ? (
                <span className="text-sm text-gray-500">Нет подкастов</span>
              ) : (
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {item.shows.map((show) => (
                    <div
                      key={show.title + show.time}
                      className="flex items-center gap-2 rounded-full bg-violet-600/15 px-3 py-1.5"
                    >
                      <Icon name="Mic2" size={14} className="text-violet-400" />
                      <span className="text-sm font-medium text-white">{show.title}</span>
                      <span className="text-sm text-gray-400">{show.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
