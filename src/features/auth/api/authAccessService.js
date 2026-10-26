import { supabase } from "../../../lib/supabaseClient";

export const STAFF_PANEL_ROLES = ["super_admin", "admin", "editor"];

// Trae la cuenta interna asociada al usuario autenticado.
export async function getStaffAccount(userId) {
  const { data, error } = await supabase
    .from("staff_accounts")
    .select(
      `
      user_id,
      display_name,
      role,
      is_active
    `,
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// Devuelve el miembro si tiene acceso activo al panel.
export async function getActiveStaff(userId) {
  const staff = await getStaffAccount(userId);

  if (!staff?.is_active) {
    return null;
  }

  if (!STAFF_PANEL_ROLES.includes(staff.role)) {
    return null;
  }

  return staff;
}
