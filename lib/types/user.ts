export const UserRole = {
  Attendee: "attendee",
  Gatekeeper: "gatekeeper",
  Admin: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole | string;
  status: string;
};
