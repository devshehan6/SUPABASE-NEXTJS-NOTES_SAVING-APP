## 1. SQL Migration File

Supabase එකේ migrations use කරනවා නම්, `supabase/migrations/` folder එකේ මේක දාන්න. නැත්නම් SQL Editor එකේ run කරන්නත් පුළුවන්.

**File: `supabase/migrations/20250101000000_create_notes.sql`**

```sql
-- ============================================================
-- Migration: Create notes table with RLS
-- ============================================================

-- 1. Create the notes table
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text default '',
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.notes enable row level security;

-- 3. RLS Policies
-- SELECT: users can only view their own notes
create policy "Users can view their own notes"
on public.notes
for select
to authenticated
using ( (select auth.uid()) = user_id );

-- INSERT: users can only insert notes with their own user_id
create policy "Users can insert their own notes"
on public.notes
for insert
to authenticated
with check ( (select auth.uid()) = user_id );

-- UPDATE: users can only update their own notes
create policy "Users can update their own notes"
on public.notes
for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

-- DELETE: users can only delete their own notes
create policy "Users can delete their own notes"
on public.notes
for delete
to authenticated
using ( (select auth.uid()) = user_id );
```

---

## 2. `README.md` — Full Project Summary

Project root එකේ `README.md` කියලා save කරන්න:

```markdown
# Edu Notes App

A secure, full-stack notes application built with **Next.js 16 (App Router)** and **Supabase**. This project was built as a learning exercise to understand Supabase authentication, Row Level Security (RLS), and the Next.js Server Actions pattern.

Every user can only see, create, edit, and delete **their own notes** — enforced at the database level, not just in the app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| Styling | Tailwind CSS |
| Runtime | Node.js |

---

## Features

- ✅ Email/password sign up and sign in (Supabase Auth)
- ✅ Email confirmation flow
- ✅ List notes (read)
- ✅ Create note (create)
- ✅ Edit note (update)
- ✅ Delete note (delete)
- ✅ Row Level Security — users can only access their own data
- ✅ Suspense-based streaming with Next.js 16 instant navigation
- ✅ Secure server-side auth verification with `getClaims()`

---

## Project Structure

```
app/
├── auth/
│   ├── login/page.tsx              # Sign in page
│   ├── sign-up/page.tsx            # Sign up page
│   ├── confirm/route.ts            # Email confirmation handler
│   └── ...                         # Other auth pages (template)
├── notes/
│   ├── page.tsx                    # Notes list (static shell + Suspense)
│   ├── notes-list.tsx              # Async data-fetching list component
│   ├── actions.ts                  # Server Actions (create/update/delete)
│   ├── delete-note-button.tsx      # Client component for delete + confirm
│   ├── new/
│   │   ├── page.tsx                # New note page (static shell)
│   │   └── new-note-form.tsx       # Async form component
│   └── [id]/
│       └── edit/
│           ├── page.tsx            # Edit page (static shell + Suspense)
│           └── edit-note-form.tsx  # Async edit form component
├── protected/page.tsx              # Example protected route (from template)
└── page.tsx                        # Home page
lib/
└── supabase/
    ├── server.ts                   # Server-side Supabase client
    ├── client.ts                   # Browser Supabase client
    └── middleware.ts               # Session refresh middleware
middleware.ts                        # Root middleware (auth session refresh)
supabase/
└── migrations/
    └── 20250101000000_create_notes.sql
```

---

## Database Schema

### Table: `public.notes`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Unique note identifier |
| `title` | `text` | NOT NULL | Note title |
| `content` | `text` | default `''` | Note body |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE, default `auth.uid()` | Owner of the note |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Creation timestamp |

### Row Level Security Policies

All four policies restrict access to the authenticated user's own rows:

| Operation | Policy | Rule |
|---|---|---|
| SELECT | Users can view their own notes | `auth.uid() = user_id` |
| INSERT | Users can insert their own notes | `WITH CHECK auth.uid() = user_id` |
| UPDATE | Users can update their own notes | `USING` and `WITH CHECK auth.uid() = user_id` |
| DELETE | Users can delete their own notes | `auth.uid() = user_id` |

---

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account
- Git (optional)

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a region close to you (e.g., Singapore for Sri Lanka).
3. Save your **database password** somewhere safe.
4. Go to **Settings → API** and copy:
   - **Project URL**
   - **anon public key**

### 3. Clone / create the Next.js project

```bash
npx create-next-app@latest edu-app -e with-supabase
cd edu-app
```

The `with-supabase` template includes TypeScript, Tailwind CSS, and Supabase auth helpers.

### 4. Configure environment variables

Rename `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

> ⚠️ **Never** put the `service_role` key in `.env.local` or any client-accessible file.

### 5. Run the database migration

**Option A — Supabase SQL Editor (quickest):**

1. Open your Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the contents of `supabase/migrations/20250101000000_create_notes.sql`.
3. Click **Run**.

**Option B — Supabase CLI (recommended for teams):**

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### 6. Configure Supabase Auth

1. **Authentication → Providers → Email** — make sure Email is enabled.
2. For **local development**, you can disable **"Confirm email"** to speed up testing:
   - **Authentication → Sign In / Providers → Email → Confirm email** → toggle off.
3. For **production**, keep email confirmation enabled and configure a custom SMTP sender.

### 7. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to sign up.

---

## Environment Variables Reference

| Variable | Required | Where used | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + Server | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Client + Server | Anon public key (safe to expose) |

> 🔐 If you ever add server-only operations (e.g., admin dashboards), add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` **without** the `NEXT_PUBLIC_` prefix, and only use it inside server actions/route handlers. **Never** import it into a client component.

---

## Security Notes

This app follows Supabase's official security best practices:

1. **RLS is always on** — every table has Row Level Security enabled and explicit policies for each operation.
2. **`user_id` is never sent from the client** — it defaults to `auth.uid()` in the database, so a malicious client cannot forge ownership.
3. **`getClaims()` instead of `getSession()`** — server-side auth checks verify the JWT signature, not just the cookie payload.
4. **All writes go through Server Actions** — the client never talks to Supabase directly for mutations.
5. **No `service_role` key in the codebase** — all privileged operations are avoided by design.
6. **Middleware refreshes the auth session** — expired tokens are refreshed before they reach protected routes.

---

## How the Suspense Pattern Works

Next.js 16's "Instant Navigation" validation requires that any **uncached data access** (Supabase queries, `getClaims()`, `params`, `cookies()`) happens **inside a `<Suspense>` boundary**. Every page in this app follows the same pattern:

```tsx
// page.tsx — static shell (no async data)
export default function Page({ params }) {
  return (
    <div>
      <h1>Title</h1>
      <Suspense fallback={<p>Loading…</p>}>
        <AsyncComponent params={params} />
      </Suspense>
    </div>
  );
}
```

```tsx
// async-component.tsx — all data access lives here
export async function AsyncComponent({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("notes").select("*");
  return <div>{/* render data */}</div>;
}
```

This keeps the outer page prerenderable and streams the dynamic part in.

---

## Common Issues & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Next.js encountered uncached data during prerendering` | Async data access outside `<Suspense>` | Move the async call into a child component and wrap it in `<Suspense>` |
| `Next.js encountered runtime data during prerendering` | `params` / `cookies()` read outside `<Suspense>` | Pass `params` as a Promise to a child component that awaits it inside `<Suspense>` |
| `formData.get is not a function` | Server Action signature includes an `id` parameter before `formData` | Use `formData.get("id")` with a hidden input instead |
| `Key columns "user_id" and "id" are of incompatible types` | `user_id` column created as `text` instead of `uuid` | `alter table public.notes alter column user_id type uuid using user_id::uuid;` |
| `Link is not defined` | Missing import | `import Link from "next/link"` |
| RLS returns empty array | Policies not created or RLS enabled without policies | Re-run the migration SQL |

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables.
4. In Supabase → **Authentication → URL Configuration**, add your Vercel domain to **Site URL** and **Redirect URLs**.
5. Deploy. ✅

---

## Roadmap / Next Steps

- [ ] Add note categories / tags
- [ ] Add search and pagination
- [ ] Add a proper landing page
- [ ] Improve UI with `shadcn/ui`
- [ ] Add optimistic updates with `useOptimistic`
- [ ] Migrate to an education domain model (courses, lessons, progress)

---

## License

MIT — free to use and learn from.
```

---

## 3. Quick Reference — All Database Steps in Order

මේක ඔයාට database එක setup කරන්න ඕන **සියලුම steps** පිළිවෙලට:

| # | Step | Where | What |
|---|---|---|---|
| 1 | Create Supabase project | supabase.com | Name + password + region |
| 2 | Copy API credentials | Settings → API | `URL` + `anon key` |
| 3 | Add to `.env.local` | Next.js project | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| 4 | Create `notes` table | SQL Editor | `create table public.notes (...)` |
| 5 | Enable RLS | SQL Editor | `alter table public.notes enable row level security;` |
| 6 | Create 4 policies | SQL Editor | SELECT, INSERT, UPDATE, DELETE |
| 7 | (Optional) Disable email confirm for dev | Authentication → Providers → Email | Toggle off |
| 8 | Sign up a test user | `/auth/sign-up` | Confirm via email if enabled |
| 9 | Verify user in `auth.users` | Authentication → Users | Check UUID exists |
| 10 | Test CRUD | `/notes` | Add → Edit → Delete |

---

## ✅ මෙතනින් කරන්න

1. උඩ SQL එක `supabase/migrations/` folder එකේ save කරන්න (folder එක නැත්නම් හදන්න)
2. README එක root එකේ `README.md` විදියට save කරන්න
3. GitHub එකට push කරන්න නම් — `git add . && git commit -m "Initial commit" && git push`

මොකක් හරි අඩු වුණා නම් හෝ තව දෙයක් එකතු කරන්න ඕන නම් කියන්න — මම update කරන්නම්. 🚀