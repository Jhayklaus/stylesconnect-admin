import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// Flat config for ESLint 9 — replaces .eslintrc.json (`next lint` was removed
// in Next 16; `npm run lint` now invokes eslint directly).
export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Recursive globs, and `.claude/**` explicitly: git worktrees are created
  // under `.claude/worktrees/`, so a sibling checkout's build output sits
  // inside this directory and would otherwise be linted as our own source.
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    ".claude/**",
    "next-env.d.ts",
  ]),
]);
