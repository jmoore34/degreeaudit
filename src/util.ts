import {useEffect, useReducer} from "react";

// react hook to rerender on window resize
export function useRerenderOnResize() {
    const [, forceRerender] = useReducer(x => x+1, 0)
    useEffect(() => {
        window.addEventListener("resize", forceRerender)
        return () => {
            window.removeEventListener("resize", forceRerender)
        }
    }, [])
}