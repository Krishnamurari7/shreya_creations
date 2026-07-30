-- Adds portfolio.featured so the owner can pick which pieces appear in the
-- homepage "Portfolio Highlights" band. /portfolio keeps showing every row.
-- Safe to re-run (IF NOT EXISTS + idempotent updates).

alter table public.portfolio add column if not exists featured boolean not null default false;

create index if not exists portfolio_featured_sort_idx
  on public.portfolio (featured, sort_order)
  where featured;

-- Seed the flag once, on first apply only, so a later re-run never overrides
-- choices the owner has since made in the admin panel.
update public.portfolio
set featured = true, updated_at = now()
where slug in ('bridal-lehenga-maroon-gold', 'reception-gown')
  and not exists (select 1 from public.portfolio where featured);
