export type AppRole = "manager" | "front_desk";

export const getRoleHome = (role: string) =>
  role === "manager" ? "/executive" : "/operations";

export const resolveRoleFromEmail = (email: string): AppRole =>
  email.includes("manager") || email.includes("owner") ? "manager" : "front_desk";
