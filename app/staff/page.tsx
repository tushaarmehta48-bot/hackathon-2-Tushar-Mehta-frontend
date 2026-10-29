import { redirect } from "next/navigation";

export default function StaffLegacyRedirect() {
  redirect("/gatekeeper/overview");
}
