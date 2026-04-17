import { demoAccounts, type PlatformAccount, type PlatformRole } from "@courthub/domain";

export type AppRole = PlatformRole | "manager" | "front_desk";

export interface AppSession {
  email: string;
  name: string;
  role: PlatformRole;
  vendorId?: string;
}

const normalizeName = (email: string) => {
  const [localPart] = email.split("@");
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const normalizeRole = (role?: string | null): PlatformRole => {
  if (role === "admin" || role === "manager") return "admin";
  return "user";
};

export const getRoleHome = (role: string) =>
  normalizeRole(role) === "admin" ? "/admin" : "/dashboard";

export const findAccountByEmail = (email: string) =>
  demoAccounts.find((account) => account.email.toLowerCase() === email.trim().toLowerCase()) ?? null;

export const resolveRoleFromEmail = (email: string, preferredRole?: string | null): PlatformRole => {
  const seeded = findAccountByEmail(email);
  if (seeded) return seeded.role;

  if (preferredRole) return normalizeRole(preferredRole);

  return email.toLowerCase().includes("admin") || email.toLowerCase().includes("manager")
    ? "admin"
    : "user";
};

export const createSessionFromIdentity = ({
  email,
  name,
  role,
}: {
  email: string;
  name?: string;
  role?: string | null;
}): AppSession => {
  const normalizedEmail = email.trim().toLowerCase();
  const seeded = findAccountByEmail(normalizedEmail);
  const resolvedRole = seeded?.role ?? resolveRoleFromEmail(normalizedEmail, role);

  return {
    email: normalizedEmail,
    name: name?.trim() || seeded?.name || normalizeName(normalizedEmail),
    role: resolvedRole,
    vendorId: seeded?.vendorId,
  };
};

export const isAdminSession = (session: Pick<AppSession, "role"> | null | undefined) =>
  session?.role === "admin";

export const getDefaultDemoAccount = (role: PlatformRole): PlatformAccount =>
  demoAccounts.find((account) => account.role === role) ?? demoAccounts[0];
