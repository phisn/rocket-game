import { Svg } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"
import { Euler, MeshBasicMaterial } from "three"

import { selectHightlightColor, selectObjectColor } from "../../../common/Values"
import { EntityModel as EntityModel } from "../../../model/world/EntityModel"
import { entityModels } from "../../../model/world/EntityModels"
import { useEditorStore } from "../../store/useEditorStore"
import { ConfigureState } from "../state/ConfigureModeState"
import { ConfigureHint, HintType } from "../state/Hint"
import { Selectable, SelectableType } from "../state/Selectable"

export function Entity(props: { entity: EntityModel, index?: number }) {
    const entry = entityModels[props.entity.type]

    const [material, setMaterial] = useState<MeshBasicMaterial | undefined>()
    const previousStrokeColor = useRef<number | undefined>(undefined)

    /*
    const { topLeft, topRight, bottomLeft, bottomRight } = useMemo(
        () => entityRect(props.entity), 
        [props.entity]
    )
    */

    useFrame(() => {
        const state = useEditorStore.getState().getModeStateAs<ConfigureState>()
        const newStrokeColor = getStrokeColor(props.index, state.selected, state.hint)

        if (newStrokeColor !== previousStrokeColor.current) {
            if (newStrokeColor) {
                setMaterial(
                    new MeshBasicMaterial({ color: newStrokeColor })
                )
            }
            else {
                setMaterial(undefined)
            }

            previousStrokeColor.current = newStrokeColor
        }
    })

    return (
        <>
            <Suspense fallback={null}>
                { props.entity.position &&
                    <Svg
                        fillMaterial={material}
                        src={entry.src}
                        scale={entry.scale} 
                        position={[
                            props.entity.position.x,
                            props.entity.position.y,
                            0 
                        ]} 
                        rotation={new Euler(0, 0, props.entity.rotation)} 
                    />                
                }
            </Suspense>

            {/*
            <mesh position={[topLeft.x, topLeft.y, 0.5]}>
                <circleGeometry args={[5.0]} />
                <meshBasicMaterial color="#ff0000" />
            </mesh>
            <mesh position={[topRight.x, topRight.y, 0.5]}>
                <circleGeometry args={[5.0]} />
                <meshBasicMaterial color="#55ff55" />
            </mesh>
            <mesh position={[bottomLeft.x, bottomLeft.y, 0.5]}>
                <circleGeometry args={[5.0]} />
                <meshBasicMaterial color="#5555ff" />
            </mesh>
            <mesh position={[bottomRight.x, bottomRight.y, 0.5]}>
                <circleGeometry args={[5.0]} />
                <meshBasicMaterial color="#ffff55" />
            </mesh>
            */}
        </>
    )
}

function getStrokeColor(
    index: number | undefined, 
    selectable: Selectable | null,
    hint: ConfigureHint | null
) {
    const isHighlighted = index !== undefined
        && hint?.type === HintType.Selectable
        && hint.selectable.type === SelectableType.Entity
        && hint.selectable.entityIndex === index

    if (selectable &&
            selectable.type === SelectableType.Entity &&
            selectable.entityIndex === index) {
    
        return isHighlighted
            ? selectHightlightColor
            : selectObjectColor
    }

    if (isHighlighted) {
        return 0xffff44
    }

    return undefined
}