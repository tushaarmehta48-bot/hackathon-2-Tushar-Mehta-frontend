import { redirect } from "next/navigation";

export default function StaffScanLegacyRedirect() {
  redirect("/gatekeeper/scan");
}
