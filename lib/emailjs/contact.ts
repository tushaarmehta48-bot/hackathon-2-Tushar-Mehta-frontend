const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ?? "";
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim() ?? "";
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ?? "";

export function isContactEmailConfigured(): boolean {
  if (!serviceId || !templateId || !publicKey) {
    return false;
  }
  if (/xxxxx/i.test(templateId) || /xxxxx/i.test(serviceId)) {
    return false;
  }
  return true;
}

const topicLabels: Record<string, string> = {
  general: "General question",
  organizer: "I want to host an event",
  booking: "Help with a booking",
  partnership: "Partnership / venue",
  press: "Press",
};

export type ContactFormPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  if (!isContactEmailConfigured()) {
    throw new Error("Contact email is not configured.");
  }

  const emailjs = await import("@emailjs/browser");

  const topic = topicLabels[payload.topic] ?? payload.topic;

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      {
        // EventPulse contact form
        from_name: payload.name,
        reply_to: payload.email,
        user_email: payload.email,
        topic,
        message: payload.message,
        // EmailJS gallery / “Contact Us” presets often use these names
        name: payload.name,
        from_email: payload.email,
        email: payload.email,
        title: topic,
      },
      { publicKey },
    );

    if (result.status !== 200) {
      throw new Error(result.text || `EmailJS returned status ${result.status}`);
    }
  } catch (err: unknown) {
    const detail =
      err &&
      typeof err === "object" &&
      "text" in err &&
      typeof (err as { text: unknown }).text === "string"
        ? (err as { text: string }).text
        : err instanceof Error
          ? err.message
          : "Unknown EmailJS error";
    throw new Error(detail);
  }
}
