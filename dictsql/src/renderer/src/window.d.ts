import { DbConnectionConfig, DatabaseSchema } from '../../shared/types';

export interface IElectronAPI {
  loadPreferences: () => Promise<void>;
}

export interface ICustomAPI {
  connectDb: (config: DbConnectionConfig) => Promise<{ success: boolean; data?: DatabaseSchema; error?: string }>;
  saveProject: (content: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  openProject: () => Promise<{ success: boolean; data?: any; filePath?: string; error?: string }>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
    api: ICustomAPI; // <-- Aquí registramos nuestra API personalizada
  }
}