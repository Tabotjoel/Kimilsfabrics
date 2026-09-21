import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }
  const { name, email, message } = parsed.data;

  const resend = new Resend(apiKey);

  try {
  const { data, error } = await resend.emails.send({
    from: "Kekia Sally Website <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `New message from ${name} via the website`,
    text: `From: ${name} (${email})\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }

  console.log("Email sent:", data?.id);
  return NextResponse.json({ ok: true });
} catch (err) {
  console.error("Unexpected error sending email:", err);
  return NextResponse.json({ error: "Could not send message." }, { status: 500 });
}
}