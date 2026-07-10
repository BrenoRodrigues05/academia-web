import {
useState,
} from "react";
import type { ReactNode } from "react";

import LoadingContext from "./LoadingContext";

import LoadingOverlay from "../components/LoadingOverlay";

type Props = {

children: ReactNode;

};

export default function LoadingProvider({

children,

}: Props) {

const [loading, setLoading] = useState(false);

function show() {

setLoading(true);

}

function hide() {

setLoading(false);

}

return (

<LoadingContext.Provider

value={{

show,

hide,

}}

>

{children}

<LoadingOverlay open={loading} />

</LoadingContext.Provider>

);

}