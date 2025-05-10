"use client";

import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "info" | "success" | "error";
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Determine toast color based on type
  const bgColor =
    type === "error"
      ? "bg-red-600/90"
      : type === "success"
      ? "bg-green-600/90"
      : "bg-[#e6d3a3]/90";

  const textColor =
    type === "error" || type === "success" ? "text-white" : "text-black";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-md ${bgColor} ${textColor} text-sm font-medium transition-opacity duration-300`}
    >
      {message}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<
    Array<{ id: string; props: ToastProps }>
  >([]);

  useEffect(() => {
    const handleShowToast = (e: Event) => {
      const custom = e as CustomEvent<ToastProps>;
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, props: custom.detail }]);

      // Remove toast after it expires
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, custom.detail.duration || 3000);
    };

    window.addEventListener("showToast", handleShowToast as EventListener);
    return () => {
      window.removeEventListener("showToast", handleShowToast as EventListener);
    };
  }, []);

  return (
    <>
      {children}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast.props} />
        ))}
      </div>
    </>
  );
};
