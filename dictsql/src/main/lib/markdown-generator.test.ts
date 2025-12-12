import { describe, it, expect } from 'vitest';
import { MarkdownGenerator } from './markdown-generator';
import { TableDefinition } from '../../shared/types';

describe('MarkdownGenerator', () => {
  it('debería generar un markdown correcto con una tabla simple', () => {
    const mockTables: TableDefinition[] = [
      {
        name: 'users',
        schema: 'public',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'int', isNullable: false, isPrimaryKey: true },
          { name: 'email', type: 'varchar', isNullable: false, isPrimaryKey: false }
        ]
      }
    ];

    const result = MarkdownGenerator.generate(mockTables);

    expect(result).toContain('# Documentación de Base de Datos');
    expect(result).toContain('## users'); 
    expect(result).toContain('| **id** | `int` | ✅ | No |  |'); 
  });
});