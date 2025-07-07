import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { NotificationType } from "./NotificationBanner.tsx";

interface NotificationContextType {
  message: string;
  type: NotificationType;
  showNotification: (msg: string, type?: NotificationType) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider(props: { children: preact.ComponentChildren }) {
  const message = useSignal("");
  const type = useSignal<NotificationType>("success");

  const showNotification = (msg: string, t: NotificationType = "success") => {
    message.value = msg;
    type.value = t;
  };
  const clearNotification = () => {
    message.value = "";
  };

  return (
    <NotificationContext.Provider value={{
      message: message.value,
      type: type.value,
      showNotification,
      clearNotification
    }}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within a NotificationProvider");
  return ctx;
} 