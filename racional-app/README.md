# Racional — Dashboard de Inversiones

Dashboard en tiempo real para visualizar la evolución de inversiones, construido con React, TypeScript, Firebase y Chart.js. Utiliza la tipografía y paleta de colores de [Racional](https://racional.cl/) para mantener coherencia con la marca.

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

La aplicación estará disponible en `http://localhost:5173`.

### Otros comandos

```bash
yarn build     # Build de producción
yarn preview   # Preview del build
yarn lint      # Linter (ESLint)
```

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

### Identidad visual de Racional

Se extrajeron la tipografía y paleta de colores directamente del sitio [racional.cl](https://racional.cl/) para que el dashboard se sienta como parte del producto real:

| Token | Color | Uso |
|---|---|---|
| Brand green | `#0dc299` | Acento principal, indicadores positivos, elementos interactivos |
| Brand green light | `#65d6b0` | Texto de badges, acentos secundarios |
| Brand green vivid | `#18daae` | Estados hover |
| Brand red | `#c6443d` | Indicadores negativos, errores |
| Brand yellow | `#ffad28` | Advertencias (disponible para uso futuro) |
| Surface | `#0f1219` | Fondo de página |
| Surface card | `#162032` | Fondo de tarjetas |

**Tipografía:**
- **Product Sans** (Regular/Medium/Bold): Fuente principal de UI, self-hosted desde los mismos TTFs que usa racional.cl.
- **Rozha One**: Fuente display para el título "Racional", idéntica a la del sitio.

### Tema oscuro

Se eligió un tema oscuro porque los dashboards financieros y de inversión se perciben más profesionales y reducen la fatiga visual durante sesiones prolongadas de monitoreo. Es la convención estándar en plataformas fintech como Bloomberg Terminal, Robinhood y TradingView.

### Tailwind CSS v4

Se eligió Tailwind CSS sobre CSS Modules por:
- **Velocidad de desarrollo:** Las clases utilitarias permiten iterar rápidamente sin saltar entre archivos.
- **Consistencia:** El sistema de diseño built-in (espaciado, colores, breakpoints) produce un resultado cohesivo.
- **Responsive:** Las utilidades `sm:`, `lg:` simplifican el diseño adaptativo sin media queries manuales.

### Diseño responsive

- **Desktop (≥1024px):** 4 tarjetas de métricas en una fila, gráfico ancho completo.
- **Tablet (≥640px):** 2 tarjetas por fila.
- **Mobile (<640px):** 1 tarjeta por fila, gráfico con scroll horizontal.

### Gráfico

- Línea con relleno de área y gradiente para dar profundidad visual.
- Color dinámico: verde si la tendencia es positiva (último valor > primer valor), rojo si es negativa.
- Curva suavizada (`tension: 0.4`) para una lectura visual más agradable.
- Tooltip personalizado mostrando fecha completa y valor formateado.
- Rango de fechas visible en el encabezado del gráfico (ej: "Ene 2019 — Feb 2026").
- Solo se registran los componentes de Chart.js necesarios (tree-shaking).

### Tarjetas de métricas

- Efecto hover sutil con transición en bordes (glow verde de marca) y fondo.
- La variación diaria muestra tanto el monto absoluto como el porcentaje, con indicador visual verde/rojo.
- Estilo glass-morphism con bordes semi-transparentes.

## Listener en tiempo real

El hook `useInvestmentEvolution` utiliza `onSnapshot` de Firebase v9 para escuchar cambios en el documento `investmentEvolutions/user1` en Firestore. Esto significa que:

1. **Primera carga:** Se muestra un skeleton loader mientras se establece la conexión.
2. **Actualizaciones en vivo:** Cuando el documento cambia en Firestore (desde cualquier fuente), el dashboard se actualiza automáticamente sin recargar la página. El badge "En vivo" indica que esta conexión está activa.
3. **Limpieza automática:** Al desmontar el componente, el listener se desuscribe para evitar memory leaks.
4. **Manejo de errores:** Si la conexión se pierde o el documento no existe, se muestra un estado apropiado con opción de reintentar.

### Flujo de datos

```
Firestore (onSnapshot) → useInvestmentEvolution → DashboardPage → Organisms → Molecules → Atoms
```

El hook es completamente independiente de la UI: solo se encarga de obtener, parsear y ordenar los datos. Todo el formateo visual ocurre en `formatters.ts` y en los componentes.

## Cómo adaptar la estructura de datos

Si la estructura real del documento Firestore es diferente a la asumida, el hook `useInvestmentEvolution.ts` está diseñado para facilitar la adaptación. En la parte superior del archivo hay un bloque de comentarios detallado con instrucciones.

### Estructura real del documento

```json
{
  "array": [
    {
      "date": "Timestamp (Firestore)",
      "portfolioValue": 1000000,
      "dailyReturn": 0.0047,
      "contributions": 1000000,
      "portfolioIndex": 100
    }
  ]
}
```

No existe campo `currency` en el documento; se usa CLP por defecto basándose en el rango de valores.

### Qué cambiar

| Cambio necesario | Qué modificar |
|---|---|
| El array se llama diferente (ej: `"history"`) | Cambiar `EVOLUTION_FIELD` |
| Las entradas tienen keys diferentes (ej: `"timestamp"`, `"amount"`) | Modificar la función `mapEntry` |
| Se agrega un campo de moneda | Cambiar `CURRENCY_FIELD` y la extracción en `parseDocument` |
| El documento está en otra colección/ID | Cambiar `COLLECTION` y `DOCUMENT_ID` |
| Las fechas vienen en otro formato | Modificar la función `toISODate` |

## Uso de Inteligencia Artificial

Se utilizó **Cursor** (IDE con IA integrada, basado en Claude) como herramienta de apoyo durante el desarrollo del dashboard.

### Flujo de trabajo

1. **Definición del prompt inicial:** Se redactó un prompt técnico detallado con todos los requisitos funcionales, stack tecnológico, estructura de archivos, modelo de datos, reglas de diseño UX y restricciones de implementación. Este prompt funcionó como un brief técnico que establece el contexto completo antes de generar código.

2. **Planificación antes de ejecución:** Antes de escribir código, se usó el modo Plan de Cursor para generar y revisar un plan de implementación estructurado. Esto permitió validar la arquitectura, el orden de dependencias entre archivos, y las decisiones técnicas antes de comprometerse con la implementación.

3. **Generación iterativa:** El código se generó paso a paso siguiendo el plan, verificando la compilación TypeScript después de cada grupo de archivos. No se aceptó código sin verificación — cada archivo se evaluó contra los requisitos y las mejores prácticas del ecosistema React/TypeScript.

4. **Adaptación a datos reales:** Al conectar con Firestore, la estructura del documento difería de la asumida en el prompt (campo `array` en vez de `evolution`, Timestamps en vez de strings, `portfolioValue` en vez de `value`, sin campo `currency`). Se usó la API REST de Firestore para inspeccionar el documento real y la IA adaptó el hook sin modificar la arquitectura.

5. **Verificación continua:** Se ejecutó `yarn build` después de cada paso significativo para detectar errores de tipos tempranamente y corregirlos antes de avanzar.

### Decisiones tomadas con apoyo de IA

- **Tailwind CSS v4 sobre CSS Modules:** La IA recomendó Tailwind por producir resultados más consistentes y profesionales para dashboards oscuros con diseño responsive, y se validó que fuera coherente con el ecosistema actual.
- **Registro selectivo de Chart.js:** La IA sugirió importar y registrar solo los componentes necesarios (`LineElement`, `PointElement`, etc.) para optimizar el bundle size.
- **Estructura del hook adaptable:** El diseño con constantes configurables (`EVOLUTION_FIELD`, `CURRENCY_FIELD`) y función `mapEntry` separada fue una decisión conjunta para facilitar la adaptación a estructuras de datos reales.
- **Scaffolding inicial de componentes:** La IA generó la estructura base de todos los componentes siguiendo el plan aprobado, respetando las convenciones de TypeScript estricto y separación de responsabilidades.

### Decisiones tomadas por criterio propio

- **Arquitectura Atomic Design:** Se decidió refactorizar la estructura plana inicial de componentes hacia Atomic Design (atoms → molecules → organisms → templates → pages) para demostrar un enfoque escalable y profesional de organización de código. Esta decisión se tomó después de la implementación inicial, evaluando que la estructura plana no reflejaba las mejores prácticas de un proyecto frontend en producción.
- **Paleta de colores y tipografía de Racional:** Se extrajeron los colores de marca (`#0dc299`, `#c6443d`, `#18273a`) y las fuentes (Product Sans, Rozha One) directamente del CSS de [racional.cl](https://racional.cl/), incluyendo la descarga de los archivos TTF para self-hosting. Esta decisión busca que el dashboard se sienta parte del ecosistema real del producto, no un ejercicio genérico.
- **Formateo con `Intl.NumberFormat`:** Se eligió usar la API nativa de internacionalización del browser en lugar de librerías externas (como `numeral.js`) para reducir dependencias y aprovechar el soporte nativo de locale `es-CL` para pesos chilenos.
- **Texto en español, código en inglés:** Decisión deliberada para un producto chileno con código mantenible por equipos internacionales.
- **Rango de fechas en el gráfico:** Se agregó la visualización del rango temporal (ej: "Ene 2019 — Feb 2026") para dar contexto sobre la antigüedad de los datos, dado que el badge "En vivo" se refiere a la conexión en tiempo real y no a que los datos sean recientes.
