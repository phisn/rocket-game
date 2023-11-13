import { create } from "zustand"
import { ComponentEvent } from "../../components/component-event"

export type Listener = React.MutableRefObject<(event: ComponentEvent) => void>

export interface EditorStore {
    selected: number[]
    setSelected: (selected: number[]) => void

    listeners: Listener[]
    addListener(listener: Listener): () => void
    publish(event: ComponentEvent): void
}

export const createEditorStore = () =>
    create<EditorStore>((set, get) => ({
        selected: [],
        setSelected: selected => set({ selected }),

        listeners: [],
        addListener: listener => {
            set(state => ({ listeners: [...state.listeners, listener] }))
            return () =>
                set(state => ({
                    listeners: state.listeners.filter(l => l !== listener),
                }))
        },
        publish: event => {
            get().listeners.forEach(l => l.current?.(event))
        },
    }))
