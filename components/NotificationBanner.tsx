import { useEffect } from "preact/hooks";

export function NotificationBanner({ message, onClose }: { message: string; onClose: () => void }) {
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;
    return (
        <div class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center space-x-4">
            <span>{message}</span>
            <button type="button" onClick={onClose} class="ml-4 text-white font-bold">&times;</button>
        </div>
    );
}
