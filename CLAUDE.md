# CLAUDE.md — AI Context for reactswami/www1

This file provides guidance for AI coding assistants (Claude, Copilot, etc.) working in this repository.

---

## Repository Overview

This is a monorepo for a network management web application built with React, TypeScript, and Chakra UI. It is organised into two top-level folders:

- `libraries/` — Shared libraries consumed by packages
- `packages/` — Independent application micro-frontends

---

## Repository Structure

```
www1/
├── libraries/
│   ├── api/                    # API clients, entities, and internal API types (@statseeker/api)
│   ├── components/             # Shared UI component library (@statseeker/components)
│   │   └── src/
│   │       ├── Data/           # Tag, Copy, etc.
│   │       ├── Disclosure/     # Panel, Accordion wrappers
│   │       ├── Feedback/       # Alert, Spinner, Progress
│   │       ├── Form/           # Button, Switch
│   │       ├── Layout/         # All Chakra UI layout wrappers (primary import target)
│   │       ├── Overlay/        # Tooltip
│   │       ├── Typography/     # Text, Heading
│   │       └── Legacy/         # Older components pending migration
│   ├── hooks/                  # Shared React hooks (@statseeker/hooks)
│   ├── legacy/                 # Legacy libraries pending migration
│   ├── ui/                     # Icons and ui primitives (@statseeker/ui)
│   ├── utils/                  # Shared utility functions (@statseeker/utils)
│   └── tooling/                # Shared build/lint config
└── packages/
    ├── discovery/main/         # Network discovery UI (React + TanStack Router)
    ├── globalsearch/           # Global search panel (React)
    ├── nim/                    # Angular (legacy)
    ├── oa/                     # Operational analytics
    ├── scs/                    # ScanBI / Meraki poller
    └── admin_tool/             # Admin tooling
```

---

## Key Conventions

### 1. Never import directly from `@chakra-ui/react` in packages

All Chakra UI components must be consumed through the internal wrapper library, **not** imported directly from `@chakra-ui/react`. This ensures a single abstraction point for future design system changes.

**Wrong:**
```tsx
import { Flex, Box, Text } from '@chakra-ui/react';
```

**Correct:**
```tsx
import { Flex, Box, Text } from '@statseeker/components/Layout';
```

The full set of available wrappers lives in `libraries/components/src/Layout/` and includes:

| Category | Components |
|---|---|
| **Layout** | `Flex`, `Box`, `Grid`, `GridItem`, `Spacer`, `Divider` |
| **Cards** | `Card`, `CardHeader`, `CardBody`, `CardFooter` |
| **Modal** | `Modal`, `ModalOverlay`, `ModalContent`, `ModalHeader`, `ModalFooter`, `ModalBody`, `ModalCloseButton`, `useDisclosure` |
| **Form** | `Input`, `Select`, `FormControl`, `FormLabel`, `FormErrorMessage` |
| **Typography** | `Code`, `UnorderedList`, `OrderedList`, `ListItem` |
| **Feedback** | `Alert`, `AlertIcon`, `AlertTitle`, `AlertDescription`, `Spinner` |
| **Disclosure** | `Accordion`, `AccordionItem`, `AccordionButton`, `AccordionPanel`, `AccordionIcon` |

`Button` and `Switch` are wrapped under `@statseeker/components/Form` (i.e. `@statseeker/components`).  
`Text` and `Heading` are wrapped under `@statseeker/components/Typography`.

### 2. Adding new wrappers

If you need a Chakra component that doesn't yet have a wrapper, create one following this pattern inside `libraries/components/src/Layout/<ComponentName>/`:

```tsx
// ComponentName.tsx
import { ComponentName as ChakraComponentName, type ComponentNameProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>((props, ref) => {
   return <ChakraComponentName {...props} ref={ref} />;
});
```

```tsx
// index.tsx
export * from './ComponentName';
```

Then re-export it from `libraries/components/src/Layout/index.tsx`.

### 3. Component file structure

Each new component in `libraries/components/src/` should follow this structure:

```
ComponentName/
├── ComponentName.tsx         # The component implementation
├── ComponentName.stories.tsx # Storybook stories
└── index.tsx                 # Barrel re-export
```

### 4. Package import aliases

Within any `packages/` app, use these aliases (configured via tsconfig/vite):

| Alias | Resolves to |
|---|---|
| `@statseeker/components` | `libraries/components/src` |
| `@statseeker/components/Layout` | `libraries/components/src/Layout` |
| `@statseeker/api` | `libraries/api/src` |
| `@statseeker/hooks` | `libraries/hooks/src` |
| `@statseeker/utils` | `libraries/utils/src` |
| `@statseeker/ui` | `libraries/ui/src` |
| `~/` | Package-local `src/` (e.g. `packages/discovery/main/src/`) |

### 5. Routing (discovery package)

`packages/discovery/main` uses **TanStack Router** with file-based routing under `src/routes/`. Route files follow the naming convention:

- `_discovery.tsx` — layout route (wraps child routes)
- `_discovery.network.tsx` — nested route under `_discovery`
- `progress.$id.tsx` — dynamic segment route

### 6. Data fetching

All server state is managed with **TanStack Query** (`@tanstack/react-query`). Query options are centralised in `src/lib/ReactQuery/queryOptions/`. Always use the query options factory pattern rather than inline `queryFn`.

### 7. TypeScript

- All new code must be TypeScript (`.tsx` for components, `.ts` for utilities).
- Prefer `type` imports for types: `import { type Foo } from '...'`
- Avoid `any` — use `unknown` or narrow types instead.

---

## What to Avoid

- **Do not** import from `@chakra-ui/react` directly in `packages/`. Always go through the wrapper in `@statseeker/components/Layout`.
- **Do not** add new components to `Legacy/` — this folder is being phased out.
- **Do not** use default exports for React components in `libraries/components` — use named exports.
- **Do not** write inline styles — use Chakra's prop-based styling system via the wrappers.
- **Do not** create new files in `packages/nim/` — it is an Angular legacy package and is not being actively developed.

---

## Running the Project

> Build commands are managed per-package. Refer to `packages/Makefile` for available targets.

Typical development workflow for a React package (e.g. discovery):

```bash
# From packages/discovery/main
pnpm install
pnpm dev
```

---

## Testing & Linting

- Linting is configured via shared config in `libraries/tooling/`.
- Storybook stories live alongside components in `*.stories.tsx` files.
- Run Storybook from `libraries/components` to preview the design system.
