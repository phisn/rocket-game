export default function Overlay() {
    /*
    const [zoomIndex, zoomIn, zoomOut] = useGameStore(
        state => [state.zoomIndex, state.zoomIn, state.zoomOut],
        shallow,
    )
    */

    return (
        <>
            {/*
            <Starting />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform select-none">
                <Replay />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform p-4">
                <div className="flex select-none items-center">
                    <button
                        className={`btn btn-square btn-ghost select-none ${
                            !canZoomIn(zoomIndex) && "invisible"
                        }`}
                        onClick={zoomIn}
                    >
                        <ZoomInSvg className="h-6 w-6" />
                    </button>

                    {/*
                    <Map camera={props.camera} />
                    }

                    <button
                        className={`btn btn-square btn-ghost select-none ${
                            !canZoomOut(zoomIndex) && "invisible"
                        }`}
                        onClick={zoomOut}
                    >
                        <ZoomOutSvg className="h-6 w-6" />
                    </button>
                </div>
            </div>
            */
            /*
            <div className="absolute right-0 top-0 p-4">
                <div className="flex select-none items-center">
                    <Timer />
                </div>
            </div>
                    */}
        </>
    )
}
