"use client";

import { useCallback } from "react";

type ToastType = "success" | "danger" | "info" | "warning";

interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

export const useInfoMsg = () => {
  const showToast = useCallback((message: string, type: ToastType) => {
    // Create toast container if it doesn't exist
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none";
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = "pointer-events-auto animate-slideInRight";

    // Get colors and icons based on type
    const getToastStyles = (toastType: ToastType) => {
      switch (toastType) {
        case "success":
          return {
            bg: "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700",
            icon: "✓",
            title: "Success",
          };
        case "danger":
          return {
            bg: "bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700",
            icon: "✕",
            title: "Error",
          };
        case "info":
          return {
            bg: "bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700",
            icon: "ℹ",
            title: "Info",
          };
        case "warning":
          return {
            bg: "bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700",
            icon: "⚠",
            title: "Warning",
          };
        default:
          return {
            bg: "bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700",
            icon: "ℹ",
            title: "Info",
          };
      }
    };

    const styles = getToastStyles(type);

    toast.innerHTML = `
      <div class="flex items-start gap-3 ${styles.bg} text-white px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-[400px] backdrop-blur-sm border border-white/20">
        <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 font-bold text-lg">
          ${styles.icon}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-sm mb-1">${styles.title}</div>
          <div class="text-sm opacity-90 break-words">${message}</div>
        </div>
        <button class="toast-close flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-colors text-lg leading-none ml-2">
          ×
        </button>
      </div>
    `;

    container.appendChild(toast);

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close");
    const removeToast = () => {
      toast.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        toast.remove();
        // Remove container if no toasts left
        if (container && container.children.length === 0) {
          container.remove();
        }
      }, 300);
    };

    closeBtn?.addEventListener("click", removeToast);

    // Auto-hide after 5 seconds
    setTimeout(removeToast, 5000);
  }, []);

  return showToast;
};

// Add CSS animations to global styles if not already present
if (typeof window !== "undefined" && !document.getElementById("toast-animations")) {
  const style = document.createElement("style");
  style.id = "toast-animations";
  style.innerHTML = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    .animate-slideInRight {
      animation: slideInRight 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}