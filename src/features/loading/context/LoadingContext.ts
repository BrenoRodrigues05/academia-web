import { createContext } from "react";

type LoadingContextData = {

    show: () => void;

    hide: () => void;

};

const LoadingContext = createContext<LoadingContextData>(
    {} as LoadingContextData
);

export default LoadingContext;