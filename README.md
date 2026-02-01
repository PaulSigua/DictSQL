# DictSQL
DictSQL is a Multiplatform, open-source application for documenting databases and creating data dictionaries

## Directories:

``` bash
dictsql/
├── src/
│   ├── main/              # Proceso principal (Node.js)
│   │   ├── index.ts       # Entry point, IPC handlers
│   │   └── lib/
│   │       ├── adapters/  # Adaptadores de BD (patrón Strategy)
│   │       │   ├── postgres-adapter.ts
│   │       │   ├── mysql-adapter.ts
│   │       │   ├── sqlite-adapter.ts
│   │       │   └── mssql-adapter.ts
│   │       ├── db-adapter.ts          # Clase abstracta base
│   │       ├── markdown-generator.ts  # Exportación MD
│   │       └── html-generator.ts      # Exportación HTML/PDF
│   │
│   ├── preload/           # Capa de seguridad (Context Bridge)
│   │   └── index.ts       # Expone APIs al renderer
│   │
│   ├── renderer/          # Proceso de renderizado (React)
│   │   └── src/
│   │       ├── App.tsx              # Componente principal
│   │       ├── components/
│   │       │   ├── ConnectForm.tsx      # Formulario de conexión
│   │       │   ├── DiagramView.tsx      # Vista del diagrama ER
│   │       │   ├── PropertiesPanel.tsx  # Panel de edición
│   │       │   └── TopBar.tsx           # Barra de herramientas
│   │       └── utils/
│   │           └── layout.ts            # Layout automático (Dagre)
│   │
│   └── shared/            # Tipos compartidos
│       └── types.ts       # Interfaces TypeScript
│
├── electron.vite.config.ts   # Configuración de build
├── package.json

```

## ESLINT implemented

```bash
# Run lint
pnpm run lint

# Fix lint errors
pnpm run lint:fix
```


