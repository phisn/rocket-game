import { EntityType } from "./EntityType"
import { FlagEntity } from "./FlagModel"
import { Point } from "./Point"
import { Size } from "./Size"

export interface RocketEntityModel {
    type: EntityType.Rocket

    position: Point
    rotation: number
}

export interface GreenFlagEntityModel {
    type: EntityType.GreenFlag

    position: Point
    rotation: number
}

export type EntityModel = RocketEntityModel | FlagEntity | GreenFlagEntityModel

export interface EntityModelRegisterEntry {
    scale: number
    size: Size
    anchor: Point

    src: string

    // Idea is that entities consist of more than just position and rotation. 
    // The creation of an entity like camera is dependent on the position
    // because we want to set the initial camera somewhere around the initial position.
    // Addtionally, we dont want the camera position to be nullable so we need to 
    // create it now and not change after moving it later (small flag adjustments
    // should not change the camera position).  
    transformOrCreate: (position: Point, rotation: number, entity: EntityModel | null) => EntityModel
}

export interface EntityModelRegistry {
    [key: string]: EntityModelRegisterEntry
}

export function filterEntityModelsType<T>(entities: EntityModel[], type: EntityType) {
    return entities
        .map((entity, index) => ({ entity, index }))
        .filter(
            ({ entity }) => entity.type === type
        ) as { entity: T, index: number }[]
}