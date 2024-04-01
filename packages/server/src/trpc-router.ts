import { googleAuthRouter } from "./query/google-auth"
import { leaderboardRouter } from "./query/leaderboard-router"
import { worldRouter } from "./query/world-router"
import { router } from "./trpc"
import { validateReplayProcedure } from "./usecase/validate-replay"

export const appRouter = router({
    googleAuth: googleAuthRouter,
    world: worldRouter,
    replay: leaderboardRouter,
    validateReplay: validateReplayProcedure,
})

export type AppRouter = typeof appRouter
