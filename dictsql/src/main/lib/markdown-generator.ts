import { TableDefinition } from '../../shared/types';

export class MarkdownGenerator {
  static generate(tables: TableDefinition[]): string {
    const lines: string[] = [];

    // Título del Documento
    lines.push('# Documentación de Base de Datos');
    lines.push(`*Generado automáticamente por DictSQL el ${new Date().toLocaleDateString()}*`);
    lines.push('');

    // Índice (Tabla de Contenidos)
    lines.push('## Índice de Tablas');
    tables.forEach(table => {
      lines.push(`- [${table.name}](#${table.name.toLowerCase()})`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');

    // Iterar por cada tabla
    tables.forEach(table => {
      lines.push(`## ${table.name}`); // Anchor para el link
      
      if (table.comment) {
        lines.push(`> ${table.comment}`);
        lines.push('');
      }

      // Tabla de Columnas en formato Markdown
      lines.push('| Columna | Tipo | PK | Nullable | Comentarios |');
      lines.push('| :--- | :--- | :---: | :---: | :--- |');

      table.columns.forEach(col => {
        const pk = col.isPrimaryKey ? '✅' : '';
        const nullable = col.isNullable ? 'Yes' : 'No';
        const comment = col.comment || '';
        // Escapar pipes | si existen en el comentario para no romper la tabla
        const safeComment = comment.replace(/\|/g, '\\|'); 

        lines.push(`| **${col.name}** | \`${col.type}\` | ${pk} | ${nullable} | ${safeComment} |`);
      });

      lines.push('');
      
      // Sección de Relaciones (Foreign Keys)
      if (table.foreignKeys.length > 0) {
        lines.push('**Relaciones:**');
        table.foreignKeys.forEach(fk => {
          lines.push(`- \`${fk.sourceColumn}\` ➡️ apunta a \`${fk.targetTable}.${fk.targetColumn}\``);
        });
        lines.push('');
      }

      lines.push('---'); // Separador
      lines.push('');
    });

    return lines.join('\n');
  }
}