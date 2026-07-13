import type { ReactNode } from "react";

export interface CrudColumn<T> {

    field: keyof T | string;

    header: string;

    align?: "left" | "center" | "right";

    width?: number | string;

    render?: (row: T) => ReactNode;

}