import { createContext, useContext } from "react"
import { StoreApi, UseBoundStore, create, useStore } from "zustand"
import { GamemodeState, WorldState } from "../models/WorldState"

interface State {
    world: WorldState

    done: Mutation[]
    todo: Mutation[]
}

export interface Mutation {
    do: (world: WorldState) => void
    undo: (world: WorldState) => void
}

export type MutationGenerator = Mutation | ((world: WorldState) => MutationGenerator)

interface WorldStore {
    gamemode?: GamemodeState

    state: State
    canUndo: boolean
    canRedo: boolean

    running: boolean

    mutation: (mutation: MutationGenerator) => void
    redo: () => void
    undo: () => void

    selectGamemode: (gamemode: GamemodeState) => void

    run: () => void
    stop: () => void
}

const createEditorStore = (world: WorldState) =>
    create<WorldStore>((set, get) => ({
        state: {
            world,
            todo: [],
            done: [],
        },
        canUndo: false,
        canRedo: false,
        running: false,
        mutation(generator) {
            while (generator instanceof Function) {
                generator = generator(get().state.world)
            }

            const mutation = generator

            mutation.do(get().state.world)

            set(store => ({
                state: {
                    world: store.state.world,
                    todo: [],
                    done: [...store.state.done, mutation],
                },
                canRedo: false,
                canUndo: true,
            }))
        },
        redo() {
            const last = get().state.todo[get().state.todo.length - 1]
            last.do(get().state.world)

            set(store => ({
                state: {
                    world: store.state.world,
                    todo: [...store.state.todo.slice(0, store.state.todo.length - 1)],
                    done: [...store.state.done, last],
                },
                canRedo: store.state.todo.length > 1,
                canUndo: true,
            }))
        },
        undo() {
            const last = get().state.done[get().state.done.length - 1]
            last.undo(get().state.world)

            set(store => ({
                state: {
                    world: store.state.world,
                    todo: [...store.state.todo, last],
                    done: [...store.state.done.slice(0, store.state.done.length - 1)],
                },
                canRedo: true,
                canUndo: store.state.done.length > 1,
            }))
        },

        selectGamemode(gamemode: GamemodeState) {
            set({ gamemode })
        },

        run() {
            set({ running: true })
        },

        stop() {
            set({ running: false })
        },
    }))

const Context = createContext<UseBoundStore<StoreApi<WorldStore>>>(null!)

export function ProvideWorldStore(props: { children: React.ReactNode; world: WorldState }) {
    const store = createEditorStore(props.world)
    return <Context.Provider value={store}>{props.children}</Context.Provider>
}

export function useEditorStore<U>(
    selector: (state: WorldStore) => U,
    equalityFn?: (a: U, b: U) => boolean,
) {
    return useStore(useContext(Context), selector, equalityFn)
}
