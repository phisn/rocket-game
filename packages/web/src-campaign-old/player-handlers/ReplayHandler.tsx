import { useMemo } from "react"
import { ReplayModel } from "runtime/proto/replay"
import { WorldModel } from "runtime/proto/world"
import { base64ToBytes } from "runtime/src/model/base64-to-bytes"
import { GamemodeView } from "shared/src/views/gamemode-view"
import { WorldView } from "shared/src/views/world-view"
import { trpc } from "../../src/common/trpc/trpc"
import { ReplayPlayer } from "../../src/game/player-replay/ReplayPlayer"

export interface ReplayHandlerProps {
    type: "replay"
    worldSelected: WorldView
    gamemodeSelected: GamemodeView
    userId: string
}

export function ReplayHandler(props: ReplayHandlerProps) {
    const worldModel = WorldModel.decode(base64ToBytes(props.worldSelected.model))

    const [replay] = trpc.replay.get.useSuspenseQuery({
        username: props.userId,
        world: props.worldSelected.id.name,
        gamemode: props.gamemodeSelected.name,
    })

    const replayModel = useMemo(
        () => (replay && ReplayModel.decode(base64ToBytes(replay.model))) || undefined,
        [replay],
    )

    if (!replayModel) {
        throw new Error("ReplayModel is undefined")
    }

    return (
        <div className="absolute inset-0">
            <ReplayPlayer
                world={worldModel}
                replay={replayModel}
                name={props.worldSelected.id.name}
                gamemode={props.gamemodeSelected.name}
            />
        </div>
    )
}