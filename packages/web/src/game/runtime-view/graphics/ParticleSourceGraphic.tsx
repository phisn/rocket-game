import { useLayoutEffect, useRef } from "react"
import { Entity } from "runtime-framework"
import * as THREE from "three"

import { useGraphicUpdate } from "../../store/useGraphicUpdate"
import { colorInGradient } from "../webapp-runtime/particle/Gradient"
import { WebappComponents } from "../webapp-runtime/WebappComponents"

export function ParticleSourceGraphic(props: {
    entity: Entity<WebappComponents>
}) {
    if (!props.entity.has("particleSource")) {
        throw new Error("Got invalid entity graphic type")
    }

    const entity = props.entity

    /*
    const currentGradientColor = () => gradientColorToNumber(colorInGradient(
        entity.components.particle.gradientOverTime,
        entity.components.particle.age / entity.components.particle.lifeTime
    ))
    */

    const instanceMeshRef = useRef<THREE.InstancedMesh>(null!)

    const instanceMatrix = new THREE.Matrix4()
    const instanceColor = new THREE.Color()

    useGraphicUpdate(ticked => {
        if (ticked === false) {
            return
        }

        const particleSource = entity.components.particleSource

        instanceMeshRef.current.count = particleSource.amount

        let i = 0
        let j = particleSource.latestParticle

        while (i < particleSource.amount) {
            const particle = particleSource.particles[j]

            if (particle !== undefined) {
                const position = particle.body.translation()

                instanceMeshRef.current.setMatrixAt(
                    i,
                    instanceMatrix
                        .makeScale(particle.size, particle.size, 1)
                        .setPosition(position.x, position.y, 1),
                )

                const color = colorInGradient(
                    particle.gradientOverTime,
                    particle.age / particle.lifeTime,
                )

                instanceMeshRef.current.setColorAt(
                    i,
                    instanceColor.setRGB(color[0], color[1], color[2], "srgb"),
                )

                i++
            }

            j =
                (j - 1 + particleSource.particles.length) %
                particleSource.particles.length
        }

        instanceMeshRef.current.instanceMatrix.needsUpdate = true

        if (instanceMeshRef.current.instanceColor && ticked) {
            instanceMeshRef.current.instanceColor.needsUpdate = true
        }

        /*
        meshRef.current.position.set(
            particle.components.interpolation.position.x,
            particle.components.interpolation.position.y,
            0)
        */

        /*
        if (previousAgeRef.current !== particle.components.particle.age) {
            materialRef.current.color.set(currentGradientColor())

            materialRef.current.needsUpdate = true
            previousAgeRef.current = particle.components.particle.age
        }
        */
    })

    useLayoutEffect(() => {
        instanceMeshRef.current.setColorAt(0, new THREE.Color(0x000000))
    }, [])

    return (
        <>
            <instancedMesh
                ref={instanceMeshRef}
                args={[
                    undefined,
                    undefined,
                    entity.components.particleSource.bufferAmount,
                ]}
            >
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial opacity={0.8} transparent />
            </instancedMesh>
        </>
    )
}