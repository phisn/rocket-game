import { EntityType } from "runtime/proto/world"
import { Point } from "runtime/src/model/point"
import { changeAnchor } from "runtime/src/model/world/change-anchor"
import { entityRegistry } from "runtime/src/model/world/entity-registry"
import { WorldState } from "../../../models/world-state"
import { LevelState } from "../level-state"

export const levelNew = (position: Point, rotation: number) => (world: WorldState) => {
    const id = [...world.entities.keys()].reduce((max, id) => Math.max(max, id), 0) + 1

    const entry = entityRegistry[EntityType.LEVEL]
    const center = changeAnchor(position, 0, entry, { x: 0, y: 1 }, { x: 0.2, y: 0.5 })

    const level: LevelState = {
        type: EntityType.LEVEL,

        id,

        position,
        rotation,

        cameraTopLeft: { x: center.x - 4, y: center.y + 4 },
        cameraBottomRight: { x: center.x + 4, y: center.y - 4 },

        captureLeft: 2,
        captureRight: 2,
    }

    return {
        do() {
            world.entities.set(id, level)
        },
        undo() {
            world.entities.delete(id)
        },
    }
}
