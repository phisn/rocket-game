import { Outlet } from "react-router-dom"
import { useAppStore } from "../../common/storage/AppStore"
import { Alert } from "./Alert"

export function Layout() {
    const existsModal = useAppStore(state => state.modalCount > 0)

    return (
        <div
            className={`bg-base-300 flex min-h-screen flex-col ${
                existsModal && "h-screen overflow-hidden"
            }`}
        >
            <Outlet />
            <LayoutAlerts />
        </div>
    )
}

function LayoutAlerts() {
    const alerts = useAppStore(state => state.alerts)

    return (
        <div className="toast z-50">
            {alerts.map((alertProps, i) => (
                <Alert key={i} {...alertProps} />
            ))}
        </div>
    )
}
