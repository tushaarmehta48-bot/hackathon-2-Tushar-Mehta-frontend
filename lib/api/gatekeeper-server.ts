import { serverApiClient } from "@/lib/api/server-client";
import type { GatekeeperAssignment } from "@/lib/types/gatekeeper";

export async function serverGatekeeperAssignments() {
  return serverApiClient<{ assignments: GatekeeperAssignment[] }>(
    "/gatekeeper/assignments",
  );
}
