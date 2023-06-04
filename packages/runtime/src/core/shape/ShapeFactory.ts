import RAPIER from "@dimforge/rapier2d-compat"
import { EntityStore } from "runtime-framework"

import { ShapeModel } from "../../model/world/ShapeModel"
import { EntityTypeComponent } from "../common/components/EntityTypeComponent"
import { RigidbodyComponent } from "../common/components/RigidbodyComponent"
import { Components } from "../Components"
import { EntityType } from "../EntityType"
import { Meta } from "../Meta"
import { ShapeComponent } from "./ShapeComponent"

export const newShape = (meta: Meta, store: EntityStore, shape: ShapeModel) => {
    const [vertices, top, left] = verticesForShape(shape)

    const body = meta.rapier.createRigidBody(
        RAPIER.RigidBodyDesc.fixed()
            .setTranslation(left, top)
    )

    const collider = RAPIER.ColliderDesc.polyline(vertices)

    if (collider === null) {
        throw new Error("Failed to create collider")
    }

    meta.rapier.createCollider(collider, body)

    return store.getState().newEntity()
        .set<RigidbodyComponent>(Components.Rigidbody, { body })
        .set<EntityTypeComponent>(Components.EntityType, { type: EntityType.Shape })
        .set<ShapeComponent>(Components.o, { vertices: shape.vertices })
}

function verticesForShape(shape: ShapeModel): [ Float32Array, number, number ] {
    const left = shape.vertices.reduce((acc, vertex) => Math.min(acc, vertex.x), Infinity)
    const top  = shape.vertices.reduce((acc, vertex) => Math.min(acc, vertex.y), Infinity)

    const vertices = new Float32Array(shape.vertices.length * 2 + 2)

    shape.vertices.forEach((vertex, i) => {
        vertices[i * 2] = vertex.x - left
        vertices[i * 2 + 1] = vertex.y - top
    })

    vertices[vertices.length - 2] = shape.vertices[0].x - left
    vertices[vertices.length - 1] = shape.vertices[0].y - top

    return [ vertices, top, left ]
}
