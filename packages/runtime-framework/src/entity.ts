import { NarrowProperties } from "./narrow-properties"

export type EntityId = number

export interface Entity<Components extends object> {
    get components(): Components
    get id(): EntityId

    has<T extends (keyof Components)[]>(
        ...components: [...T]
    ): this is Entity<NarrowProperties<Components, (typeof components)[number]>>
    extend<T>(): this is Entity<Components & T>

    toString(): string
}

export type EmptyComponent = Record<string, never>
