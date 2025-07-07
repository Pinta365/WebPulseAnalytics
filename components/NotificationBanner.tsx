import { useEffect } from "preact/hooks";

export type NotificationType = "success" | "error" | "info" | "warning";

const typeClassNames: Record<NotificationType, string> = {
    success: "notification-success",
    error: "notification-error",
    info: "notification-info",
    warning: "notification-warning",
};

export function NotificationBanner(
    { message, onClose, type = "success" }: { message: string; onClose: () => void; type?: NotificationType },
) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;
    return (
        <div
            class={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
                typeClassNames[type]
            } px-6 py-3 rounded shadow-lg z-50 flex items-center space-x-4`}
        >
            <span>{message}</span>
            <button type="button" onClick={onClose} class="ml-4 font-bold">&times;</button>
        </div>
    );
}
