import { Point } from "runtime/src/model/Point"
import { ShapeState } from "../ShapeState"

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
