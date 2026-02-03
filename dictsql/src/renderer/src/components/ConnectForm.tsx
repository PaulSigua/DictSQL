import { JSX, useState } from 'react'
import {
  Database,
  FileCode,
  Server,
  HardDrive,
  FolderOpen,
  ArrowRight,
  Loader2,
  LucideIcon,
  Eye,
  EyeOff
} from 'lucide-react'
import { DbConnectionConfig, TableDefinition } from '../shared/dto/database.dto'
import { Logo } from './Logo/Logo'
import { useToast } from '../hooks/useToast'
import { ChangeEvent, FormEvent } from 'react'

interface ConnectFormProps {
  onSuccess?: (tables: TableDefinition[]) => void
}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  formData,
  handleChange
}: {
  label: string
  name: string
  type?: string
  placeholder: string
  formData: DbConnectionConfig
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}): JSX.Element => (
  <div>
    <label className="block text-sm font-medium text-textMuted mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={(formData as DbConnectionConfig)[name]}
      onChange={handleChange}
      placeholder={placeholder}
      className="bg-surface border border-border rounded px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600 w-full"
    />
  </div>
)

const TypeCard = ({
  id,
  label,
  icon: Icon,
  isSelected,
  onClick
}: {
  id: string
  label: string
  icon: LucideIcon
  isSelected: boolean
  onClick: () => void
}): JSX.Element => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200
      ${
        isSelected
          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]'
          : 'bg-surface border-border text-textMuted hover:bg-surfaceHighlight hover:border-gray-500'
      }
    `}
  >
    <Icon size={20} className="mb-2" id={id} />
    <span className="text-xs font-medium">{label}</span>
  </div>
)

export function ConnectForm({ onSuccess }: ConnectFormProps): JSX.Element {
  const toast = useToast()
  const [formData, setFormData] = useState<DbConnectionConfig>({
    type: 'postgres',
    host: '',
    port: 5432,
    user: '',
    password: '',
    database: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'port' ? parseInt(e.target.value) : e.target.value
    })
  }

  const handleTypeChange = (type: string): void => {
    let defaultPort = 5432
    if (type === 'mysql') defaultPort = 3306
    if (type === 'mssql') defaultPort = 1433
    setFormData({ ...formData, type, port: defaultPort })
  }

  const handleFileSelect = async (): Promise<void> => {
    const path = await window.api.selectDatabaseFile()
    if (path) setFormData({ ...formData, database: path })
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (formData.type === 'sqlite') {
      if (!formData.database || formData.database.trim() === '') {
        toast.error('Selecciona un archivo .db primero')
        return
      }
    } else {
      if (
        !formData.host ||
        formData.host.trim() === '' ||
        !formData.port ||
        formData.port === 0 ||
        !formData.user ||
        formData.user.trim() === '' ||
        !formData.password ||
        formData.password.trim() === '' ||
        !formData.database ||
        formData.database.trim() === ''
      ) {
        toast.error('Complete todos los campos')
        return
      }
    }

    setIsLoading(true)

    setIsLoading(true)
    const loadingToast = toast.loading('Conectando a la base de datos...')

    try {
      const response = await window.api.connectDb(formData)
      toast.dismiss(loadingToast)

      if (response.success && response.data) {
        toast.success('¡Conexión exitosa!')
        if (onSuccess) onSuccess(response.data)
      } else if (response.error) {
        // Mensajes de error específicos
        const errorMsg = response.error.message || 'Error desconocido'
        const errorCode = response.error.code

        if (
          errorCode === 'DB_AUTH_FAILED' ||
          errorMsg.includes('authentication') ||
          errorMsg.includes('password')
        ) {
          toast.error('Credenciales incorrectas. Verifica tu usuario y contraseña.')
        } else if (
          errorCode === 'DB_CONNECTION_FAILED' ||
          errorMsg.includes('ECONNREFUSED') ||
          errorMsg.includes('connect')
        ) {
          toast.error('No se pudo conectar al servidor. Verifica host y puerto.')
        } else if (errorMsg.includes('database') && errorMsg.includes('does not exist')) {
          toast.error('La base de datos no existe.')
        } else if (errorMsg.includes('timeout')) {
          toast.error('Tiempo de espera agotado. El servidor no responde.')
        } else {
          toast.error(`Error: ${errorMsg}`)
        }
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast)
      const errorMsg = error instanceof Error ? error.message : String(error)
      toast.error(`Error inesperado: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-surface border border-border rounded-xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-8 w-full h-full">
          <div className="text-center mb-8">
            <div className="mb-10 text-center">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <Database className="text-primary" size={50} /> Conectar
            </h1>
            <p className="text-textMuted text-sm">Elige tu motor de base de datos</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-3">
              <TypeCard
                id="postgres"
                label="Postgres"
                icon={Database}
                isSelected={formData.type === 'postgres'}
                onClick={() => handleTypeChange('postgres')}
              />
              <TypeCard
                id="mysql"
                label="MySQL"
                icon={Server}
                isSelected={formData.type === 'mysql'}
                onClick={() => handleTypeChange('mysql')}
              />
              <TypeCard
                id="mssql"
                label="SQL Srv"
                icon={HardDrive}
                isSelected={formData.type === 'mssql'}
                onClick={() => handleTypeChange('mssql')}
              />
              <TypeCard
                id="sqlite"
                label="SQLite"
                icon={FileCode}
                isSelected={formData.type === 'sqlite'}
                onClick={() => handleTypeChange('sqlite')}
              />
            </div>
            <div className="space-y-4 animate-slide-up">
              {formData.type === 'sqlite' ? (
                <div className="bg-surfaceHighlight/50 p-4 rounded-lg border border-border border-dashed text-center">
                  <FolderOpen size={32} className="mx-auto text-textMuted mb-2" />
                  <p className="text-sm text-textMuted mb-3">Archivo local (.db, .sqlite)</p>
                  <div className="flex gap-2">
                    <input
                      value={formData.database.split(/[\\/]/).pop() || ''}
                      readOnly
                      placeholder="Ningún archivo seleccionado"
                      className="flex-1 bg-background border border-border rounded px-3 text-sm text-textMuted focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleFileSelect}
                      className="bg-surface border border-border hover:bg-surfaceHighlight text-textMuted px-4 py-2 rounded text-sm transition-colors"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <InputField
                        label="Host"
                        name="host"
                        placeholder="localhost"
                        formData={formData}
                        handleChange={handleChange}
                      />
                    </div>
                    <InputField
                      label="Puerto"
                      name="port"
                      type="number"
                      placeholder="5432"
                      formData={formData}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Usuario"
                      name="user"
                      placeholder="root"
                      formData={formData}
                      handleChange={handleChange}
                    />
                    {/* Campo de contraseña con botón de mostrar/ocultar */}
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1.5">
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••"
                          className="bg-surface border border-border rounded px-3 py-2 pr-10 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-textMuted hover:text-textPrimary transition-colors"
                          title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <InputField
                    label="Base de Datos"
                    name="database"
                    placeholder="nombre_db"
                    formData={formData}
                    handleChange={handleChange}
                  />
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all
                ${
                  isLoading
                    ? 'bg-surface border border-border text-textMuted cursor-not-allowed'
                    : 'bg-primary hover:bg-primaryHover text-white shadow-lg shadow-blue-500/20'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Conectando...
                </>
              ) : (
                <>
                  Conectar Ahora <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-textMuted opacity-50">
        DictSQL v1.0.0 &bull; Secure Local Connection
      </div>
    </div>
  )
}
