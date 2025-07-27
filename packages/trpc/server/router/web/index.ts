import { router } from "../../trpc";
import { formsRouter } from "./forms";
import { resumeRouter } from "./resume";
import { shareRouter } from "./share";

export const webRouter = router({
  forms: formsRouter,
  resume: resumeRouter,
  share: shareRouter,
});

export type WebRouter = typeof webRouter;
