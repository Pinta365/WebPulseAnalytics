import { useEffect } from "preact/hooks";
import { Icon } from "components/ui/Icon.tsx";

export type NotificationType = "success" | "error" | "info" | "warning";

const dotClass: Record<NotificationType, string> = {
    success: "bg-good",
    error: "bg-bad",
    info: "bg-accent",
    warning: "bg-bad",
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
            role="status"
            aria-live="polite"
            class="fixed bottom-4 right-4 z-50 flex items-start gap-3 max-w-sm px-4 py-3 rounded-xl bg-surface border border-line shadow-pop text-[13px] text-fg"
        >
            <span class={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotClass[type]}`} />
            <span class="flex-1">{message}</span>
            <button
                type="button"
                onClick={onClose}
                class="icon-btn w-6 h-6 -mr-1.5 -mt-1"
                aria-label="Dismiss notification"
            >
                <Icon name="close" class="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
