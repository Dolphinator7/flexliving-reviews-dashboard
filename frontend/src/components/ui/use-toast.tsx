import * as React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface ToastMessage {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

interface ToastContextType {
  toasts: ToastMessage[]
  toast: (msg: Omit<ToastMessage, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = useCallback((msg: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, ...msg }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed z-50 space-y-3 bottom-5 right-5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-md text-sm border glass-card backdrop-blur-md ${
              t.variant === "destructive"
                ? "border-red-500/30 text-red-600 bg-red-50/90"
                : t.variant === "success"
                ? "border-green-500/30 text-green-600 bg-green-50/90"
                : "border-border/30 text-foreground bg-background/80"
            }`}
          >
            <strong>{t.title}</strong>
            {t.description && <div className="text-xs opacity-80">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>")
  return ctx
}

// Shortcut export (for shadcn compatibility)
export const toast = (msg: Omit<ToastMessage, "id">) => {
  const event = new CustomEvent("toast", { detail: msg })
  window.dispatchEvent(event)
}
