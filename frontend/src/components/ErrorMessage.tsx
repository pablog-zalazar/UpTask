import type { PropsWithChildren } from "react"


export const ErrorMessage = ({ children }: PropsWithChildren) => {
    return (
        <div className="text-center my-4 bg-red-100 text-red-600 font-bolf p-3 uppercase text-sm">
            {children}
        </div>
    )
}
