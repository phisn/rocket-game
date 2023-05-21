import { Svg } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import { Object3D } from "three"

import { entityModels } from "../../../model/world/EntityModels"
import { EntityType } from "../../../model/world/EntityType"
import { useEditorStore } from "../../store/useEditorStore"
import { ActionType } from "../state/Action"
import { PlacementState } from "../state/PlacementModeState"

export function EntityPreview() {
    const [entityType, setEntityType] = useState<EntityType | null>(null)
    const entry = entityType && entityModels[entityType]

    const svgRef = useRef<Object3D>(null)

    useFrame(() => {
        const action = useEditorStore.getState().getModeStateAs<PlacementState>().action

        if (action?.type == ActionType.PlaceEntity) {
            if (action.entity.type != entityType) {
                setEntityType(action.entity.type)
            }

            if (svgRef.current) {
                svgRef.current.position.set(
                    action.entity.position.x,
                    action.entity.position.y,
                    0
                )
                
                svgRef.current.rotation.set(0, 0, action.entity.rotation)
            }
        }
        else {
            setEntityType(null)
        }
    })

    return (
        <>
            { entry &&
                <Suspense fallback={null}>
                    <Svg
                        ref={svgRef}
                        src={entry.src}
                        scale={entry.scale} />
                </Suspense>
            }
        </>
    )
}