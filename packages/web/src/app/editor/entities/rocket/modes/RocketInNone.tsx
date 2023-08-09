import { Svg } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { EntityType } from "runtime/src/core/common/EntityType"
import { RocketEntityModel } from "runtime/src/model/world/EntityModel"
import { Euler, MeshBasicMaterial, Object3D } from "three"
import {
    entityGraphicRegistry,
    isPointInsideEntity,
} from "../../../../../game/runtime-view/graphics/EntityGraphicRegistry"
import { ConsumeEvent, Priority, useEventListener } from "../../../store/EventStore"
import { RocketMode } from "../Rocket"
import { RocketState } from "../RocketState"

export interface RocketModeNone {
    type: "none"
}

export function RocketInNone(props: {
    state: RocketState
    mode: RocketModeNone
    setMode: (mode: RocketMode) => void
}) {
    const graphicEntry = entityGraphicRegistry[EntityType.Rocket]
    const svgRef = useRef<Object3D>()

    const [hovered, setHovered] = useState(false)

    useEventListener(
        event => {
            if (!svgRef.current) {
                return
            }

            if (event.consumed) {
                setHovered(false)

                return
            }

            const rocket: RocketEntityModel = {
                type: EntityType.Rocket,

                position: props.state.position,
                rotation: props.state.rotation,
            }

            const isInside = isPointInsideEntity(event.position, rocket)
            setHovered(isInside)

            if (isInside) {
                if (event.leftButtonClicked) {
                    document.body.style.cursor = "grabbing"

                    props.setMode({
                        type: "moving",
                        offsetPosition: {
                            x: props.state.position.x - event.positionInGrid.x,
                            y: props.state.position.y - event.positionInGrid.y,
                        },
                    })
                } else {
                    document.body.style.cursor = "grab"
                }

                return ConsumeEvent
            }
        },
        Priority.Normal,
        true,
    )

    return (
        <>
            <Suspense>
                <Svg
                    ref={svgRef as any}
                    position={[props.state.position.x, props.state.position.y, 0]}
                    rotation={new Euler(0, 0, props.state.rotation)}
                    src={graphicEntry.src}
                    scale={graphicEntry.scale}
                    fillMaterial={hovered ? new MeshBasicMaterial({ color: "#ffff55" }) : undefined}
                />
            </Suspense>
        </>
    )
}