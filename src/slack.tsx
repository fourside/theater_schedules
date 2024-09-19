import { Blocks, Section } from "jsx-slack";
import type { MovieSchedule } from "./schedule";

export async function send(movieSchedules: MovieSchedule[]): Promise<void> {
  const body = movieBlock(movieSchedules);
  console.log(body);
  // await fetch(Env.slackWebhookUrl, {
  //   method: "POST",
  //   body: "",
  // });
  return;
}

const movieBlock = (movieSchedules: MovieSchedule[]) => (
  <Blocks>
    {movieSchedules.map((schedule) => (
      // biome-ignore lint: lint/correctness/useJsxKeyInIterable
      <Section>
        <p>
          <b>{schedule.title}</b>
        </p>
        <br />
        <p>{schedule.date}</p>
        <Section>
          {schedule.schedules.map((it) => (
            // biome-ignore lint: lint/correctness/useJsxKeyInIterable
            <Section>
              {it.screen} {it.time.map((i) => i.from).join(", ")}
            </Section>
          ))}
        </Section>
      </Section>
    ))}
  </Blocks>
);
