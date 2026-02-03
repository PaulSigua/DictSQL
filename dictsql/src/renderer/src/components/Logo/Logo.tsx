import { Database } from 'lucide-react'
import { JSX } from 'react'

interface LogoProps {
  size?: 'sm' | 'lg' // Pequeño para TopBar, Grande para ConnectForm
}

export function Logo({ size = 'lg' }: LogoProps): JSX.Element {
  if (size === 'sm') {
    // Versión pequeña (Para la barra superior)
    return (
      <div className="flex items-center gap-1 select-none">
        <Database className="icon-brand text-primary" />
        <span className="text-lg font-bold tracking-tight">
          <span className="text-gradient text-sm font-bold">DictSQL</span>
        </span>
      </div>
    )
  }

  // Versión grande (Para el formulario de conexión)
  return (
    <div className="flex flex-col items-center select-none">
      {/* Título Principal con Gradiente */}
      <h1 className="heading-xl">
        <span className="text-gradient font-bold">DictSQL</span>
      </h1>
    </div>
  )
}
