# Future: Supabase Counter Migration

## Why localStorage now

The counter is currently localStorage-only — it starts at 2,847 and increments per device.
This loses the global community aspect but requires zero external services.

Migrate to Supabase when you want a real global counter again.

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Run this SQL in the Supabase SQL editor:

```sql
create table gazpacho_counter (
  id uuid primary key default gen_random_uuid(),
  count integer not null default 2847,
  updated_at timestamptz not null default now()
);

insert into gazpacho_counter (count) values (2847);

alter table gazpacho_counter enable row level security;
create policy "allow_read" on gazpacho_counter for select using (true);
create policy "allow_increment" on gazpacho_counter for update using (true) with check (true);

create or replace function increment_counter()
returns integer
language plpgsql
security definer
as $$
declare
  new_count integer;
begin
  update gazpacho_counter
  set count = count + 1, updated_at = now()
  returning count into new_count;
  return new_count;
end;
$$;

grant execute on function increment_counter() to anon;
```

3. Go to Project Settings → API → copy `Project URL` and `anon` public key
4. Create `.env.local`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

5. Add both as GitHub repository secrets (Settings → Secrets → Actions)

## Code changes

Install the Supabase JS client:

```bash
pnpm add @supabase/supabase-js
```

Create `client/src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Replace `client/src/hooks/use-counter.ts` with:

```ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY_MADE = 'gazpacho-user-made';
const DEFAULT_COUNT = 2847;

export function useCounter() {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [hasMade] = useState(() => localStorage.getItem(STORAGE_KEY_MADE) === 'true');

  useEffect(() => {
    supabase
      .from('gazpacho_counter')
      .select('count')
      .single()
      .then(({ data }) => {
        if (data) setCount(data.count);
      });
  }, []);

  async function increment() {
    if (hasMade) return;
    const { data } = await supabase.rpc('increment_counter');
    if (data) setCount(data);
    localStorage.setItem(STORAGE_KEY_MADE, 'true');
  }

  return { count, increment, hasMade };
}
```

## Environment variables in CI

Add to `.github/workflows/deploy.yml` build step:

```yaml
env:
  NODE_ENV: production
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```
