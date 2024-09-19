import { describe, expect, test } from "vitest";
import { type MovieSchedule, mergeSchedule } from "./schedule";

describe(mergeSchedule.name, () => {
  test("merged by title and schedules", () => {
    // arrange
    const base: MovieSchedule = {
      title: "Movie A",
      date: "2024-09-20",
      duration: 120,
      rate: "PG-13",
      schedules: [
        {
          screen: "Screen 1",
          time: [
            { from: "10:00", to: "12:00" },
            { from: "12:00", to: "14:00" },
          ],
        },
      ],
    };
    const schedules: MovieSchedule[] = [
      { ...base, date: "2024-09-20" },
      { ...base, date: "2024-09-21" },
      { ...base, date: "2024-09-22" },
      { ...base, date: "2024-09-20", title: "Movie B" },
      { ...base, date: "2024-09-20", title: "Movie C" },
      {
        ...base,
        date: "2024-09-21",
        title: "Movie C",
        schedules: [
          ...base.schedules,
          { screen: "Screen 2", time: [{ from: "11:00", to: "13:00" }] },
        ],
      },
    ];
    // act
    const merged = mergeSchedule(schedules);
    // assert
    expect(merged).toStrictEqual([
      {
        ...base,
        date: "2024-09-20 - 2024-09-22",
      },
      {
        ...base,
        title: "Movie B",
        date: "2024-09-20",
      },
      {
        ...base,
        title: "Movie C",
        date: "2024-09-20",
      },
      {
        ...base,
        title: "Movie C",
        date: "2024-09-21",
        schedules: [
          ...base.schedules,
          { screen: "Screen 2", time: [{ from: "11:00", to: "13:00" }] },
        ],
      },
    ]);
  });
});
