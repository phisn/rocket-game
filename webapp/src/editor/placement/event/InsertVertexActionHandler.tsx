import { isInsideCanvas, PointerHandlerParams } from "../../event/EventDefinitions"
import { insertVertex } from "../../store/MutationsForWorld"
import { useEditorStore } from "../../store/useEditorStore"
import { InsertVertexAction } from "../state/Action"

export function insertActionHandler(params: PointerHandlerParams<InsertVertexAction>) {
    const state = useEditorStore.getState()

    if (params.event.leftButton) {
        state.setModeState({ 
            hint: null,
            action: {
                ...params.action,
                point: params.point
            }
        })
    }
    else {
        if (isInsideCanvas(params.event, params.canvas)) {
            state.mutate(insertVertex(
                params.action.shapeIndex,
                params.action.vertexAfterIndex,
                params.action.point
            ))
        }

        state.setModeState({
            action: undefined
        })
    }
}