import { expect, test } from "vitest"

import { createRuntimeStore } from "./RuntimeStore"

test("RuntimeStore entity", () => {
    const store = createRuntimeStore()
    const { newEntity } = store.getState()

    const entity = newEntity()

    interface Component {
        value: number
    }

    entity
        .add<Component>("test1", { value: 1 })
        .add<Component>("test2", { value: 2 })

    expect(entity.get<Component>("test1").value).toBe(1)
    expect(entity.get<Component>("test2").value).toBe(2)

    entity.remove("test1")

    expect(entity.get<Component>("test1")).toBeUndefined()
    expect(entity.get<Component>("test2").value).toBe(2)

    expect(Object.keys(entity.components).length).toBe(1)
    expect("test2" in entity.components).toBe(true)
})

test("RuntimeStore entity set", () => {
    const store = createRuntimeStore()
    const { newEntity, removeEntity } = store.getState()

    interface Component {
        value: number
    }

    newEntity()
        .add<Component>("test1", { value: 1 })
        .add<Component>("test2", { value: 2 })

    const c1 = newEntity()
        .add<Component>("test1", { value: 3 })
        .add<Component>("test2", { value: 4 })

    for (let i = 0; i < 20; i++) { newEntity() }

    const c2 = newEntity().add<Component>("test1", { value: 1 })
    const c3 = newEntity().add<Component>("test2", { value: 1 })
    const c4 = newEntity()
    const c5 = newEntity()

    const set1 = store.getState().newEntitySet("test2")
    const set2 = store.getState().newEntitySet("test1", "test2")
    const set3 = store.getState().newEntitySet("test1")
    const set4 = store.getState().newEntitySet("test3")

    newEntity()
        .add<Component>("test1", { value: 5 })
        .add<Component>("test2", { value: 6 })

    for (let i = 0; i < 20; i++) { newEntity() }

    expect([...set1].length).toBe(4)
    expect([...set2].length).toBe(3)
    expect([...set3].length).toBe(4)
    expect([...set4].length).toBe(0)

    c1.remove("test1")
    c2.remove("test1")

    expect([...set1].length).toBe(4)
    expect([...set2].length).toBe(2)
    expect([...set3].length).toBe(2)
    expect([...set4].length).toBe(0)

    c1.add<Component>("test1", { value: 1 })
    c2.add<Component>("test1", { value: 1 })
    c4.add<Component>("test3", { value: 1 })

    expect([...set1].length).toBe(4)
    expect([...set2].length).toBe(3)
    expect([...set3].length).toBe(4)
    expect([...set4].length).toBe(1)

    removeEntity(c1.id)
    removeEntity(c2.id)
    removeEntity(c3.id)
    removeEntity(c4.id)
    removeEntity(c5.id)

    expect([...set1].length).toBe(2)
    expect([...set2].length).toBe(2)
    expect([...set3].length).toBe(2)
    expect([...set4].length).toBe(0)

    expect(store.getState().entities.size).toBe(42)
})

test("RuntimeStore systems", () => {
    interface CounterComponent {
        value: number
    }

    const store = createRuntimeStore()
    const { newEntity, newEntitySet, addSystem } = store.getState()

    const counterEntities = newEntitySet("counter")

    const incrementSystem = () => {
        for (const entity of counterEntities) {
            const counter = entity.get<CounterComponent>("counter")
            counter.value++
        }
    }

    const decrementSystem = () => {
        for (const entity of counterEntities) {
            const counter = entity.get<CounterComponent>("counter")
            counter.value--
            counter.value--
        }
    }

    addSystem(incrementSystem)

    const step = () => {
        store.getState().systems.forEach(system => system())
    }

    const c1 = newEntity().add<CounterComponent>("counter", { value: 0 })
    step()
    const c2 = newEntity().add<CounterComponent>("counter", { value: 0 })

    expect([...counterEntities].length).toBe(2)
    expect(c1.get<CounterComponent>("counter").value).toBe(1)
    expect(c2.get<CounterComponent>("counter").value).toBe(0)

    for (let i = 0; i < 200; i++) { step() }

    expect(c1.get<CounterComponent>("counter").value).toBe(201)
    expect(c2.get<CounterComponent>("counter").value).toBe(200)

    addSystem(decrementSystem)

    for (let i = 0; i < 200; i++) { step() }

    expect(c1.get<CounterComponent>("counter").value).toBe(1)
    expect(c2.get<CounterComponent>("counter").value).toBe(0)
})