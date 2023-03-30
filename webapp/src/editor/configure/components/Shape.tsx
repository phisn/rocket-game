import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { MeshBasicMaterial } from "three"

import { shapeColor, shapeColorHighlighted, shapeColorSelected, shapeColorSelectedHighlighted } from "../../../common/Values"
import { useEditorStore } from "../../store/useEditorStore"
import { ConfigureState } from "../state/ConfigureModeState"
import { ConfigureHint, HintType } from "../state/Hint"
import { Selectable, SelectableType } from "../state/Selectable"

export function Shape(props: { shapeIndex: number }) {
    const shape = useEditorStore(state => state.world.shapes[props.shapeIndex])
    
    const threeShape = new THREE.Shape(
        shape.vertices.map(vertex => new THREE.Vector2(vertex.x, vertex.y))
    )
    
    const materialRef = useRef<MeshBasicMaterial>(null!)
    const previousStrokeColor = useRef<string>()

    useFrame(() => {
        const state = useEditorStore.getState().getModeStateAs<ConfigureState>()
        
        const newStrokeColor = getStrokeColor(
            props.shapeIndex, 
            state.selected, 
            state.hint
        )

        if (newStrokeColor !== previousStrokeColor.current) {
            materialRef.current.color.set(newStrokeColor)
            previousStrokeColor.current = newStrokeColor
        }
    })

    return (
        <>
            <mesh>
                <shapeGeometry args={[threeShape]} />
                <meshBasicMaterial ref={materialRef} />
            </mesh>
        </>
    )
}

function getStrokeColor(
    index: number,
    selectable: Selectable | null, 
    hint: ConfigureHint | null
) {
    const isHighlighted = hint && 
        hint.type === HintType.Selectable && 
        hint.selectable.type === SelectableType.Shape &&
        hint.selectable.shapeIndex === index

    if (selectable &&
        selectable.type === SelectableType.Shape &&
        selectable.shapeIndex === index) {

        return isHighlighted
            ? shapeColorSelectedHighlighted
            : shapeColorSelected
    }
    
    if (isHighlighted) {
        return shapeColorHighlighted
    }

    return shapeColor
}
