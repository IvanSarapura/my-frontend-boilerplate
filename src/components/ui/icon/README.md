# Icon System

Sistema de íconos **tree-shakeable** del boilerplate. Cada ícono es un módulo independiente con un named export. Sólo los íconos que tu código realmente importa llegan al bundle de producción.

## Filosofía

- **1 ícono = 1 archivo = 1 named export.** Sin Records monolíticos, sin runtime registry, sin lookup por string.
- **Tree-shaking nativo.** El bundler (Webpack/Turbopack) elimina los íconos no referenciados en build time.
- **Sin lazy/Suspense.** Los íconos son átomos sincrónicos; lazy loading introduce regresiones de CWV en componentes críticos (modal, alert, toaster).
- **Patrón estándar de industria 2026** (lucide-react, @radix-ui/react-icons, @heroicons/react).

## Estructura

```
icon/
├─ icon-base.tsx          # Wrapper SVG compartido (size, aria, viewBox, currentColor)
├─ icon-base.module.css   # Estilos base del SVG
├─ types.ts               # IconBaseProps, IconComponent
├─ icons/                 # 171 módulos, uno por ícono
│   ├─ close.tsx
│   ├─ chevron-down.tsx
│   └─ …
├─ index.ts               # Barrel público — re-exporta IconBase + los 171 componentes
├─ icons-registry.dev.ts  # Catálogo enumerable, DEV-ONLY (test + Storybook)
├─ icon-base.test.tsx     # Tests del wrapper
├─ icons.test.tsx         # Tests sobre el catálogo completo
└─ icon.stories.tsx       # Gallery de Storybook
```

## Uso

### Importar un ícono

```tsx
import { CloseIcon } from '@/components/ui/icon';

<CloseIcon size={20} aria-label="Cerrar" />;
```

### Map variante → ícono (patrón Alert/Toaster/ThemeToggle)

```tsx
import {
  ErrorIcon,
  type IconComponent,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@/components/ui/icon';

const VARIANT_ICONS: Record<Variant, IconComponent> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const VariantIcon = VARIANT_ICONS[variant];
return <VariantIcon size={20} />;
```

> Almacena **referencias a componentes**, no strings. Esto preserva el tree-shaking: sólo los íconos referenciados explícitamente en el map entran al bundle.

### Usar `IconBase` directamente (raro)

Reservado para casos donde necesites un wrapper SVG ad-hoc (p. ej. un ícono one-off que no merece un módulo). Para todo lo demás, usa los componentes nominales del barrel.

```tsx
import { IconBase } from '@/components/ui/icon';

<IconBase aria-label="Decorativo">
  <path d="…" />
</IconBase>;
```

## Añadir un ícono nuevo

1. Crear `icons/<kebab-name>.tsx` siguiendo la plantilla:

   ```tsx
   import { IconBase } from '../icon-base';
   import type { IconComponent } from '../types';

   export const MyNewIcon: IconComponent = props => (
     <IconBase {...props}>
       <path d="…" />
     </IconBase>
   );
   ```

2. Añadir el re-export en `index.ts`, ordenado alfabéticamente:

   ```ts
   export { MyNewIcon } from './icons/my-new';
   ```

3. Añadir la entrada en `icons-registry.dev.ts` (mantiene Storybook Gallery y test sincronizados).

Los tests y la Gallery se actualizan solos vía `ICON_CATALOG` — no hay que tocar `icons.test.tsx` ni `icon.stories.tsx`.

## Convenciones de SVG

- **`viewBox` forzado:** `0 0 24 24`. Cualquier ícono con otra escala se rechaza.
- **Color:** `currentColor` siempre. El wrapper `IconBase` aplica `stroke="currentColor"`.
- **Familias coexistentes:**
  - **Stroke / Feather:** hijos sin atributos `fill`. El wrapper rinde el outline.
  - **Fill / Material:** cada `<path>` debe tener `fill="currentColor" stroke="none"` (para evitar el doble contorno).
- **Atributos JSX:** `fill-rule` → `fillRule`, `clip-rule` → `clipRule`.
- **Multi-path:** sólo enumerar los elementos como hijos. **No** envolver en `<>…</>` (el wrapper acepta cualquier `ReactNode`).

## Naming

- **Filename:** kebab-case → `bookmark-filled.tsx`, `chevron-down.tsx`.
- **Export:** PascalCase + sufijo `Icon` → `BookmarkFilledIcon`, `ChevronDownIcon`.
- **Tipo:** `IconComponent` (todos uniformes).

## Prohibido

- **Importar `icons-registry.dev` desde código de runtime.** ESLint falla el build. El catálogo enumerable existe exclusivamente para tests y Storybook (ambos dev-only). Importarlo desde producción anula el tree-shaking — el bundle volvería a llevar los 171 íconos.
- **Re-introducir un Record monolítico** `Record<string, ReactNode>` o similar. El registry-as-object pattern hace imposible el tree-shaking; por eso este sistema existe.
- **Lazy loading individual por ícono** (`next/dynamic`, `React.lazy` envolviendo cada `*Icon`). Es un anti-patrón para UI atoms: los íconos viven en componentes críticos (modal, alert, toaster); diferirlos introduce Suspense boundaries, layout shift y regresiones de LCP/INP.

## Referencias

- **lucide-react** — patrón de named exports puro. Cada ícono = 1 export.
- **@radix-ui/react-icons**, **@heroicons/react** — mismo patrón.
- **Webpack 5 Tree Shaking** — named exports + sin side-effects = eliminación garantizada de exports no usados.
- **Next.js 16** — Turbopack y Webpack ambos honran este contrato para imports/exports estáticos.
