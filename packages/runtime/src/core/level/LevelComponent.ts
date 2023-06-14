import RAPIER from "@dimforge/rapier2d-compat"
import { Point } from "webapp/src/model/world/Point"

export interface LevelComponent {
    captured: boolean

    camera: {
        topLeft: Point
        bottomRight: Point
    }

    hideFlag: boolean
    flag: Point
    flagRotation: number

    boundsCollider: RAPIER.Collider
}
