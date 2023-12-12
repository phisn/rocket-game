import { Point } from "runtime/src/model/point"
import { ShapeState } from "../shape-state"

export function shapeMove(state: ShapeState, to: Point) {
    const from = { ...state.position }

    return {
        do() {
            state.position = to
        },
        undo() {
            state.position = from
        },
    }
}
