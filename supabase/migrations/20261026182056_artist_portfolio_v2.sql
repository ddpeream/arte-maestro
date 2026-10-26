-- ARTE MAESTRO / PORTAFOLIO V2 / ARCHIVO PARA REVISION Y EJECUCION MANUAL
-- Base: 20261024172212_arte_maestro_v1.sql del proyecto.
-- NO EJECUTADO NI PROBADO contra PostgreSQL. No sustituye ni reejecuta V1.
-- Aplicar completo, con postgres, despues de V1 y una sola vez.
-- No idempotente: si existen tablas V2, se detiene sin sobrescribirlas.
-- Nombre sin timestamp deliberado: archivo de revision, no registrado por CLI.
-- Al incorporarlo a migrations, usar una version nueva posterior a V1.
--
-- Alcance: 8 tablas, RLS, auditoria, publicacion, referencias multimedia y
-- cambio atomico de contacto principal. No seeds, usuarios, React ni uploads.
-- Conserva public-media, sus limites/politicas y la prohibicion de borrado
-- fisico desde el cliente. Una URL de ese bucket sigue siendo PUBLICA.
-- No cambia permisos de noticias/equipo: editor NO administra portafolios;
-- admin y super_admin SI. Solo super_admin administra staff en V1.
-- Una fila publicada solo es publica cuando su artista tambien lo esta.
-- Editar una fila publicada actualiza directamente el contenido visible.
-- Archivar al artista no modifica estados de sus filas dependientes.
--
-- AJUSTES DE REVISION INCORPORADOS:
-- 1. Preflight V1 reforzado: comprueba las tablas y funciones de V1 que V2
--    reutiliza o reemplaza, para fallar temprano ante una base incompleta.
-- 2. is_primary queda estrictamente ligado al estado published:
--    draft/archived siempre fuerza false; al publicar un contacto entra como
--    no principal y la promocion se hace de forma atomica mediante la RPC.

begin;

-- Fallar antes de crear objetos si faltan dependencias esenciales de V1.
-- Se comprueban las ocho tablas de aplicacion V1 y los helpers que V2
-- reutiliza o reemplaza mediante CREATE OR REPLACE.
do $$
begin
  if to_regclass('public.staff_accounts') is null
    or to_regclass('public.media_assets') is null
    or to_regclass('public.artists') is null
    or to_regclass('public.events') is null
    or to_regclass('public.news') is null
    or to_regclass('public.event_artists') is null
    or to_regclass('public.news_artists') is null
    or to_regclass('public.news_events') is null
    or to_regprocedure('am_private.nonblank(text)') is null
    or to_regprocedure('am_private.text_list(text[])') is null
    or to_regprocedure('am_private.lock_core()') is null
    or to_regprocedure('am_private.audit_row()') is null
    or to_regprocedure('am_private.publication_row()') is null
    or to_regprocedure('am_private.has_role(text[])') is null
    or to_regprocedure('am_private.validate_core()') is null
    or to_regprocedure('am_private.protect_media_delete()') is null
    or to_regprocedure('am_private.asset_public(uuid)') is null
    or to_regprocedure('am_private.editor_asset_editable(uuid)') is null then
    raise exception 'V2 requiere la migracion V1 completa';
  end if;
end $$;

-- 1. Columnas especificas. Las columnas comunes se agregan inmediatamente
-- despues mediante un bloque unico, siguiendo el patron de instalacion de V1.
create table public.artist_stats (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  value text not null check (am_private.nonblank(value)),
  label text not null check (am_private.nonblank(label))
);

create table public.artist_members (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  name text not null check (am_private.nonblank(name)),
  alias text check (alias is null or am_private.nonblank(alias)),
  roles text[] not null default '{}' check (am_private.text_list(roles)),
  photo_asset_id uuid references public.media_assets(id) on delete restrict
);

create table public.artist_releases (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  title text not null check (am_private.nonblank(title)),
  release_type text not null default 'other'
    check (release_type in ('album','ep','single','other')),
  release_year smallint check (release_year between 1 and 9999),
  url text check (url ~ '^https://[^[:space:]]+$'),
  cover_asset_id uuid references public.media_assets(id) on delete restrict
);

create table public.artist_videos (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  category text not null check (category in ('live','clip')),
  title text not null check (am_private.nonblank(title)),
  meta text check (meta is null or am_private.nonblank(meta)),
  constraint artist_videos_asset_category_key unique (artist_id,category,media_asset_id)
);

create table public.artist_gallery (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete restrict,
  caption text check (caption is null or am_private.nonblank(caption)),
  constraint artist_gallery_asset_key unique (artist_id,media_asset_id)
);

create table public.artist_press (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  name text not null check (am_private.nonblank(name)),
  url text check (url ~ '^https://[^[:space:]]+$'),
  -- PostgreSQL permite varias menciones sin URL (NULL).
  constraint artist_press_url_key unique (artist_id,url)
);

create table public.artist_links (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  platform text not null check (platform in
    ('instagram','facebook','youtube','spotify','apple_music','soundcloud','tiktok','website')),
  url text not null check (url ~ '^https://[^[:space:]]+$'),
  constraint artist_links_platform_key unique (artist_id,platform)
);

create table public.artist_contacts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists(id) on delete cascade,
  kind text not null check (kind in ('email','phone')),
  value text not null check (am_private.nonblank(value)),
  label text check (label is null or am_private.nonblank(label)),
  is_primary boolean not null default false,
  -- Validacion estructural, no verificacion de existencia del correo/telefono.
  constraint artist_contacts_value_format check (
    (kind='email' and length(value)<=254
      and value=lower(btrim(value))
      and value ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
    or (kind='phone' and value ~ '^\+[1-9][0-9]{1,14}$')
  ),
  constraint artist_contacts_value_key unique (artist_id,kind,value)
);

-- 2. Columnas comunes: todas las tablas tienen el mismo contrato editorial.
do $$ declare t text; begin
  foreach t in array array[
    'artist_stats','artist_members','artist_releases','artist_videos',
    'artist_gallery','artist_press','artist_links','artist_contacts'
  ] loop
    execute format($ddl$
      alter table public.%I
        add column sort_order integer not null default 0 check (sort_order>=0),
        add column publication_status text not null default 'draft'
          check (publication_status in ('draft','published','archived')),
        add column published_at timestamptz,
        add column created_at timestamptz not null default now(),
        add column updated_at timestamptz not null default now(),
        add column created_by uuid references auth.users(id) on delete set null,
        add column updated_by uuid references auth.users(id) on delete set null,
        add constraint portfolio_published_at_required
          check (publication_status<>'published' or published_at is not null)
    $ddl$,t);

    if t='artist_videos' then
      execute format('create index %I on public.%I(artist_id,category,publication_status,sort_order,id)',t||'_listing_idx',t);
    else
      execute format('create index %I on public.%I(artist_id,publication_status,sort_order,id)',t||'_listing_idx',t);
    end if;
    execute format('create index %I on public.%I(created_by)',t||'_created_by_idx',t);
    execute format('create index %I on public.%I(updated_by)',t||'_updated_by_idx',t);
  end loop;
end $$;

create index artist_members_photo_idx on public.artist_members(photo_asset_id);
create index artist_releases_cover_idx on public.artist_releases(cover_asset_id);
create index artist_videos_asset_idx on public.artist_videos(media_asset_id);
create index artist_gallery_asset_idx on public.artist_gallery(media_asset_id);

-- Maximo un principal PUBLICADO por artista/tipo. Los borradores pueden
-- preparar un reemplazo, pero is_primary permanece false hasta promocion
-- explicita mediante la RPC. Cero principales es valido.
create unique index artist_contacts_one_published_primary
  on public.artist_contacts(artist_id,kind)
  where is_primary and publication_status='published';

-- 3. Protecciones especificas. No permite trasladar filas a otro artista.
create function am_private.portfolio_identity() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.artist_id is distinct from old.artist_id then
    raise exception 'El artista de una fila del portafolio no puede modificarse';
  end if;
  return new;
end $$;

create function am_private.normalize_artist_contact() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.kind='email' then
    new.value:=pg_catalog.lower(pg_catalog.btrim(new.value));
  elsif new.kind='phone' then
    -- Solo quitar formato visual; no inventar prefijos de pais.
    new.value:=pg_catalog.regexp_replace(new.value,'[[:space:]().-]','','g');
  end if;

  -- is_primary solo tiene significado en contactos ya publicados.
  -- Draft/archived siempre quedan en false. Ademas, la primera transicion a
  -- published entra como no principal; la promocion se realiza despues con
  -- am_set_primary_artist_contact(), que cambia principal anterior+nuevo en
  -- una sola transaccion.
  if new.publication_status <> 'published' then
    new.is_primary := false;
  elsif tg_op = 'INSERT' then
    new.is_primary := false;
  elsif old.publication_status <> 'published'
    and new.publication_status = 'published' then
    new.is_primary := false;
  end if;

  return new;
end $$;

-- 4. Extender funciones V1 sin perder sus comprobaciones originales.
-- Los triggers z_validate ya instalados en V1 invocaran esta misma funcion.
create or replace function am_private.validate_core() returns trigger
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
      union all select photo_asset_id,publication_status,'image' from public.artist_members
      union all select cover_asset_id,publication_status,'image' from public.artist_releases
      union all select media_asset_id,publication_status,'image' from public.artist_gallery
      union all select media_asset_id,publication_status,'video' from public.artist_videos
    ) r join public.media_assets m on m.id=r.asset_id
    where (r.expected is not null and m.kind<>r.expected) or (r.st='published' and m.status<>'ready')
  ) then raise exception 'Recurso incompatible o no disponible para el contenido'; end if;

  -- V2: YouTube es la unica fuente de videos del portafolio en esta etapa.
  -- Se valida incluso en borradores. Un hijo published exige ready aunque
  -- su artista este draft/archived, para que pueda publicarse despues.
  if exists(select 1 from public.artist_videos v join public.media_assets m on m.id=v.media_asset_id
    where m.source_type is distinct from 'external'
      or m.external_provider is distinct from 'youtube') then
    raise exception 'Los videos del portafolio deben referenciar YouTube';
  end if;

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

create or replace function am_private.protect_media_delete() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if exists(select 1 from public.artists where hero_asset_id=old.id or featured_asset_id=old.id)
    or exists(select 1 from public.events where cover_asset_id=old.id)
    or exists(select 1 from public.news where cover_asset_id=old.id or primary_asset_id=old.id)
    or exists(select 1 from public.media_assets where preview_asset_id=old.id)
    or exists(select 1 from public.artist_members where photo_asset_id=old.id)
    or exists(select 1 from public.artist_releases where cover_asset_id=old.id)
    or exists(select 1 from public.artist_videos where media_asset_id=old.id)
    or exists(select 1 from public.artist_gallery where media_asset_id=old.id) then
    raise exception 'El recurso tiene referencias: resolverlas antes de eliminar';
  end if;
  return old;
end $$;

-- Visibilidad de METADATOS; no convierte public-media en un bucket privado.
create or replace function am_private.asset_public(aid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  with used as (
    select hero_asset_id id from public.artists where publication_status='published'
    union select featured_asset_id from public.artists where publication_status='published'
    union select cover_asset_id from public.events where publication_status='published'
    union select cover_asset_id from public.news where publication_status='published'
    union select primary_asset_id from public.news where publication_status='published'
    union select r.photo_asset_id from public.artist_members r join public.artists a on a.id=r.artist_id
      where r.publication_status='published' and a.publication_status='published'
    union select r.cover_asset_id from public.artist_releases r join public.artists a on a.id=r.artist_id
      where r.publication_status='published' and a.publication_status='published'
    union select r.media_asset_id from public.artist_videos r join public.artists a on a.id=r.artist_id
      where r.publication_status='published' and a.publication_status='published'
    union select r.media_asset_id from public.artist_gallery r join public.artists a on a.id=r.artist_id
      where r.publication_status='published' and a.publication_status='published'
  ), visible as (
    select id from used
    union select m.preview_asset_id from public.media_assets m join used u on u.id=m.id where m.status='ready'
  ) select exists(select 1 from public.media_assets m join visible v on v.id=m.id
    where m.id=aid and m.status='ready')
$$;

create or replace function am_private.editor_asset_editable(aid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select am_private.has_role(array['editor']) and exists(select 1 from public.media_assets m
    where m.id=aid and m.created_by=auth.uid() and m.status='ready')
  and not exists(select 1 from public.artists where hero_asset_id=aid or featured_asset_id=aid)
  and not exists(select 1 from public.events where cover_asset_id=aid)
  and not exists(select 1 from public.media_assets where preview_asset_id=aid)
  and not exists(select 1 from public.news where (cover_asset_id=aid or primary_asset_id=aid)
    and (created_by is distinct from auth.uid() or publication_status<>'draft'))
  and not exists(select 1 from public.artist_members where photo_asset_id=aid)
  and not exists(select 1 from public.artist_releases where cover_asset_id=aid)
  and not exists(select 1 from public.artist_videos where media_asset_id=aid)
  and not exists(select 1 from public.artist_gallery where media_asset_id=aid)
$$;

-- 5. Triggers y permisos. Los helpers V1 audit_row/publication_row se reutilizan.
-- No se instala validate_publish_links en hijos: un hijo puede prepararse
-- como published antes que el artista. RLS exige ambos estados para mostrarlo.
do $$ declare t text; begin
  foreach t in array array[
    'artist_stats','artist_members','artist_releases','artist_videos',
    'artist_gallery','artist_press','artist_links','artist_contacts'
  ] loop
    execute format('alter table public.%I enable row level security',t);
    execute format('revoke all on public.%I from public,anon,authenticated',t);
    execute format('create trigger a_lock before insert or update or delete on public.%I for each statement execute function am_private.lock_core()',t);
    execute format('create trigger b_audit before insert or update on public.%I for each row execute function am_private.audit_row()',t);
    execute format('create trigger c_publication before insert or update on public.%I for each row execute function am_private.publication_row()',t);
    execute format('create trigger d_portfolio_identity before update on public.%I for each row execute function am_private.portfolio_identity()',t);
    execute format('create constraint trigger z_validate after insert or update or delete on public.%I deferrable initially deferred for each row execute function am_private.validate_core()',t);

    execute format($policy$
      create policy public_read on public.%I for select to anon,authenticated
      using (publication_status='published' and exists(
        select 1 from public.artists a
        where a.id=artist_id and a.publication_status='published'))
    $policy$,t);
    execute format('create policy admin_read on public.%I for select to authenticated using (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('create policy admin_insert on public.%I for insert to authenticated with check (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('create policy admin_update on public.%I for update to authenticated using (am_private.has_role(array[''super_admin'',''admin''])) with check (am_private.has_role(array[''super_admin'',''admin'']))',t);
    execute format('create policy admin_delete on public.%I for delete to authenticated using (am_private.has_role(array[''super_admin'',''admin'']))',t);

    execute format('grant select on public.%I to anon,authenticated',t);
    execute format('grant insert,update,delete on public.%I to authenticated',t);
    execute format('grant all on public.%I to service_role',t);
  end loop;
end $$;

-- Orden alfabetico para BEFORE ROW en artist_contacts:
-- b_audit -> b_contact_normalize -> c_publication.
create trigger b_contact_normalize before insert or update on public.artist_contacts
  for each row execute function am_private.normalize_artist_contact();

-- 6. RPC minima para elegir un principal publicado de forma atomica.
-- Requiere contacto destino YA publicado. Para un nuevo contacto:
-- crear draft, publicarlo (entra forzosamente con is_primary=false) y luego
-- llamar esta funcion.
-- Cambia solo los principales publicados del mismo artista y tipo.
-- Respeta los borradores que preparan reemplazos y no publica al artista.
-- Para retirar un principal sin reemplazo: UPDATE is_primary=false.
-- Archivar/eliminar el principal no promueve automaticamente otro contacto;
-- al archivarlo, normalize_artist_contact fuerza is_primary=false.
create function public.am_set_primary_artist_contact(p_contact_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare target_contact public.artist_contacts%rowtype;
begin
  if not am_private.has_role(array['super_admin','admin']) then
    raise exception 'Solo admin o superadmin activo puede elegir el contacto principal';
  end if;

  -- Mismo bloqueo de V1, adquirido antes de leer; las escrituras directas
  -- tambien lo adquieren mediante a_lock. La funcion mantiene RLS vigente.
  perform pg_catalog.pg_advisory_xact_lock(734219,1);

  select * into target_contact
  from public.artist_contacts
  where id=p_contact_id
  for update;

  if not found then
    raise exception 'Contacto inexistente o no autorizado';
  end if;

  if target_contact.publication_status<>'published' then
    raise exception 'El contacto principal debe estar publicado';
  end if;

  update public.artist_contacts
  set is_primary=false
  where artist_id=target_contact.artist_id
    and kind=target_contact.kind
    and publication_status='published'
    and is_primary
    and id<>p_contact_id;

  update public.artist_contacts
  set is_primary=true
  where id=p_contact_id
    and not is_primary;
end $$;

-- 7. Superficie de ejecucion explicita: no habilitar helpers de triggers al cliente.
revoke all on function am_private.portfolio_identity() from public,anon,authenticated;
revoke all on function am_private.normalize_artist_contact() from public,anon,authenticated;
revoke all on function am_private.validate_core() from public,anon,authenticated;
revoke all on function am_private.protect_media_delete() from public,anon,authenticated;
revoke all on function am_private.asset_public(uuid) from public,anon,authenticated;
revoke all on function am_private.editor_asset_editable(uuid) from public,anon,authenticated;

grant execute on function am_private.asset_public(uuid),am_private.editor_asset_editable(uuid)
  to anon,authenticated;

grant execute on function am_private.portfolio_identity(),am_private.normalize_artist_contact(),
  am_private.validate_core(),am_private.protect_media_delete(),
  am_private.asset_public(uuid),am_private.editor_asset_editable(uuid)
  to service_role;

revoke all on function public.am_set_primary_artist_contact(uuid) from public,anon,authenticated;
grant execute on function public.am_set_primary_artist_contact(uuid) to authenticated;
-- No requiere ni habilita uso de service_role en React.

comment on table public.artist_stats is
  'Cifras editoriales del portafolio; value es texto, no una metrica calculada.';
comment on table public.artist_members is
  'Integrantes y colaboradores de un artista; no son cuentas Auth ni artistas independientes.';
comment on table public.artist_releases is
  'Discografia del portafolio, con un enlace principal opcional por lanzamiento.';
comment on table public.artist_videos is
  'Presentacion del recurso YouTube en el portafolio: live o clip. external_id vive en media_assets.';
comment on table public.artist_gallery is
  'Galeria de imagenes: fotos, caratulas, contracaratulas e ilustraciones. Reutiliza media_assets.';
comment on table public.artist_press is
  'Menciones y enlaces de prensa externa; no sustituye las noticias de Arte Maestro.';
comment on table public.artist_links is
  'Un enlace por plataforma y artista. Iconos y etiquetas de plataforma corresponden al frontend.';
comment on table public.artist_contacts is
  'Contactos profesionales destinados a publicacion. No contiene registros de seguidores ni datos privados.';
comment on column public.artist_contacts.is_primary is
  'Preferencia de contacto separada del orden visual. Solo puede permanecer true en published y la primera publicacion entra como false. Maximo un principal published por artista/kind. Sin reemplazo automatico.';
comment on function public.am_set_primary_artist_contact(uuid) is
  'Seleccion atomica de un contacto publicado como principal; solo admin/super_admin activos, SECURITY INVOKER y RLS.';

commit;

-- FIN. No importa School MC ni modifica filas V1. Las funciones V1 ampliadas
-- conservan sus nombres y las reglas anteriores. La UI granular por roles,
-- el adaptador React y la carga de archivos se implementaran por separado.
-- Este archivo solo fue redactado/revisado como texto; su ejecucion y pruebas
-- (incluyendo RLS por rol, cambios de principal y concurrencia) son manuales.
