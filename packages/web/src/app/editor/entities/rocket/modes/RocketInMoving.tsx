import { Svg } from "@react-three/drei"
import { Suspense, useRef } from "react"
import { EntityType } from "runtime/proto/world"
import { Euler, Object3D } from "three"
import { entityGraphicRegistry } from "../../../../../game/runtime-view/graphics-assets/EntityGraphicRegistry"
import { EntityGraphicType } from "../../../../../game/runtime-view/graphics-assets/EntityGraphicType"
import { findLocationForEntity } from "../../../models/EntityWithLocation"
import { Priority, SubPriority } from "../../../models/Priority"
import { useEditorStore } from "../../../store/EditorStore"
import { ConsumeEvent, useEventListener } from "../../../store/EventStore"
import { RocketMode } from "../Rocket"
import { RocketState } from "../RocketState"
import { rocketMove } from "../mutations/rocketMove"

export interface RocketModeMoving {
    type: "moving"
    offsetPosition: { x: number; y: number }
}

export function RocketInMoving(props: {
    state: RocketState
    mode: RocketModeMoving
    setMode: (mode: RocketMode) => void
}) {
    const graphicEntry = entityGraphicRegistry[EntityGraphicType.Rocket]

    const svgRef = useRef<Object3D>()

    const positionRef = useRef({
        position: { ...props.state.position },
        rotation: props.state.rotation,
    })

    const dispatchMutation = useEditorStore(store => store.mutation)
    const world = useEditorStore(store => store.state.world)

    useEventListener(
        event => {
            if (event.consumed) {
                if (event.leftButtonClicked || event.rightButtonClicked) {
                    props.setMode({ type: "none" })
                }

                return
            }

            if (event.leftButtonDown) {
                updateLocation(...findLocationForEntity(world, event, EntityType.ROCKET))
                window.document.body.style.cursor = "grabbing"
            } else {
                window.document.body.style.cursor = "grab"

                dispatchMutation(
                    rocketMove(
                        props.state,
                        positionRef.current.position,
                        positionRef.current.rotation,
                    ),
                )

                props.setMode({ type: "none" })
            }

            function updateLocation(x: number, y: number, rotation: number) {
                positionRef.current.position.x = x
                positionRef.current.position.y = y
                positionRef.current.rotation = rotation

                svgRef.current?.position.set(
                    positionRef.current.position.x,
                    positionRef.current.position.y,
                    Priority.Action + SubPriority.Rocket,
                )

                svgRef.current?.rotation.set(0, 0, positionRef.current.rotation)
            }

            return ConsumeEvent
        },
        Priority.Action + SubPriority.Rocket,
        true,
    )

    return (
        <>
            <Suspense>
                <Svg
                    ref={svgRef as any}
                    position={[
                        positionRef.current.position.x,
                        positionRef.current.position.y,
                        Priority.Action + SubPriority.Rocket,
                    ]}
                    rotation={new Euler(0, 0, positionRef.current.rotation)}
                    src={graphicEntry.src}
                    scale={graphicEntry.scale}
                />
            </Suspense>
        </>
    )
}
