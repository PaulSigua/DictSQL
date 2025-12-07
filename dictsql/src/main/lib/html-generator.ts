import { TableDefinition } from '../../shared/types';

export class HtmlGenerator {
  static generate(tables: TableDefinition[]): string {
    const date = new Date().toLocaleDateString();
    
    // Estilos CSS incrustados (limpios y para impresión)
    const styles = `
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; }
      h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
      h2 { color: #2980b9; margin-top: 40px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
      .meta { color: #7f8c8d; font-size: 0.9em; margin-bottom: 30px; }
      .toc { background: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #ddd; }
      .toc ul { list-style-type: none; padding-left: 0; }
      .toc a { text-decoration: none; color: #34495e; }
      .toc a:hover { color: #3498db; text-decoration: underline; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 0.95em; }
      th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
      th { background-color: #f2f2f2; color: #2c3e50; font-weight: 600; }
      tr:nth-child(even) { background-color: #fcfcfc; }
      .pk { color: #e67e22; font-weight: bold; }
      .fk { color: #27ae60; font-style: italic; }
      .comment-block { background: #e8f6f3; padding: 10px; border-left: 4px solid #1abc9c; margin: 10px 0; font-style: italic; }
      
      /* Ajustes para impresión */
      @media print {
        body { max-width: 100%; }
        a { text-decoration: none; color: #000; }
        .toc { display: none; } /* Ocultar índice en impresión si se desea */
        h2 { page-break-before: always; } /* Cada tabla en una página nueva opcional */
        h2:first-of-type { page-break-before: avoid; }
      }
    `;

    let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Documentación de Base de Datos</title>
      <style>${styles}</style>
    </head>
    <body>
      <h1>Documentación de Base de Datos</h1>
      <div class="meta">Generado automáticamente por DictSQL el ${date}</div>

      <div class="toc">
        <h3>Índice de Tablas</h3>
        <ul>
          ${tables.map(t => `<li><a href="#${t.name}">${t.name}</a></li>`).join('')}
        </ul>
      </div>
    `;

    tables.forEach(table => {
      html += `
      <h2 id="${table.name}">${table.name}</h2>
      `;

      if (table.comment) {
        html += `<div class="comment-block">${table.comment}</div>`;
      }

      html += `
      <table>
        <thead>
          <tr>
            <th>Columna</th>
            <th>Tipo</th>
            <th>Atributos</th>
            <th>Comentarios</th>
          </tr>
        </thead>
        <tbody>
      `;

      table.columns.forEach(col => {
        const attributes: string[] = [];
        if (col.isPrimaryKey) attributes.push('<span class="pk">PK</span>');
        if (!col.isNullable) attributes.push('Not Null');
        if (col.defaultValue) attributes.push(`Def: ${col.defaultValue}`);

        html += `
          <tr>
            <td><strong>${col.name}</strong></td>
            <td><code>${col.type}</code></td>
            <td>${attributes.join(', ')}</td>
            <td>${col.comment || ''}</td>
          </tr>
        `;
      });

      html += `
        </tbody>
      </table>
      `;

      if (table.foreignKeys.length > 0) {
        html += `<h3>Relaciones</h3><ul>`;
        table.foreignKeys.forEach(fk => {
          html += `<li><span class="fk">${fk.sourceColumn}</span> &rarr; ${fk.targetTable}.${fk.targetColumn}</li>`;
        });
        html += `</ul>`;
      }
    });

    html += `
    </body>
    </html>
    `;

    return html;
  }
}