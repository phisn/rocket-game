import { Gamemode } from "runtime/src/gamemode/Gamemode"
import { WorldModel } from "runtime/src/model/world/WorldModel"
import { newRuntime } from "runtime/src/Runtime"

import { newRegisterGraphicsSystem } from "./graphic/RegisterGraphicsSystem"
import { newInjectInterpolationSystem } from "./interpolation/InjectInterpolationSystem"
import { newParticleAgeSystem } from "./particle-source/ParticleAgeSystem"
import { newThrustParticleInjectSystem } from "./particle-thrust-source/ThrustParticleInjectSystem"
import { newThrustParticleSpawnSystem } from "./particle-thrust-source/ThrustParticleSpawnSystem"
import { WebappComponents } from "./WebappComponents"

export const newWebappRuntime = (gamemode: Gamemode, world: WorldModel) => {
    const { store, stack } = newRuntime<WebappComponents>(gamemode, world)

    stack.add(
        newInjectInterpolationSystem,
        newParticleAgeSystem,
        newThrustParticleSpawnSystem,
        newThrustParticleInjectSystem,
        newRegisterGraphicsSystem,
    )

    return {
        store,
        stack
    }
}