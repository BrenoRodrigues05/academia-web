import { useState } from "react";

export type NotificationSeverity =
    | "success"
    | "error"
    | "warning"
    | "info";

export interface NotificationState {
    open: boolean;
    message: string;
    severity: NotificationSeverity;
}

const INITIAL_STATE: NotificationState = {
    open: false,
    message: "",
    severity: "success",
};

export default function useNotification() {
    const [
        notification,
        setNotification,
    ] = useState(INITIAL_STATE);

    function show(
        message: string,
        severity: NotificationSeverity,
    ) {

        setNotification({
            open: true,
            message,
            severity,
        });

    }

    function showSuccess(
        message: string,
    ) {

        show(
            message,
            "success",
        );
    }

    function showError(
        message: string,
    ) {
        show(
            message,
            "error",
        );
    }

    function showWarning(
        message: string,
    ) {

        show(
            message,
            "warning",
        );

    }

    function showInfo(
        message: string,
    ) {

        show(
            message,
            "info",
        );

    }

    function closeNotification() {
        setNotification(
            INITIAL_STATE,
        );
    }

    return {
        notification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
    };

}