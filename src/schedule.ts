export type MovieSchedule = {
  title: string;
  date: string;
  duration: number;
  rate: string | undefined;
  schedules: Schedule[];
};

export type Schedule = {
  screen: string;
  time: Time[];
};

export type Time = {
  from: string;
  to: string;
};

export function mergeSchedule(schedules: MovieSchedule[]): MovieSchedule[] {
  const groupedByTitle = Object.groupBy(schedules, (s) => s.title);

  return Object.values(groupedByTitle).flatMap((s) => {
    const groupBySchedule = Object.groupBy(s, (s) => {
      return JSON.stringify(s.schedules);
    });
    return Object.values(groupBySchedule).flatMap<MovieSchedule>((it) => {
      const base = it.at(0);
      const date =
        it.length === 1 ? base.date : `${base.date} - ${it.at(-1).date}`;
      return [
        {
          ...base,
          date,
        },
      ];
    });
  });
}
