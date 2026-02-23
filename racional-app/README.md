# Racional — Dashboard de Inversiones

Dashboard en tiempo real para visualizar la evolución de inversiones, construido con React, TypeScript, Firebase y Chart.js. Utiliza la tipografía y paleta de colores de [Racional](https://racional.cl/) para mantener coherencia con la marca.

**Demo:** [racional-challenge.vercel.app](https://racional-challenge.vercel.app/)

El documento de Firestore (`investmentEvolutions/user1`) no incluye datos del perfil del usuario; solo la evolución del portafolio. Para documentación y contexto se asume que la titular del portafolio es **Isabel**.

## Prerequisitos

- **Node.js** >= 18
- **Yarn** >= 1.22

## Instalación y ejecución local

```bash
# 1. Instalar dependencias
yarn install

# 2. Iniciar en modo desarrollo
yarn dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite en la terminal si el 5173 está ocupado).

### Otros comandos

```bash
yarn build     # Build de producción
yarn preview   # Preview del build
yarn lint      # Linter (ESLint)
```

## Deploy en Vercel

El proyecto está configurado para desplegarse en [Vercel](https://vercel.com) con el archivo `vercel.json` en la raíz.

## Estructura del proyecto (Atomic Design)

El proyecto sigue la metodología **Atomic Design** de Brad Frost, organizando los componentes en cinco niveles de abstracción:

```
src/
├── components/
│   ├── atoms/                  # Piezas indivisibles de UI
│   │   ├── Badge/              # Pill de estado (verde/rojo/neutral)
│   │   ├── Button/             # Botón reutilizable (ghost/primary)
│   │   ├── Card/               # Contenedor con estilo glass-morphism
│   │   ├── ChangeIndicator/    # Flecha + monto + porcentaje
│   │   ├── Icon/               # Todos los íconos SVG
│   │   ├── PulseDot/           # Punto animado con pulso
│   │   └── SkeletonBlock/      # Bloque shimmer para loading
│   ├── molecules/              # Composiciones de átomos
│   │   ├── LiveIndicator/      # PulseDot + texto "En vivo"
│   │   ├── MetricCard/         # Card + label + valor + ChangeIndicator
│   │   └── SkeletonLoader/     # Composiciones skeleton (header/cards/chart)
│   ├── organisms/              # Secciones completas y autónomas
│   │   ├── DashboardHeader/    # Logo + título + LiveIndicator + timestamp
│   │   ├── MetricsGrid/        # Grilla de 4 MetricCards + lógica de cálculo
│   │   ├── PortfolioChart/     # Gráfico Chart.js con Card + Badge
│   │   ├── ErrorState/         # Panel de error + botón reintentar
│   │   └── EmptyState/         # Estado sin datos
│   ├── templates/              # Shells de layout a nivel de página
│   │   └── DashboardLayout/    # Contenedor con max-width y espaciado
│   └── pages/                  # Instancias con datos reales
│       └── DashboardPage/      # Conecta el hook y orquesta estados
├── hooks/
│   └── useInvestmentEvolution.ts   # Listener Firestore en tiempo real
├── lib/
│   └── firebase.ts                 # Inicialización de Firebase
├── utils/
│   └── formatters.ts               # Formateo de moneda, fechas y porcentajes
├── types/
│   └── investment.types.ts         # Interfaces TypeScript
└── App.tsx
```

### ¿Por qué Atomic Design?

- **Reutilización:** Los átomos (`Card`, `Badge`, `Button`) se usan en múltiples lugares sin duplicar código.
- **Testabilidad:** Cada nivel se puede probar de forma aislada.
- **Escalabilidad:** Agregar nuevas secciones al dashboard es cuestión de componer organismos existentes.
- **Claridad de responsabilidades:** Las páginas orquestan, los organismos calculan, las moléculas componen, los átomos renderizan.

## Decisiones de diseño y UX

Se utilizó Tailwind CSS para tener el diseño responsive.

### Funcionalidades

- Rango de fechas visible en el encabezado del gráfico (ej: "Ene 2019 — Feb 2026").
- Zoom al gráfico
- Tooltip informativo en cada métrica

## Listener en tiempo real

El hook `useInvestmentEvolution` utiliza `onSnapshot` de Firebase para escuchar cambios en el documento `investmentEvolutions/user1` en Firestore. Esto significa que:

1. **Primera carga:** Se muestra un skeleton loader mientras se establece la conexión.
2. **Actualizaciones en vivo:** Cuando el documento cambia en Firestore (desde cualquier fuente), el dashboard se actualiza automáticamente sin recargar la página. El badge "En vivo" indica que esta conexión está activa.
3. **Limpieza automática:** Al desmontar el componente, el listener se desuscribe para evitar memory leaks.
4. **Manejo de errores:** Si la conexión se pierde o el documento no existe, se muestra un estado con opción de reintentar.

### Estructura del documento

```json
{
  "array": [
    {
      "date": "Timestamp (Firestore)",
      "portfolioValue": "number",
      "dailyReturn": "number",
      "contributions": "number",
      "portfolioIndex": "number"
    }
  ]
}
```

No existe campo `currency` en el documento; se usa CLP por defecto basándose en el rango de valores.

## Uso de Inteligencia Artificial

Se utilizó **Cursor** (modelo Opus 4.6) como herramienta durante el desarrollo del dashboard.

### Flujo de trabajo

1. **Definición del prompt inicial:** Se redactó un prompt técnico detallado con todos los requisitos funcionales, stack tecnológico, estructura de archivos, modelo de datos, reglas de diseño UX y restricciones de implementación. Este prompt funcionó como un brief técnico que establece el contexto completo antes de generar código.

2. **Planificación antes de ejecución:** Antes de escribir código, se usó el modo Plan de Cursor para generar y revisar un plan de implementación estructurado. Esto permitió validar la arquitectura, el orden de dependencias entre archivos, y las decisiones técnicas antes de comprometerse con la implementación.

3. **Generación iterativa:** El código se generó paso a paso siguiendo el plan, verificando la compilación TypeScript después de cada grupo de archivos. No se aceptó código sin verificación — cada archivo se evaluó contra los requisitos y las mejores prácticas del ecosistema React/TypeScript.

### Decisiones tomadas con apoyo de IA

- **Scaffolding inicial de componentes:** La IA generó la estructura base de todos los componentes siguiendo el plan aprobado, respetando las convenciones de TypeScript estricto y separación de responsabilidades.

### Decisiones tomadas por criterio propio

- **Arquitectura Atomic Design:** Se decidió refactorizar la estructura plana inicial de componentes hacia Atomic Design (atoms → molecules → organisms → templates → pages) para demostrar un enfoque escalable y profesional de organización de código. Esta decisión se tomó después de la implementación inicial, evaluando que la estructura plana no reflejaba las mejores prácticas de un proyecto frontend en producción.
- **Paleta de colores y tipografía de Racional:** Se extrajeron los colores de marca directamente del CSS de [racional.cl](https://racional.cl/). Esta decisión busca que el dashboard se sienta parte del ecosistema real del producto, no un ejercicio genérico.
- **Formateo con `Intl.NumberFormat`:** Se eligió usar la API nativa de internacionalización del browser en lugar de librerías externas para reducir dependencias y aprovechar el soporte nativo de locale `es-CL` para pesos chilenos.
- **Rango de fechas en el gráfico:** Se agregó la visualización del rango temporal para dar contexto sobre la antigüedad de los datos, dado que el badge "En vivo" se refiere a la conexión en tiempo real y no a que los datos sean recientes.
