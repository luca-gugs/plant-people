"use node";

import { generateRandomString } from "@oslojs/crypto/random";
import type { RandomReader } from "@oslojs/crypto/random";
import { Resend as ResendAPI } from "resend";
import { Email } from "@convex-dev/auth/providers/Email";

const random: RandomReader = {
  read(bytes: Uint8Array) {
    crypto.getRandomValues(bytes);
  },
};

export const ResendOTP = Email({
  id: "resend-otp",
  maxAge: 60 * 20, // 20 minutes
  async generateVerificationToken() {
    return generateRandomString(random, "0123456789", 8);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    const resend = new ResendAPI(process.env.AUTH_RESEND_KEY);
    const { error } = await resend.emails.send({
      from: process.env.AUTH_EMAIL!,
      to: [email],
      subject: "Your Tend sign-in code",
      html: `<p>Your sign-in code is: <strong>${token}</strong></p><p>This code expires in 20 minutes.</p>`,
    });
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
