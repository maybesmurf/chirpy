import { router } from '../trpc-server';
import { analyticsRouter } from './analytics';
import { commentRouter } from './comment';
import { likeRouter } from './like';
import { notificationRouter } from './notification';
import { pageRouter } from './page';
import { projectRouter } from './project';
import { revalidateRouter } from './revalidate';
import { settingsRouter } from './settings';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  notification: notificationRouter,
  project: projectRouter,
  comment: commentRouter,
  like: likeRouter,
  revalidate: revalidateRouter,
  analytics: analyticsRouter,
  page: pageRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
