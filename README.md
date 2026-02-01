# DictSQL
DictSQL is a Multiplatform, open-source application for documenting databases and creating data dictionaries

## Directories:

``` bash
dictsql/
├── src/
│   ├── main/                          # Proceso Principal (Node.js)
│   │   ├── index.ts                   # ✨ IPC Handlers (simplificado)
│   │   ├── core/                      # 🆕 Núcleo de la aplicación
│   │   │   ├── adapters/              # Adaptadores de BD
│   │   │   │   ├── postgres-adapter.ts
│   │   │   │   ├── sqlite-adapter.ts
│   │   │   │   ├── mysql-adapter.ts
│   │   │   │   └── mssql-adapter.ts
│   │   │   ├── generators/            # Generadores de documentación
│   │   │   │   ├── markdown-generator.ts
│   │   │   │   ├── html-generator.ts
│   │   │   │   └── markdown-generator.test.ts
│   │   │   ├── db-adapter.ts          # Clase base abstracta
│   │   │   ├── logger.ts              # 🔒 Sistema de logging
│   │   │   ├── error-handler.ts       # 🔒 Manejo de errores
│   │   │   └── validators.ts          # 🔒 Validación de inputs
│   │   └── services/                  # 🆕 Capa de servicios
│   │       ├── database.service.ts    # Lógica de BD
│   │       └── file.service.ts        # Lógica de archivos
│   │
│   ├── renderer/                      # Proceso Renderer (React)
│   │   └── src/
│   │       ├── App.tsx                # Componente principal
│   │       ├── main.tsx               # Entry point
│   │       ├── components/
│   │       │   ├── ConnectForm.tsx    # Formulario de conexión
│   │       │   ├── PropertiesPanel.tsx # Panel de propiedades
│   │       │   ├── Versions.tsx       # Info de versiones
│   │       │   ├── Logo/
│   │       │   │   └── Logo.tsx       # 🆕 Logo componente
│   │       │   └── diagram/           # 🆕 Componentes de diagrama
│   │       │       ├── DiagramView.tsx
│   │       │       └── TableNode.tsx
│   │       ├── layouts/               # 🆕 Layouts
│   │       │   └── TopBar.tsx         # Barra superior
│   │       └── utils/
│   │           └── layout.ts          # Algoritmo de layout (Dagre)
│   │
│   ├── shared/                        # Código compartido
│   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── database.dto.ts
│   │   │   ├── error.dto.ts
│   │   │   └── logger.dto.ts          # 🆕 DTO para metadata
│   │   ├── constants/                 # 🆕 Constantes
│   │   │   └── error-codes.ts
│   │   └── types.ts                   # Tipos compartidos
│   │
│   └── preload/                       # Preload script
│       └── index.ts                   # Context bridge
│
├── package.json
├── tsconfig.json
└── electron.vite.config.ts

```

## ESLINT implemented

```bash
# Run lint
pnpm run lint

# Fix lint errors
pnpm run lint:fix
```


