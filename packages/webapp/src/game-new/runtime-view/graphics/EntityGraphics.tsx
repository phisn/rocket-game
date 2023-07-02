import { EntityWith } from "runtime-framework/src/NarrowComponents"

import { EntityStore } from "../../../../../runtime-framework/src"
import { useEntitySet } from "../../../../../runtime-framework/src/useEntitySet"
import { WebappComponents } from "../webapp-runtime/WebappComponents"
import { ParticleSourceGraphic } from "./ParticleSourceGraphic"

export default function EntityGraphics(props: { store: EntityStore<WebappComponents> }) {
    const entities = useEntitySet(props.store, "graphic")
    const particleSources = useEntitySet(props.store, "particleSource")

    console.log("EntityGraphics")

    return (
        <>
            {entities.map(entity => (
                <EntityGraphic key={entity.id} entity={entity} />
            ))}

            {particleSources.map(entity => (
                <ParticleSourceGraphic key={entity.id} entity={entity} />
            ))}
        </>
    )
}

function EntityGraphic(props: { entity: EntityWith<WebappComponents, "graphic"> }) {
    return (
        <>
            <props.entity.components.graphic entity={props.entity} />
        </>
    )
}
