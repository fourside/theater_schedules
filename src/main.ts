import { type Locator, firefox } from "playwright";
import { Env } from "./env";
import {
  type MovieSchedule,
  type Schedule,
  type Time,
  mergeSchedule,
} from "./schedule";
import { send } from "./slack";

async function main() {
  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(Env.targetUrl);

  const links = await page
    .getByRole("listitem")
    .and(page.locator(".item"))
    .locator("a")
    .all();
  const movieSchedules: MovieSchedule[] = [];
  for (const link of links) {
    try {
      await link.click();
      const timetable = page.frameLocator("#iframe").locator("#timetable");
      const date = await timetable.locator("h1 time").innerText();
      const articles = await timetable.locator("article").all();
      const movies = await Promise.all(
        articles.map((it) => mapMovieSchedule(it, date)),
      );
      movieSchedules.push(...movies);
      await page.waitForTimeout(2000);
    } catch (e) {
      console.error(e);
    }
  }
  const mergedSchedules = mergeSchedule(movieSchedules);
  await send(mergedSchedules);

  await page.close();
  await browser.close();
}

(async () => {
  await main();
})();

async function mapMovieSchedule(
  article: Locator,
  date: string,
): Promise<MovieSchedule> {
  const title = await article.locator("header h2").innerText();

  const durationText = await article
    .locator(".theatre small")
    .first()
    .innerText();
  const duration = Number.parseInt(durationText);

  const rateLocator = article.locator("header .age");
  const rate = (await rateLocator.isVisible())
    ? await rateLocator.innerText()
    : undefined;

  const timetables = await article.getByRole("list").all();
  const schedules = await Promise.all(timetables.map(mapSchedule));

  return {
    title,
    date,
    duration,
    rate,
    schedules,
  };
}

async function mapSchedule(timetable: Locator): Promise<Schedule> {
  const screen = await timetable.locator(".theatre-num").innerText();
  const timeItems = await timetable
    .locator(".check_date")
    .or(timetable.locator("[class='']"))
    .all();
  const time = await Promise.all(timeItems.map(mapTime));

  return {
    screen,
    time,
  };
}

async function mapTime(time: Locator): Promise<Time> {
  const from = await time.locator(".start").innerText();
  const to = await time.locator(".end").innerText();
  return {
    from,
    to,
  };
}
