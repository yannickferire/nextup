"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TOTAL_EARLY_SPOTS = 50;

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  try {
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to add contact to waitlist:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getEarlySpotsRemaining() {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error("Missing RESEND_API_KEY or RESEND_AUDIENCE_ID");
    return TOTAL_EARLY_SPOTS;
  }

  try {
    const { data, error } = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    if (error) {
      console.error("Resend API error:", error);
      return TOTAL_EARLY_SPOTS;
    }

    const contactCount = data?.data?.length ?? 0;
    return Math.max(0, TOTAL_EARLY_SPOTS - contactCount);
  } catch (error) {
    console.error("Failed to get contact count:", error);
    return TOTAL_EARLY_SPOTS;
  }
}
