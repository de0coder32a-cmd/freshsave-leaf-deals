<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- App state is mock data in a React context (src/lib/store.tsx), persisted to localStorage — kept isolated so it can be swapped for a real backend later.
- Discount, donation and tax rules live only in src/lib/pricing.ts (pure, unit-tested); UI never re-implements them.
- Each role (customer/staff/manager) has a layout route that guards access and renders the shared header + drawer menu.
