# Project conventions

This is the AuraWorks assignment: reproduce the supplied Hidden Kice storefront with Next.js and load dummy textbooks from Supabase using CSR.

## Architecture

- `src/app`: route entry points, metadata, and global styles.
- `src/components/store`: presentation and store interaction composition.
- `src/hooks`: client-side request lifecycle. Keep Supabase calls out of presentation components.
- `src/lib`: database access and pure catalog utilities.
- `src/types`: domain and database contracts.
- `supabase`: schema migration, repeatable dummy seed, and permission verification queries.
- `public/images`: the three supplied image assets used by the implementation.

Prefer feature-specific components over premature universal abstractions. Introduce additional feature directories when those features exist. Enable strict TypeScript and do not use `any` to silence errors.

## Data and scope

- Fetch textbooks in the browser through `useTextbooks`; do not add a static local data fallback to hide Supabase failures.
- Keep loading, empty, error, and success states explicit.
- Abort abandoned requests and avoid updating state after unmount.
- Preserve supplied desktop artwork and extend it with responsive layouts.
- This assignment implements a catalog, filtering, product inspection, and a browser-persisted guest cart with quantity and selection controls. Authentication and real payment are outside the implemented scope.
- Enable RLS and grant anonymous users only SELECT on the public catalog. Never put secret or service-role keys in `NEXT_PUBLIC_*` variables.
- Never commit `.env.local`, `.vercel`, build output, or credentials.

## Quality and Git history

Run `pnpm check` and `pnpm build` before publishing code. Run `pnpm verify:supabase` when credentials and network access are available; verify actual browser rendering separately.

Commit each coherent change using Conventional Commits:

```text
chore: initialize project tooling
feat(store): implement textbook catalog
feat(database): add catalog schema and seed
test(catalog): cover combined filters
refactor(store): separate dialog content
docs: explain architecture and interview decisions
fix(store): correct verified UI behavior
```

Use short imperative English subjects. Do not bundle unrelated changes or amend user-authored commits. Preserve existing remote history and never force push without explicit authorization.
