import { useMemo } from "react"
import { ReplayModel } from "runtime/proto/replay"
import { WorldModel } from "runtime/proto/world"
import { base64ToBytes } from "runtime/src/model/base64ToBytes"
import { GamemodeView } from "shared/src/views/GamemodeView"
import { WorldView } from "shared/src/views/WorldView"
import { useAppStore } from "../../../common/storage/AppStore"
import { trpc } from "../../../common/trpc/trpc"
import { GamePlayer } from "../../../game/player-game/GamePlayer"
import { bytesToBase64 } from "../../editor/models/exportModel"

export interface GameHandlerProps {
    type: "game"
    worldSelected: WorldView
    gamemodeSelected: GamemodeView
    userId?: string
}

export function GameHandler(props: GameHandlerProps) {
    const worldModel = WorldModel.decode(base64ToBytes(props.worldSelected.model))

    const userId = useAppStore(store => store.userId())

    const [replay] = trpc.replay.get.useSuspenseQuery({
        userId: props.userId || userId,
        world: props.worldSelected.id.name,
        gamemode: props.gamemodeSelected.name,
    })

    const validateReplay = trpc.validateReplay.useMutation()

    const replayModel = useMemo(
        () => (replay && ReplayModel.decode(base64ToBytes(replay.model))) || undefined,
        [replay],
    )

    return (
        <div className="absolute inset-0">
            <GamePlayer
                runtimeProps={{
                    world: worldModel,
                    name: props.worldSelected.id.name,
                    gamemode: props.gamemodeSelected.name,

                    replay: replayModel,

                    hook: {
                        finished: replay => {
                            validateReplay.mutate({
                                userId,
                                world: props.worldSelected.id.name,
                                gamemode: props.gamemodeSelected.name,
                                replay: bytesToBase64(ReplayModel.encode(replay).finish()),
                            })
                        },
                    },
                }}
            />
        </div>
    )
}
