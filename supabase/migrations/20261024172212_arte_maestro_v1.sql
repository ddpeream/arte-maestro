-- ARTE MAESTRO / V1 / BORRADOR PARA REVISION MANUAL
-- NO EJECUTADO NI PROBADO. Destino: un proyecto Supabase sin estas tablas.
-- Este archivo crea estructura, reglas, RLS y el bucket. No crea usuarios,
-- no importa contenido ni archivos, y no modifica el frontend.
-- Revisar en Supabase LOCAL antes de considerar su aplicacion remota.
-- Requiere roles anon/authenticated/service_role, auth.users y Storage de Supabase.
-- Ejecutar, si se decide hacerlo, con el propietario postgres de Supabase.
-- Una sola transaccion: no ejecutar fragmentos aislados.
-- No es idempotente: un conflicto de nombres debe detener la migracion.
--
-- LIMITES EXPLICITOS DE ESTA ENTREGA:
-- 1. Invitaciones y eliminacion de identidades Auth requieren servidor confiable.
-- 2. No habilita DELETE fisico de media_assets ni de objetos desde el cliente:
--    requiere coordinacion Storage API + DB y recuperacion de fallos. Archivar
--    y sustituir referencias SI estan preparados. No se promete atomicidad
--    entre Postgres y el almacenamiento de archivos.
-- 3. Carga directa autorizada por RLS; validacion binaria real/compresion corresponde
--    al flujo de carga posterior. MIME declarado no prueba el contenido real.
-- 4. Material de public-media es PUBLICO incluso si la noticia es draft.
-- 5. No habilita registro publico de administradores ni bootstrap automatico.
-- 6. Las comprobaciones sensibles serializan escrituras del nucleo; es una
--    eleccion conservadora para un equipo pequeno, que debe probarse localmente.

begin;

create schema am_private;
revoke all on schema am_private from public, anon, authenticated;
grant usage on schema am_private to anon, authenticated, service_role;
-- am_private NO debe agregarse a los schemas expuestos en la Data API.

create function am_private.nonblank(v text) returns boolean
language sql immutable set search_path = ''
as $$ select v is not null and pg_catalog.btrim(v) <> '' $$;

create function am_private.text_list(v text[]) returns boolean
language sql immutable set search_path = ''
as $$ select v is not null and (pg_catalog.cardinality(v) = 0 or
  (pg_catalog.array_ndims(v) = 1 and not exists
   (select 1 from pg_catalog.unnest(v) x where not am_private.nonblank(x)))) $$;

create function am_private.pairs(v jsonb, require_item boolean default false)
returns boolean language plpgsql immutable set search_path = '' as $$
declare x jsonb;
begin
  if v is null or pg_catalog.jsonb_typeof(v) <> 'array' then return false; end if;
  if require_item and pg_catalog.jsonb_array_length(v) = 0 then return false; end if;
  for x in select value from pg_catalog.jsonb_array_elements(v) loop
    if pg_catalog.jsonb_typeof(x) <> 'object' then return false; end if;
    if (x - array['label','value']) <> '{}'::jsonb
      or pg_catalog.jsonb_typeof(x->'label') is distinct from 'string'
      or pg_catalog.jsonb_typeof(x->'value') is distinct from 'string'
      or not am_private.nonblank(x->>'label')
      or not am_private.nonblank(x->>'value') then return false; end if;
  end loop;
  return true;
end $$;

create table public.staff_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (am_private.nonblank(display_name)),
  role text not null check (role in ('super_admin','admin','editor')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image','video','audio','document')),
  source_type text not null check (source_type in ('storage','external')),
  status text not null default 'ready' check (status in ('ready','archived')),
  title text check (title is null or am_private.nonblank(title)),
  alt_text text check (alt_text is null or am_private.nonblank(alt_text)),
  caption text check (caption is null or am_private.nonblank(caption)),
  credit text check (credit is null or am_private.nonblank(credit)),
  storage_bucket text,
  storage_path text,
  original_filename text check (original_filename is null or am_private.nonblank(original_filename)),
  mime_type text,
  size_bytes bigint check (size_bytes > 0),
  width integer check (width > 0),
  height integer check (height > 0),
  duration_seconds numeric(12,3) check (duration_seconds > 0 and duration_seconds <> 'NaN'::numeric),
  external_provider text,
  external_id text,
  external_url text,
  preview_asset_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint media_location_unique unique (storage_bucket, storage_path),
  constraint media_external_unique unique (external_provider, external_id),
  constraint media_dimensions check (
    (width is null and height is null) or
    (width is not null and height is not null and kind in ('image','video'))),
  constraint media_duration check (duration_seconds is null or kind in ('audio','video')),
  constraint media_preview check (preview_asset_id is null or (preview_asset_id <> id and kind <> 'image')),
  constraint media_source check ((
    source_type = 'storage' and storage_bucket is not null and storage_bucket = 'public-media'
    and storage_path is not null and mime_type is not null and size_bytes is not null
    and size_bytes <= 10485760
    and external_provider is null and external_id is null and external_url is null
    and ((kind = 'image' and mime_type in ('image/jpeg','image/png','image/webp')
      and storage_path ~ '^images/[0-9a-f-]{36}/file\.(jpg|jpeg|png|webp)$')
      or (kind = 'document' and mime_type = 'application/pdf'
      and storage_path ~ '^documents/[0-9a-f-]{36}/file\.pdf$'))
  ) or (
    source_type = 'external' and external_provider is not null
    and storage_bucket is null and storage_path is null
    and original_filename is null and mime_type is null and size_bytes is null
    and ((external_provider = 'youtube' and kind = 'video'
      and external_id is not null and external_id ~ '^[A-Za-z0-9_-]{11}$' and external_url is null)
      or (external_provider = 'url' and external_id is null
      and external_url is not null and external_url ~ '^https://[^[:space:]]+$'))
  ))
);

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 160 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (am_private.nonblank(name) and length(name) <= 160),
  city text,
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  founded_year smallint check (founded_year between 1 and 9999),
  concept text,
  tagline text,
  quote text,
  short_description text,
  description text,
  biography text[] not null default '{}' check (am_private.text_list(biography)),
  genres text[] not null default '{}' check (am_private.text_list(genres)),
  hero_asset_id uuid references public.media_assets(id) on delete set null,
  featured_asset_id uuid references public.media_assets(id) on delete set null,
  is_featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  publication_status text not null default 'draft' check (publication_status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check (publication_status <> 'published' or
    (published_at is not null and am_private.nonblank(short_description)))
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 160 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (am_private.nonblank(title) and length(title) <= 240),
  summary text,
  description text[] not null default '{}' check (am_private.text_list(description)),
  event_type text not null default 'other' check
    (event_type in ('concert','festival','workshop','showcase','broadcast','premiere','tribute','other')),
  event_status text not null default 'scheduled' check
    (event_status in ('scheduled','postponed','cancelled','completed')),
  status_note text,
  start_date date,
  start_time time without time zone,
  end_date date,
  end_time time without time zone,
  timezone text not null default 'America/Bogota',
  attendance_mode text check (attendance_mode in ('in_person','online','hybrid')),
  venue_name text,
  address text,
  city text,
  country_code text check (country_code ~ '^[A-Z]{2}$'),
  online_url text check (online_url ~ '^https://[^[:space:]]+$'),
  ticket_url text check (ticket_url ~ '^https://[^[:space:]]+$'),
  admission_type text not null default 'unknown' check (admission_type in ('unknown','free','paid')),
  price_from numeric(12,2) check (price_from > 0 and price_from <> 'NaN'::numeric),
  currency text check (currency ~ '^[A-Z]{3}$'),
  capacity integer check (capacity > 0),
  age_policy text,
  cover_asset_id uuid references public.media_assets(id) on delete set null,
  publication_status text not null default 'draft' check (publication_status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check (start_time is null or start_date is not null),
  check (end_date is null or (start_date is not null and end_date >= start_date)),
  check (end_time is null or (end_date is not null and start_time is not null)),
  check (start_time is null or start_time < time '24:00'),
  check (end_time is null or end_time < time '24:00'),
  check (start_date is null or isfinite(start_date)),
  check (end_date is null or isfinite(end_date)),
  check (end_time is null or end_date > start_date or end_time > start_time),
  check ((price_from is null and currency is null) or
    (price_from is not null and currency is not null and admission_type = 'paid')),
  check (publication_status <> 'published' or
    (published_at is not null and am_private.nonblank(summary)))
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 160 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (am_private.nonblank(title) and length(title) <= 240),
  category text not null default 'novedades' check
    (category in ('proximos','cronicas','lanzamientos','novedades','convocatorias','alertas','memoria')),
  kicker text,
  summary text,
  body text[] not null default '{}' check (am_private.text_list(body)),
  ticker_text text,
  context_label text,
  facts jsonb not null default '[]' check (am_private.pairs(facts)),
  card_type text not null default 'clip' check (card_type in
    ('clip','vinyl','video','sticky','ticket','medal','route','collab','press','big',
     'hazard','polaroid','tag','notebook','quote','burst','live','memorial','receipt')),
  card_data jsonb not null default '{}' check (jsonb_typeof(card_data) = 'object'),
  card_schema_version smallint not null default 1 check (card_schema_version = 1),
  cover_asset_id uuid references public.media_assets(id) on delete set null,
  primary_asset_id uuid references public.media_assets(id) on delete set null,
  is_featured boolean not null default false,
  priority integer not null default 0 check (priority >= 0),
  publication_status text not null default 'draft' check (publication_status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  check (publication_status <> 'published' or (published_at is not null and cardinality(body) > 0))
);

create table public.event_artists (
  event_id uuid not null references public.events(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  sort_order integer not null default 0 check (sort_order >= 0),
  participation_label text,
  created_at timestamptz not null default now(),
  primary key (event_id, artist_id)
);
create table public.news_artists (
  news_id uuid not null references public.news(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  primary key (news_id, artist_id)
);
create table public.news_events (
  news_id uuid not null references public.news(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  relation_type text not null default 'related' check
    (relation_type in ('announcement','update','recap','related')),
  is_primary boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  primary key (news_id, event_id)
);

-- Indices. Los PK/UNIQUE ya tienen sus propios indices.
create unique index news_one_primary_event on public.news_events(news_id) where is_primary;
create index media_preview_idx on public.media_assets(preview_asset_id);
create index artists_hero_idx on public.artists(hero_asset_id);
create index artists_featured_asset_idx on public.artists(featured_asset_id);
create index artists_listing_idx on public.artists(publication_status, sort_order, id);
create index artists_featured_idx on public.artists(sort_order, id)
  where publication_status = 'published' and is_featured;
create index events_cover_idx on public.events(cover_asset_id);
create index events_agenda_idx on public.events(publication_status,event_status,start_date,start_time,id);
create index news_cover_idx on public.news(cover_asset_id);
create index news_primary_asset_idx on public.news(primary_asset_id);
create index news_publication_idx on public.news(publication_status,published_at desc,id);
create index news_category_idx on public.news(category,publication_status,published_at desc,id);
create index news_featured_idx on public.news(priority desc,published_at desc,id)
  where publication_status = 'published' and is_featured;
create index event_artists_order_idx on public.event_artists(event_id,sort_order,artist_id);
create index event_artists_reverse_idx on public.event_artists(artist_id,event_id);
create index news_artists_order_idx on public.news_artists(news_id,sort_order,artist_id);
create index news_artists_reverse_idx on public.news_artists(artist_id,news_id);
create index news_events_order_idx on public.news_events(news_id,sort_order,event_id);
create index news_events_reverse_idx on public.news_events(event_id,news_id);

-- Un unico punto de consulta del rol. Schema privado, search_path cerrado.
create function am_private.has_role(allowed text[]) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.staff_accounts
    where user_id = auth.uid() and is_active and role = any(allowed))
$$;

create function am_private.lock_core() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(734219, 1);
  return null;
end $$;

-- Auditoria: created_by se usa como autoria editorial en v1.
-- La nulificacion por borrado real de Auth se permite para respetar las FK.
create function am_private.audit_row() returns trigger
language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); k text; j jsonb;
begin
  if tg_op = 'INSERT' then
    if actor is not null then
      new.created_at := now(); new.created_by := actor;
      new.updated_by := actor;
    end if;
  else
    if tg_table_name = 'staff_accounts' then
      if new.user_id <> old.user_id then raise exception 'Identificador inmutable'; end if;
    else
      if new.id <> old.id then raise exception 'Identificador inmutable'; end if;
    end if;
    new.created_at := old.created_at;
    if new.created_by is distinct from old.created_by then
      if not (new.created_by is null and old.created_by is not null and
        not exists(select 1 from auth.users where id = old.created_by)) then
        raise exception 'La autoria no puede modificarse';
      end if;
    end if;
    if actor is not null then
      if not (new.updated_by is null and old.updated_by is not null and
        not exists(select 1 from auth.users where id = old.updated_by)) then
        new.updated_by := actor;
      end if;
    end if;
  end if;
  new.updated_at := now();
  -- Normalizar cadenas vacias opcionales; no reemplaza validaciones NOT NULL.
  j := pg_catalog.to_jsonb(new);
  for k in select key from pg_catalog.jsonb_each(j)
    where pg_catalog.jsonb_typeof(value) = 'string' and pg_catalog.btrim(value #>> '{}') = ''
  loop j := pg_catalog.jsonb_set(j,array[k],'null'::jsonb); end loop;
  new := pg_catalog.jsonb_populate_record(new,j);
  return new;
end $$;

create function am_private.publication_row() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      if new.publication_status <> 'draft' then raise exception 'Crear primero como borrador'; end if;
      new.published_at := null;
    end if;
  else
    if old.publication_status = 'archived' and new.publication_status = 'published' then
      raise exception 'Recuperar primero como borrador';
    end if;
    if old.published_at is not null then
      new.published_at := old.published_at;
    elsif auth.uid() is not null then
      new.published_at := null;
    end if;
  end if;
  if new.publication_status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;

-- Contrato card_data version 1; JSON solo para detalles de presentacion.
create function am_private.valid_card(t text, d jsonb, publishing boolean)
returns boolean language plpgsql immutable set search_path = '' as $$
declare spec jsonb; required text[] := '{}'; k text; typ text; v jsonb; item jsonb;
begin
  if d is null or pg_catalog.jsonb_typeof(d) <> 'object' then return false; end if;
  spec := case t
    when 'clip' then '{"mono":"text","stamp":"text","pull":"text","stats":"pairs"}'
    when 'vinyl' then '{"by":"text","mono":"text","when":"text","tracks":"texts"}'
    when 'video' then '{"by":"text","when":"text"}'
    when 'sticky' then '{"price":"text"}'
    when 'ticket' then '{"deadline":"text","reqs":"texts"}'
    when 'medal' then '{"sub":"text"}'
    when 'route' then '{}'
    when 'collab' then '{"song":"text","line":"text"}'
    when 'press' then '{"items":"press"}'
    when 'big' then '{"num":"text","label":"text","track":"text"}'
    when 'hazard' then '{"old_date_label":"text","new_date_label":"text","note":"text"}'
    when 'polaroid' then '{"year":"year","caption":"text"}'
    when 'tag' then '{"price":"text","tagline":"text","units":"texts"}'
    when 'notebook' then '{"lines":"texts","when":"text"}'
    when 'quote' then '{"text":"text","who":"text"}'
    when 'burst' then '{}'
    when 'live' then '{"station":"text","when":"text"}'
    when 'memorial' then '{"when":"text"}'
    when 'receipt' then '{"lines":"pairs","total":"pair"}'
    else null end;
  if spec is null then return false; end if;
  for k,v in select key,value from pg_catalog.jsonb_each(d) loop
    if not spec ? k then return false; end if;
    typ := spec->>k;
    if typ = 'text' then
      if pg_catalog.jsonb_typeof(v) <> 'string' or not am_private.nonblank(v #>> '{}') then return false; end if;
    elsif typ = 'year' then
      if pg_catalog.jsonb_typeof(v) <> 'number' then return false; end if;
      if (v #>> '{}') !~ '^[0-9]{1,4}$' then return false; end if;
      if (v #>> '{}')::integer not between 1 and 9999 then return false; end if;
    elsif typ = 'pairs' then
      if not am_private.pairs(v) then return false; end if;
    elsif typ = 'pair' then
      if not am_private.pairs(pg_catalog.jsonb_build_array(v),true) then return false; end if;
    elsif typ in ('texts','press') then
      if pg_catalog.jsonb_typeof(v) <> 'array' then return false; end if;
      for item in select value from pg_catalog.jsonb_array_elements(v) loop
        if typ = 'texts' then
          if pg_catalog.jsonb_typeof(item) <> 'string' or not am_private.nonblank(item #>> '{}') then return false; end if;
        else
          if pg_catalog.jsonb_typeof(item) <> 'object' then return false; end if;
          if (item - array['outlet','headline','url']) <> '{}'::jsonb
            or pg_catalog.jsonb_typeof(item->'outlet') is distinct from 'string'
            or pg_catalog.jsonb_typeof(item->'headline') is distinct from 'string'
            or not am_private.nonblank(item->>'outlet') or not am_private.nonblank(item->>'headline') then return false; end if;
          if item ? 'url' and (pg_catalog.jsonb_typeof(item->'url') <> 'string'
            or (item->>'url') !~ '^https://[^[:space:]]+$') then return false; end if;
        end if;
      end loop;
    end if;
  end loop;
  if publishing then
    required := case t
      when 'ticket' then array['deadline','reqs'] when 'medal' then array['sub']
      when 'collab' then array['song'] when 'press' then array['items']
      when 'big' then array['num','label'] when 'hazard' then array['old_date_label','new_date_label','note']
      when 'polaroid' then array['caption'] when 'tag' then array['price']
      when 'notebook' then array['lines'] when 'quote' then array['text','who']
      when 'live' then array['station'] when 'receipt' then array['lines','total'] else '{}'::text[] end;
    foreach k in array required loop
      if not d ? k then return false; end if;
      if pg_catalog.jsonb_typeof(d->k) = 'array' and pg_catalog.jsonb_array_length(d->k) = 0 then return false; end if;
    end loop;
  end if;
  return true;
end $$;

alter table public.news add constraint news_card_contract
  check (am_private.valid_card(card_type, card_data, publication_status = 'published'));
alter table public.news add constraint news_card_summary
  check (publication_status <> 'published' or card_type not in ('sticky','burst') or am_private.nonblank(summary));
alter table public.news add constraint news_card_photo
  check (publication_status <> 'published' or card_type <> 'polaroid' or cover_asset_id is not null);
alter table public.news add constraint news_card_video
  check (publication_status <> 'published' or card_type <> 'video' or primary_asset_id is not null);

-- Comprobaciones globales pequenas, diferidas al final de la transaccion:
-- permiten guardar una noticia y sus relaciones en una sola operacion futura.
create function am_private.validate_core() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists(select 1 from public.media_assets m join public.media_assets p on p.id=m.preview_asset_id
    where p.kind <> 'image' or (m.status='ready' and p.status<>'ready')) then
    raise exception 'Vista previa incompatible o archivada';
  end if;
  if exists (
    select 1 from (
      select hero_asset_id asset_id, publication_status st, 'image' expected from public.artists
      union all select featured_asset_id,publication_status,'image' from public.artists
      union all select cover_asset_id,publication_status,'image' from public.events
      union all select cover_asset_id,publication_status,'image' from public.news
      union all select primary_asset_id,publication_status,
        case when card_type='video' and publication_status='published' then 'video' else null end from public.news
    ) r join public.media_assets m on m.id=r.asset_id
    where (r.expected is not null and m.kind<>r.expected) or (r.st='published' and m.status<>'ready')
  ) then raise exception 'Recurso incompatible o no disponible para el contenido'; end if;
  if exists(select 1 from public.news n where n.publication_status='published' and n.card_type='route'
    and not exists(select 1 from public.news_events ne where ne.news_id=n.id)) then
    raise exception 'Una tarjeta route publicada requiere un evento relacionado';
  end if;
  if exists(select 1 from public.events e where not exists
    (select 1 from pg_catalog.pg_timezone_names z where z.name=e.timezone)) then
    raise exception 'Zona horaria no reconocida';
  end if;
  if exists(select 1 from public.events e where e.end_time is not null and
    ((e.end_date + e.end_time) at time zone e.timezone) <=
    ((e.start_date + e.start_time) at time zone e.timezone)) then
    raise exception 'El final del evento debe ser posterior al inicio';
  end if;
  return null;
end $$;

-- Al publicar se validan los destinos; ocultarlos despues NO propaga estados.
create function am_private.validate_publish_links() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.publication_status <> 'published' then return new; end if;
  if tg_op='UPDATE' then
    if old.publication_status='published' then return new; end if;
  end if;
  if tg_table_name='news' then
    if exists(select 1 from public.news_artists r join public.artists a on a.id=r.artist_id
      where r.news_id=new.id and a.publication_status<>'published')
      or exists(select 1 from public.news_events r join public.events e on e.id=r.event_id
      where r.news_id=new.id and e.publication_status<>'published') then
      raise exception 'Publicar requiere artistas y eventos relacionados publicados';
    end if;
  elsif tg_table_name='events' then
    if exists(select 1 from public.event_artists r join public.artists a on a.id=r.artist_id
      where r.event_id=new.id and a.publication_status<>'published') then
      raise exception 'Publicar requiere artistas relacionados publicados';
    end if;
  end if;
  return new;
end $$;

create function am_private.link_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare parent_status text; destination_status text;
begin
  if tg_op='UPDATE' then new.created_at:=old.created_at; else new.created_at:=now(); end if;
  if tg_table_name='event_artists' then
    select publication_status into parent_status from public.events where id=new.event_id;
  else select publication_status into parent_status from public.news where id=new.news_id; end if;
  if tg_table_name='news_events' then
    select publication_status into destination_status from public.events where id=new.event_id;
  else select publication_status into destination_status from public.artists where id=new.artist_id; end if;
  if parent_status='published' and destination_status<>'published' then
    raise exception 'No se puede asociar contenido oculto a contenido publicado';
  end if;
  return new;
end $$;

create function am_private.protect_staff() returns trigger
language plpgsql security definer set search_path = '' as $$
declare removing boolean;
begin
  if tg_op='DELETE' then removing:=true;
  else removing := new.role<>'super_admin' or not new.is_active; end if;
  if old.role='super_admin' and old.is_active and removing and not exists
    (select 1 from public.staff_accounts where user_id<>old.user_id and role='super_admin' and is_active) then
    raise exception 'No se puede retirar el ultimo superadmin activo';
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end $$;

-- Prohibir borrado de metadatos con referencias, incluso para un operador SQL.
create function am_private.protect_media_delete() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists(select 1 from public.artists where hero_asset_id=old.id or featured_asset_id=old.id)
    or exists(select 1 from public.events where cover_asset_id=old.id)
    or exists(select 1 from public.news where cover_asset_id=old.id or primary_asset_id=old.id)
    or exists(select 1 from public.media_assets where preview_asset_id=old.id) then
    raise exception 'El recurso tiene referencias: resolverlas antes de eliminar';
  end if;
  return old;
end $$;

-- Un archivo tiene identidad fisica inmutable: sustituir = nuevo recurso.
create function am_private.media_identity() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op='UPDATE' and
    row(new.kind,new.source_type,new.storage_bucket,new.storage_path,new.external_provider,new.external_id,new.external_url)
    is distinct from
    row(old.kind,old.source_type,old.storage_bucket,old.storage_path,old.external_provider,old.external_id,old.external_url) then
    raise exception 'Crear un nuevo recurso para cambiar su archivo u origen';
  end if;
  if new.source_type='storage' and split_part(new.storage_path,'/',2) <> new.id::text then
    raise exception 'La ruta debe contener el UUID del recurso';
  end if;
  return new;
end $$;

-- Instalacion de triggers y auditoria sin duplicar cuerpos de funciones.
do $$ declare t text; begin
  foreach t in array array['staff_accounts','media_assets','artists','events','news','event_artists','news_artists','news_events'] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public, anon, authenticated',t);
    execute format('create trigger a_lock before insert or update or delete on public.%I for each statement execute function am_private.lock_core()',t);
    if t in ('staff_accounts','media_assets','artists','events','news') then
      execute format('create trigger b_audit before insert or update on public.%I for each row execute function am_private.audit_row()',t);
      execute format('create index %I on public.%I(created_by)',t||'_created_by_idx',t);
      execute format('create index %I on public.%I(updated_by)',t||'_updated_by_idx',t);
    end if;
    if t in ('artists','events','news') then
      execute format('create trigger c_publication before insert or update on public.%I for each row execute function am_private.publication_row()',t);
      execute format('create trigger d_publish_links before insert or update on public.%I for each row execute function am_private.validate_publish_links()',t);
    end if;
    if t<>'staff_accounts' then
      execute format('create constraint trigger z_validate after insert or update or delete on public.%I deferrable initially deferred for each row execute function am_private.validate_core()',t);
    end if;
    if t in ('event_artists','news_artists','news_events') then
      execute format('create trigger b_link before insert or update on public.%I for each row execute function am_private.link_guard()',t);
    end if;
  end loop;
end $$;
create trigger c_protect_staff before update or delete on public.staff_accounts
  for each row execute function am_private.protect_staff();
create trigger c_media_identity before insert or update on public.media_assets
  for each row execute function am_private.media_identity();
create trigger c_media_delete before delete on public.media_assets
  for each row execute function am_private.protect_media_delete();

-- Helpers de acceso: solo devuelven booleanos; no exponen filas privadas.
create function am_private.own_draft(nid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select am_private.has_role(array['editor']) and exists(select 1 from public.news
    where id=nid and created_by=auth.uid() and publication_status='draft')
$$;

create function am_private.asset_public(aid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  with used as (
    select hero_asset_id id from public.artists where publication_status='published'
    union select featured_asset_id from public.artists where publication_status='published'
    union select cover_asset_id from public.events where publication_status='published'
    union select cover_asset_id from public.news where publication_status='published'
    union select primary_asset_id from public.news where publication_status='published'
  ), visible as (
    select id from used
    union select m.preview_asset_id from public.media_assets m join used u on u.id=m.id where m.status='ready'
  ) select exists(select 1 from public.media_assets m join visible v on v.id=m.id
    where m.id=aid and m.status='ready')
$$;

create function am_private.editor_asset_editable(aid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select am_private.has_role(array['editor']) and exists(select 1 from public.media_assets m
    where m.id=aid and m.created_by=auth.uid() and m.status='ready')
  and not exists(select 1 from public.artists where hero_asset_id=aid or featured_asset_id=aid)
  and not exists(select 1 from public.events where cover_asset_id=aid)
  and not exists(select 1 from public.media_assets where preview_asset_id=aid)
  and not exists(select 1 from public.news where (cover_asset_id=aid or primary_asset_id=aid)
    and (created_by is distinct from auth.uid() or publication_status<>'draft'))
$$;

-- El editor no puede seleccionar un UUID privado que conozca por otro medio.
create function am_private.editor_news_assets() returns trigger
language plpgsql security definer set search_path = '' as $$
declare aid uuid;
begin
  if am_private.has_role(array['editor']) then
    foreach aid in array array[new.cover_asset_id,new.primary_asset_id] loop
      if aid is not null and not (am_private.asset_public(aid) or
        exists(select 1 from public.media_assets where id=aid and created_by=auth.uid() and status='ready')) then
        raise exception 'Recurso no autorizado para este editor';
      end if;
    end loop;
  end if;
  return new;
end $$;
create trigger e_editor_assets before insert or update on public.news
  for each row execute function am_private.editor_news_assets();

-- RLS: definir USING y WITH CHECK explicitamente para las modificaciones.
create policy staff_read on public.staff_accounts for select to authenticated
  using (user_id=auth.uid() or am_private.has_role(array['super_admin']));
grant select on public.staff_accounts to authenticated;

do $$ declare t text; begin
  foreach t in array array['artists','events','news'] loop
    execute format('create policy public_read on public.%I for select to anon, authenticated using (publication_status = ''published'')',t);
    execute format('create policy admin_read on public.%I for select to authenticated using (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('create policy admin_insert on public.%I for insert to authenticated with check (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('create policy admin_update on public.%I for update to authenticated using (am_private.has_role(array[''super_admin'',''admin''])) with check (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('create policy admin_delete on public.%I for delete to authenticated using (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('grant select on public.%I to anon, authenticated',t);
    execute format('grant insert, update, delete on public.%I to authenticated',t);
  end loop;
end $$;
create policy editor_news_read on public.news for select to authenticated
  using (am_private.has_role(array['editor']) and created_by=auth.uid() and publication_status='draft');
create policy editor_news_insert on public.news for insert to authenticated
  with check (am_private.has_role(array['editor']) and created_by=auth.uid() and publication_status='draft' and published_at is null);
create policy editor_news_update on public.news for update to authenticated
  using (am_private.has_role(array['editor']) and created_by=auth.uid() and publication_status='draft')
  with check (am_private.has_role(array['editor']) and created_by=auth.uid() and publication_status='draft');

create policy media_public_read on public.media_assets for select to anon, authenticated
  using (am_private.asset_public(id));
create policy media_staff_read on public.media_assets for select to authenticated
  using (am_private.has_role(array['super_admin','admin']) or
    (am_private.has_role(array['editor']) and created_by=auth.uid()));
create policy media_insert on public.media_assets for insert to authenticated
  with check (am_private.has_role(array['super_admin','admin','editor']) and created_by=auth.uid()
    and status='ready' and (source_type='storage' or external_provider='youtube')
    and (preview_asset_id is null or am_private.has_role(array['super_admin','admin'])
      or am_private.asset_public(preview_asset_id)));
create policy media_admin_update on public.media_assets for update to authenticated
  using (am_private.has_role(array['super_admin','admin']))
  with check (am_private.has_role(array['super_admin','admin']));
create policy media_editor_update on public.media_assets for update to authenticated
  using (am_private.editor_asset_editable(id))
  with check (am_private.editor_asset_editable(id) and created_by=auth.uid() and status='ready'
    and (preview_asset_id is null or am_private.asset_public(preview_asset_id)));
grant select on public.media_assets to anon, authenticated;
grant insert, update on public.media_assets to authenticated;
-- DELETE intencionalmente NO concedido: ver limites al inicio.

create policy ea_public_read on public.event_artists for select to anon, authenticated using (
  exists(select 1 from public.events where id=event_id and publication_status='published') and
  exists(select 1 from public.artists where id=artist_id and publication_status='published'));
create policy na_public_read on public.news_artists for select to anon, authenticated using (
  exists(select 1 from public.news where id=news_id and publication_status='published') and
  exists(select 1 from public.artists where id=artist_id and publication_status='published'));
create policy ne_public_read on public.news_events for select to anon, authenticated using (
  exists(select 1 from public.news where id=news_id and publication_status='published') and
  exists(select 1 from public.events where id=event_id and publication_status='published'));
do $$ declare t text; target_table text; target_column text; begin
  foreach t in array array['event_artists','news_artists','news_events'] loop
    execute format('create policy admin_all on public.%I for all to authenticated using (am_private.has_role(array[''super_admin'',''admin''])) with check (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('grant select on public.%I to anon, authenticated',t);
    execute format('grant insert,update,delete on public.%I to authenticated',t);
    if t <> 'event_artists' then
      target_table := case when t='news_artists' then 'artists' else 'events' end;
      target_column := case when t='news_artists' then 'artist_id' else 'event_id' end;
      execute format('create policy editor_read on public.%I for select to authenticated using (am_private.own_draft(news_id))',t);
      execute format('create policy editor_insert on public.%I for insert to authenticated with check (am_private.own_draft(news_id) and exists(select 1 from public.%I where id=%I and publication_status=''published''))',t,target_table,target_column);
      execute format('create policy editor_update on public.%I for update to authenticated using (am_private.own_draft(news_id)) with check (am_private.own_draft(news_id) and exists(select 1 from public.%I where id=%I and publication_status=''published''))',t,target_table,target_column);
      -- Quitar una relacion propia sigue permitido si el destino fue ocultado.
      execute format('create policy editor_delete on public.%I for delete to authenticated using (am_private.own_draft(news_id))',t);
    end if;
  end loop;
end $$;

-- Gestion de autorizaciones para identidades YA existentes en Auth.
-- No envia invitaciones. La primera cuenta superadmin se configura aparte
-- mediante una operacion controlada de postgres, sin bootstrap publico.
create function public.am_set_staff(p_user_id uuid,p_display_name text,p_role text,p_active boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(734219,1);
  if not am_private.has_role(array['super_admin']) then raise exception 'Solo superadmin activo'; end if;
  insert into public.staff_accounts(user_id,display_name,role,is_active)
    values(p_user_id,p_display_name,p_role,p_active)
  on conflict(user_id) do update set display_name=excluded.display_name,role=excluded.role,is_active=excluded.is_active;
end $$;
create function public.am_remove_staff(p_user_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(734219,1);
  if not am_private.has_role(array['super_admin']) then raise exception 'Solo superadmin activo'; end if;
  delete from public.staff_accounts where user_id=p_user_id;
  if not found then raise exception 'Autorizacion inexistente'; end if;
end $$;
revoke all on function public.am_set_staff(uuid,text,text,boolean) from public,anon,authenticated;
revoke all on function public.am_remove_staff(uuid) from public,anon,authenticated;
grant execute on function public.am_set_staff(uuid,text,text,boolean) to authenticated;
grant execute on function public.am_remove_staff(uuid) to authenticated;

-- Storage: falla si el bucket ya existe, para no alterar configuraciones ajenas.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('public-media','public-media',true,10485760,
  array['image/jpeg','image/png','image/webp','application/pdf']);

create policy am_storage_insert on storage.objects for insert to authenticated
  with check (bucket_id='public-media' and am_private.has_role(array['super_admin','admin','editor'])
    and owner_id=auth.uid()::text
    and (name ~ '^images/[0-9a-f-]{36}/file\.(jpg|jpeg|png|webp)$'
      or name ~ '^documents/[0-9a-f-]{36}/file\.pdf$'));
create policy am_storage_list on storage.objects for select to authenticated
  using (bucket_id='public-media' and
    (am_private.has_role(array['super_admin','admin']) or
      (am_private.has_role(array['editor']) and owner_id=auth.uid()::text)));
-- No UPDATE: evita sobrescritura/movimiento mediante el cliente.
-- No DELETE: el borrado fisico coordinado queda fuera de esta migracion.
-- La URL publica entrega el archivo sin requerir una politica SELECT anon.
-- IMPORTANTE: revisar politicas Storage preexistentes; son permisivas y se
-- combinan con OR. Esta propuesta presupone un proyecto sin politicas amplias.

-- Vincular una carga propia existente; no permite registrar como propia una
-- ruta de otro usuario. Metadatos obtenidos por Storage son declarativos;
-- una verificacion binaria de formatos no se implementa dentro de SQL.
create function am_private.verify_uploaded_object() returns trigger
language plpgsql security definer set search_path = '' as $$
declare obj storage.objects%rowtype;
begin
  if new.source_type <> 'storage' then return new; end if;
  select * into obj from storage.objects where bucket_id=new.storage_bucket and name=new.storage_path;
  if not found then raise exception 'Subir primero el archivo a Storage'; end if;
  if auth.uid() is not null and tg_op='INSERT' and obj.owner_id is distinct from auth.uid()::text then
    raise exception 'La carga debe pertenecer al usuario actual';
  end if;
  if obj.metadata->>'mimetype' is distinct from new.mime_type then
    raise exception 'MIME no coincide con Storage';
  end if;
  if obj.metadata->>'size' is null or (obj.metadata->>'size')::bigint <> new.size_bytes then
    raise exception 'Tamano no coincide con Storage';
  end if;
  return new;
end $$;
create trigger d_verify_object before insert or update on public.media_assets
  for each row execute function am_private.verify_uploaded_object();

-- Reducir superficie de ejecucion de helpers. Triggers no requieren que el
-- cliente tenga EXECUTE sobre su funcion. Conceder solo helpers usados por
-- politicas/constraints; ninguno devuelve registros administrativos.
revoke all on all functions in schema am_private from public,anon,authenticated;
grant execute on function am_private.nonblank(text),am_private.text_list(text[]),
  am_private.pairs(jsonb,boolean),am_private.valid_card(text,jsonb,boolean),
  am_private.has_role(text[]),am_private.own_draft(uuid),
  am_private.asset_public(uuid),am_private.editor_asset_editable(uuid)
  to anon,authenticated;
grant execute on all functions in schema am_private to service_role;
grant all on public.staff_accounts, public.media_assets, public.artists,
  public.events, public.news, public.event_artists, public.news_artists,
  public.news_events to service_role;
-- El service_role queda reservado al servidor. Nunca incluir su clave en React.

comment on table public.media_assets is
  'Biblioteca v1: imagenes/PDF publicos y referencias externas. Archivar no revoca una URL publica. Borrado fisico requiere flujo coordinado posterior.';
comment on table public.staff_accounts is
  'Autorizacion del equipo. No equivale a roles PostgreSQL ni a membresia del dashboard Supabase.';
comment on column public.news.created_by is
  'Autoria operativa del editor en v1; asignada por el sistema.';
comment on column public.news.published_at is
  'Fecha de primera publicacion; se conserva al editar, retirar y republicar.';

commit;

-- FIN. No incluye seeds, cuentas reales, invitaciones ni migracion de archivos.
-- Antes de usar: revision SQL, ejecucion local desde cero y comprobacion de
-- permisos por rol, concurrencia, carga Storage y contratos de las 19 tarjetas.
