export interface DbTab {
  id: string;
  title: string;
  connectionType: 'PostgreSQL' | 'SQLServer' | 'MySQL' | 'Oracle' | string;
  connectionData: any;
  active: boolean;
}