import { DbConnectionConfig, DatabaseSchema } from '../../shared/types';

export interface IElectronAPI {
  loadPreferences: () => Promise<void>;
}

export interface ICustomAPI {
  connectDb: (config: DbConnectionConfig) => Promise<{ success: boolean; data?: DatabaseSchema; error?: string }>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
    api: ICustomAPI; // <-- Aquí registramos nuestra API personalizada
  }
}