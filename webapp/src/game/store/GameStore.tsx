
import { createStore } from "zustand"

import { Runtime } from "../runtime/Runtime"
import { InterpolationUpdate } from "./interpolation/InterpolationUpdate"
import { canZoomIn, canZoomOut } from "./Zoom"

interface GameState {
    interpolationSubscribers: ((update: InterpolationUpdate) => void)[]

    zoomIndex: number
}

export interface GameStore extends GameState {
    get runtime(): Runtime

    zoomIn(): void
    zoomOut(): void

    interpolateSubscribe(callback: (update: InterpolationUpdate) => void): () => void
}

export const createGameStore = (runtime: Runtime) => 
    createStore<GameStore>((set, get) => ({
        runtime,

        interpolationSubscribers: [],

        zoomIndex: 1,

        zoomIn: () => {
            const zoomIndex = get().zoomIndex
            if (canZoomIn(zoomIndex)) {
                set({
                    zoomIndex: zoomIndex + 1
                })
            }
        },
        zoomOut: () => {
            const zoomIndex = get().zoomIndex
            if (canZoomOut(zoomIndex)) {
                set({
                    zoomIndex: zoomIndex - 1
                })
            }
        },

        interpolateSubscribe: (callback) => {
            const subscribers = get().interpolationSubscribers
            subscribers.push(callback)

            return () => {
                const index = subscribers.indexOf(callback)

                if (index > -1) {
                    subscribers.splice(index, 1)
                }
            }
        }
    }))
