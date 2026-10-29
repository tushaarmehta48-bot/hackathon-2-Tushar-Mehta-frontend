import { apiClient } from "@/lib/api-client";
import type { CheckInResponse, GatekeeperAssignment } from "@/lib/types/gatekeeper";

export async function getGatekeeperAssignments() {
  return apiClient<{ assignments: GatekeeperAssignment[] }>(
    "/gatekeeper/assignments",
    { cache: "no-store" },
  );
}

export async function postCheckIn(body: { qrToken: string; gateId?: string }) {
  return apiClient<CheckInResponse>("/gatekeeper/check-in", {
    method: "POST",
    body,
  });
}
