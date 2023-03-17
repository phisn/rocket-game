import { Outlet } from "react-router-dom"

import Alert from "./common/Alert"
import useGlobalStore from "./common/GlobalStore"

function App() {
    const alerts = useGlobalStore((state) => state.alerts)

    return (
        <main>
            <Outlet />
            <div className="toast">
                {
                    alerts.map((alertProps, i) => ( 
                        <Alert key={i} {...alertProps} /> 
                    )) 
                }
            </div>
        </main>
    )
}

export default App
