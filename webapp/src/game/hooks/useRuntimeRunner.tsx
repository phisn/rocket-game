import { useFrame } from "@react-three/fiber"
import { shallow } from "zustand/shallow"

import { InterpolationRuntimeTracker } from "../store/interpolation/InterpolationRuntimeTracker"
import { useGameStore } from "../store/useGameStore"
import { useControls } from "./useControls"
import { useGameLoop } from "./useGameLoop"

export function useRuntimeRunner() {
    const controls = useControls()

    const [ runtime, interpolationSubscribers ] = useGameStore(state => [
        state.runtime,
        state.interpolationSubscribers
    ], shallow)

    const interpolationTracker = new InterpolationRuntimeTracker(runtime)

    useGameLoop(
        () => {
            runtime.step({
                thrust: controls.current.thrust,
                rotation: controls.current.rotation,
                pause: controls.current.pause
            })
        },
        () => {
            interpolationTracker.next()
            console.log("interpolationTracker.next()")
        },
        runtime.state.meta.tickRate,
        runtime.state.meta.tickRateLag)

    useFrame(() => {
        const update = interpolationTracker.now()

        for (const subscriber of interpolationSubscribers) {
            subscriber(update)
        }
    })
}