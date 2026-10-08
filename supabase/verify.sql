-- Run after migration and seed in the SQL Editor.
select count(*) as total_textbooks,
  count(*) filter (where category = 'single') as single_count,
  count(*) filter (where category = 'pass') as pass_count
from public.textbooks;

select relrowsecurity as rls_enabled
from pg_class
where oid = 'public.textbooks'::regclass;

select has_table_privilege('anon', 'public.textbooks', 'SELECT') as can_read,
  has_table_privilege('anon', 'public.textbooks', 'INSERT') as can_insert,
  has_table_privilege('anon', 'public.textbooks', 'UPDATE') as can_update,
  has_table_privilege('anon', 'public.textbooks', 'DELETE') as can_delete;

select policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename = 'textbooks';
