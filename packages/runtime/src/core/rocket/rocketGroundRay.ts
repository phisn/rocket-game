import RAPIER from "@dimforge/rapier2d"

import { EntityType } from "../../../proto/world"
import { changeAnchor } from "../../model/world/changeAnchor"
import { entityRegistry } from "../../model/world/entityRegistry"

let rayDir: RAPIER.Vector | undefined
let ray: RAPIER.Ray | undefined

export const rocketGroundRayRaw = (
    physics: RAPIER.World,
    rocket: RAPIER.RigidBody,
    length: number,
) => {
    const entry = entityRegistry[EntityType.ROCKET]

    const rayStart = changeAnchor(
        rocket.translation(),
        rocket.rotation(),
        entry,
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 0.2 },
    )

    const rayTarget = changeAnchor(
        rocket.translation(),
        rocket.rotation(),
        entry,
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: -1 },
    )

    if (ray === undefined || rayDir === undefined) {
        rayDir = new RAPIER.Vector2(0, 1)
        ray = new RAPIER.Ray(new RAPIER.Vector2(0, 0), new RAPIER.Vector2(0, 1))
    }

    rayDir.x = rayTarget.x - rayStart.x
    rayDir.y = rayTarget.y - rayStart.y

    ray.dir = rayDir
    ray.origin = rayStart

    const cast = physics.castRay(ray, length, false, undefined, 0x0001_0002, undefined, rocket)

    return {
        cast,
        ray,
        rayStart,
        rayTarget,
    }
}

export const rocketGroundRay = (physics: RAPIER.World, rocket: RAPIER.RigidBody, length: number) =>
    rocketGroundRayRaw(physics, rocket, length)?.cast
