interface Show {
  title: string
  time: string
  cover: string
}

interface DaySchedule {
  day: string
  shows: Show[]
}

const COVERS = {
  alarm: "https://cdn.poehali.dev/projects/65e9cb1f-bd87-47d7-8e5e-efe03abd1740/files/59b6b0ee-0535-476e-bd8b-c021d1b79f47.jpg",
  hot15: "https://cdn.poehali.dev/projects/65e9cb1f-bd87-47d7-8e5e-efe03abd1740/files/dfbc3973-2cb4-4353-b376-684d86d1f0cd.jpg",
  fresh: "https://cdn.poehali.dev/projects/65e9cb1f-bd87-47d7-8e5e-efe03abd1740/files/596f7b9c-f399-4e87-9546-847afa949b31.jpg",
}

const morningAlarm: Show = { title: "Утренний Будильник", time: "7:00–10:00", cover: COVERS.alarm }

const schedule: DaySchedule[] = [
  { day: "Понедельник", shows: [morningAlarm] },
  { day: "Вторник", shows: [morningAlarm] },
  { day: "Среда", shows: [morningAlarm] },
  { day: "Четверг", shows: [morningAlarm] },
  {
    day: "Пятница",
    shows: [
      morningAlarm,
      { title: "Горячая Пятнадцатка", time: "19:00–20:00", cover: COVERS.hot15 },
    ],
  },
  {
    day: "Суббота",
    shows: [{ title: "Fresh Плейлист", time: "12:00–12:30", cover: COVERS.fresh }],
  },
  {
    day: "Воскресенье",
    shows: [{ title: "Горячая Пятнадцатка", time: "14:00–15:00", cover: COVERS.hot15 }],
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
                      className="flex items-center gap-3 rounded-2xl bg-violet-600/15 p-2 pr-4"
                    >
                      <img
                        src={show.cover}
                        alt={show.title}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{show.title}</span>
                        <span className="text-sm text-gray-400">{show.time}</span>
                      </div>
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