import { BaseConnectionInput, MetadataResponse } from "./connection.interface";

export interface DbTab {
  id: string;
  title: string;
  dbType: BaseConnectionInput['type'];
  active: boolean;
  schema?: any;
  metadata?: MetadataResponse['data'];
}