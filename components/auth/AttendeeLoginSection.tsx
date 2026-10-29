import { AttendeeAlreadySignedIn } from "@/components/auth/AttendeeAlreadySignedIn";
import { AttendeeAuthForm } from "@/components/auth/AttendeeAuthForm";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/types/user";

type AttendeeLoginSectionProps = {
  returnTo?: string | null;
};

export async function AttendeeLoginSection({
  returnTo = null,
}: AttendeeLoginSectionProps) {
  const user = await getSessionUser();

  if (user?.role === UserRole.Attendee) {
    return <AttendeeAlreadySignedIn user={user} returnTo={returnTo} />;
  }

  return <AttendeeAuthForm />;
}
