import { Point } from "runtime/src/model/point"
import { ImmutableEntityWith } from "../../store-world/models/entity"

export interface PipelineMovingState {
    entity: ImmutableEntityWith<"object">

    offsetPosition: Point
    offsetRotation: number

    position: Point
    rotation: number
}
