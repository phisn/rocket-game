import { Link } from "react-router-dom"
import { NavbarUtility } from "./NavbarUtility"

export function Navbar() {
    return (
        <div className="row-start-1 flex w-full justify-between border-b-0 border-zinc-300  sm:px-8">
            <div className="cursor-default select-none p-2 text-xl text-zinc-300">
                <Link
                    to="/campaign"
                    className="btn btn-ghost bg-black bg-opacity-50 text-lg backdrop-blur-xl"
                >
                    Rocket Game
                </Link>
            </div>
            <div className="flex self-center rounded-2xl bg-black bg-opacity-50 backdrop-blur-xl">
                <NavbarUtility />
            </div>
        </div>
    )
}
