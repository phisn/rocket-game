import { WebappSystemFactory } from "../WebappSystemFactory"

export const newParticleAgeSystem: WebappSystemFactory = (store, meta) => {
    const particles = store.newEntitySet("particle", "rigidBody")

    return () => {
        for (const particle of particles) {
            particle.components.particle.age++

            if (particle.components.particle.age >= particle.components.particle.lifeTime) {
                meta.rapier.removeRigidBody(particle.components.rigidBody)
                store.removeEntity(particle.id)
            }
        }
    }
}
