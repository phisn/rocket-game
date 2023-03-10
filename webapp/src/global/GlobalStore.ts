import { create } from "zustand"
import { AlertProps } from "./Alert"

export interface GlobalStore {
    alerts: AlertProps[]
    newAlert: (alert: AlertProps) => void
}

const useGlobalStore = create<GlobalStore>((set, get) => ({
    alerts: [],
    newAlert: (alert: AlertProps) => {
        setTimeout(() => {
            set(state => ({
                alerts: state.alerts.filter(a => a !== alert)
            }))
        }, 2000)

        set(state => ({
            alerts: [...state.alerts, alert]
        }))
    }
}))

export default useGlobalStore
