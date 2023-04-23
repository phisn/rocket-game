import { createStore } from "zustand"

export interface GameStore {
    zoom: number,
    zoomIndex: number,

    zoomIn: () => void
    zoomOut: () => void
}

const ZoomsIndexed = [
    1,
    1.5,
    2,
    3,
    4
]

export function canZoomIn(index: number) {
    return index < ZoomsIndexed.length - 1
}

export function canZoomOut(index: number) {
    return index > 0
}

export const createGameStore = () => 
    createStore<GameStore>((set, get) => ({
        zoom: 1,
        zoomIndex: 1,

        zoomIn: () => {
            const zoomIndex = get().zoomIndex

            if (canZoomIn(zoomIndex)) {
                set({
                    zoom: ZoomsIndexed[zoomIndex + 1],
                    zoomIndex: zoomIndex + 1
                })
            }
        },
        zoomOut: () => {
            const nextZoomIndex = get().zoomIndex

            if (canZoomOut(nextZoomIndex)) {
                set({
                    zoom: ZoomsIndexed[nextZoomIndex - 1],
                    zoomIndex: nextZoomIndex - 1
                })
            }
        },
    }))
