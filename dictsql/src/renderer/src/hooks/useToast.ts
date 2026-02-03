import toast, { Toaster } from 'react-hot-toast'

type UseToastType = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  loading: (message: string) => string
  dismiss: (toastId: string) => void
}

/**
 * Hook personalizado para manejar las notificaciones en la aplicación.
 */
export const useToast = (): UseToastType => {
  const success = (message: string): void => {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981'
      }
    })
  }

  const error = (message: string): void => {
    toast.error(message, {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444'
      }
    })
  }

  const info = (message: string): void => {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px'
      }
    })
  }

  const loading = (message: string): string => {
    return toast.loading(message, {
      position: 'bottom-right',
      style: {
        background: '#6b7280',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px'
      }
    })
  }

  const dismiss = (toastId: string): void => {
    toast.dismiss(toastId)
  }

  return { success, error, info, loading, dismiss }
}

export { Toaster }
