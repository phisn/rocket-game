import RAPIER from "@dimforge/rapier2d-compat"
import { Canvas, useThree } from "@react-three/fiber"
import { Suspense } from "react"
import { RuntimeSystemStack } from "runtime/src/core/RuntimeSystemStack"
import { commonGamemode } from "runtime/src/gamemode/CommonGamemode"
import tunnel from "tunnel-rat"

import { WorldModel } from "../model/world/WorldModel"
import Overlay from "./overlay/Overlay"
import { useWebappRuntime } from "./runtime-runner/useWebappRuntime"
import { RuntimeView } from "./runtime-view/RuntimeView"
import { newWebappRuntime } from "./runtime-view/webapp-runtime/WebappRuntime"
import { ProvideGameStore } from "./store/GameStore"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rapierInit = RAPIER.init()

const overlay = tunnel()

function Game(props: { world: WorldModel }) {
    const world = JSON.parse(JSON.stringify(props.world)) // dirty hack to prototype for now. fix later
    const { store, stack } = newWebappRuntime(commonGamemode, world)

    return (
        <ProvideGameStore entityStore={store}>
            <div className="h-screen w-screen select-none" style={{
                touchAction: "none", 
                userSelect: "none",

                // Prevent canvas selection on ios
                // https://github.com/playcanvas/editor/issues/160
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
                WebkitTapHighlightColor: "rgba(255,255,255,0)",
            }}>
                <Canvas style={{ 
                    background: "#000000",
                    touchAction: "none", 
                    userSelect: "none",
    
                    // Prevent canvas selection on ios
                    // https://github.com/playcanvas/editor/issues/160
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    WebkitTapHighlightColor: "rgba(255,255,255,0)",
                }} >
                    <Suspense>
                        <InnerGame stack={stack} />
                    </Suspense>
                </Canvas>
        
                <overlay.Out />
            </div>
        </ProvideGameStore>
    )
}

function InnerGame(props: { stack: RuntimeSystemStack }) {
    useWebappRuntime(props.stack)
    
    const camera = useThree(state => state.camera) as THREE.OrthographicCamera

    return (
        <>    
            <overlay.In>
                <Overlay camera={camera} />
            </overlay.In>
            
            <RuntimeView/>
        </>
    )
}

export default Game
