import RAPIER from "@dimforge/rapier2d-compat"
import { Canvas, useThree } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import tunnel from "tunnel-rat"

import { World } from "../model/world/World"
import Level from "./components/Level"
import { Rocket } from "./components/Rocket"
import { Shape } from "./components/Shape"
import GameCameraAnimated from "./GameCamera"
import MapOverlay from "./overlay/MapOverlay"
import { createSimulation, Simulation } from "./simulation/createSimulation"
import { useControlsRef } from "./useControlsRef"
import { GameLoopContextProvider, useGameLoop } from "./useGameLoop"
import { useLandscape } from "./useLandscape"

export interface GameProps {
    world: World
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rapierInit = RAPIER.init()
const overlay = tunnel()

function Game(props: GameProps) {
    console.trace("Game")

    return (
        <div className="h-screen w-screen">
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
                    <InnerGame {...props} />
                </Suspense>
            </Canvas>
        
            <div className="absolute top-0 left-0 p-4">
            </div>

            <overlay.Out />
        </div>
    )
}

function InnerGame(props: GameProps) {
    const simulationRef = useRef<Simulation>(
        createSimulation(props.world)
    )

    useLandscape()

    const controls = useControlsRef()

    const gameLoopContext = useGameLoop(() => {
        simulationRef.current.step({
            thrust: controls.current.thrust,
            rotation: controls.current.rotation,
            pause: controls.current.pause
        })
    })

    const camera = useThree(state => state.camera) as THREE.OrthographicCamera

    return (
        <>
            <overlay.In>
                <GameLoopContextProvider value={gameLoopContext.current}>
                    <div className="absolute bottom-0 left-1/2 p-4 transform -translate-x-1/2">
                        <MapOverlay simulation={simulationRef.current} camera={camera} />
                    </div>
                </GameLoopContextProvider>
            </overlay.In>
            
            <GameLoopContextProvider value={gameLoopContext.current}>
                <GameCameraAnimated simulation={simulationRef.current} />

                {
                    props.world.shapes.map((shape, index) =>
                        <Shape key={index} vertices={shape.vertices} />
                    )
                }

                {
                    <Rocket rocket={simulationRef.current.rocket} />
                }

                {
                    simulationRef.current.levels.map((level, index) =>
                        <Level key={index} level={level} />
                    )
                }

                {/* <Stats /> */}
            </GameLoopContextProvider>
        </>
    )
}

export default Game
