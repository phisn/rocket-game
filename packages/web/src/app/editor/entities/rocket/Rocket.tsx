import { useState } from "react"
import { RocketState } from "./RocketState"
import { RocketInMoving, RocketModeMoving } from "./modes/RocketInMoving"
import { RocketInNone, RocketModeNone } from "./modes/RocketInNone"

export type RocketMode = RocketModeNone | RocketModeMoving

export function Rocket(props: { state: RocketState }) {
    const [mode, setMode] = useState<RocketMode>({ type: "none" })

    return (
        <>
            {mode.type === "none" && (
                <RocketInNone state={props.state} mode={mode} setMode={setMode} />
            )}
            {mode.type === "moving" && (
                <RocketInMoving state={props.state} mode={mode} setMode={setMode} />
            )}
        </>
    )
}
