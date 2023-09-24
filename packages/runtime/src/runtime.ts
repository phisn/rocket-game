import RAPIER from "@dimforge/rapier2d"
import { SystemStack, createEntityStore, createMessageStore } from "runtime-framework"
import { WorldModel } from "../proto/world"
import { newLevel } from "./core/level/level-factory"
import { newRocket } from "./core/rocket/rocket-factory"
import { RuntimeComponents } from "./core/runtime-components"
import { defaultConfig } from "./core/runtime-config"
import { RuntimeFactoryContext } from "./core/runtime-factory-context"
import { runtimeSystemFactories } from "./core/runtime-system-factories"
import { RuntimeSystemContext } from "./core/runtime-system-stack"
import { newShape } from "./core/shape/shape-factory"

export const newRuntime = <Components extends RuntimeComponents>(
    world: WorldModel,
    gamemodeName: string,
) => {
    const gamemode = world.gamemodes[gamemodeName]

    if (gamemode === undefined) {
        throw new Error(`Gamemode ${gamemodeName} not found`)
    }

    const groups = gamemode.groups.map(group => world.groups[group])

    const context: RuntimeFactoryContext<Components> = {
        store: createEntityStore(),
        messageStore: createMessageStore(),

        physics: new RAPIER.World(new RAPIER.Vector2(0, 0)),
        queue: new RAPIER.EventQueue(true),
        config: defaultConfig,
    }

    context.physics.gravity = new RAPIER.Vector2(0, -20)

    for (const level of groups.flatMap(group => group.levels)) {
        newLevel(context, level)
    }

    for (const shape of groups.flatMap(group => group.shapes)) {
        newShape(context, shape)
    }

    const rocketModel = groups.flatMap(group => group.rockets).at(0)

    if (rocketModel === undefined) {
        throw new Error("No rocket found in world")
    }

    const rocket = newRocket(context, rocketModel)

    rocket.components.rocket.currentLevel.components.level.boundsCollider.setSensor(false)
    rocket.components.rocket.currentLevel.components.level.captured = true
    rocket.components.rocket.currentLevel.components.level.hideFlag = true

    context.store.world.components.world = {
        ticks: 0,
        deaths: 0,
        finished: false,
    }

    return new SystemStack<RuntimeFactoryContext<RuntimeComponents>, RuntimeSystemContext>(
        context,
    ).add(...runtimeSystemFactories)
}