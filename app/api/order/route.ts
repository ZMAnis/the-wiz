import { NextResponse } from "next/server";

import { books } from "@/lib/catalogue";
import { product } from "@/lib/content";

export const runtime = "nodejs";

type Intent = "order" | "waitlist";

type Payload = {
  intent: Intent;
  bookId: string;
  name: string;
  email: string;
  note?: string;
  // order only
  phone?: string;
  city?: string;
  address?: string;
  payment?: string;
  quantity?: number;
};

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

const labels: Record<string, string> = {
  name: "name",
  email: "email",
  phone: "phone number",
  city: "city",
  address: "delivery address",
};

function validate(body: Partial<Payload>) {
  const intent: Intent = body.intent === "waitlist" ? "waitlist" : "order";

  const book = books.find((entry) => entry.id === body.bookId);
  if (!book) return { error: "Unknown book." };

  if (intent === "order" && book.status !== "available") {
    return { error: "That book is not on sale yet." };
  }

  const required =
    intent === "order"
      ? (["name", "email", "phone", "city", "address"] as const)
      : (["name", "email"] as const);

  for (const key of required) {
    const value = body[key];
    if (typeof value !== "string" || value.trim().length < 2) {
      return { error: `Please fill in your ${labels[key]}.` };
    }
  }

  if (!isEmail(String(body.email))) {
    return { error: "Please enter a valid email address." };
  }

  if (intent === "order") {
    const quantity = Number(body.quantity);
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > product.maxQuantity
    ) {
      return { error: `Quantity must be between 1 and ${product.maxQuantity}.` };
    }

    if (!product.paymentMethods.includes(body.payment as never)) {
      return { error: "Please choose a payment method." };
    }
  }

  return { intent, book };
}

/** Short, human-readable reference: WZ-4F2K9A. */
function createReference(prefix: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${out}`;
}

/**
 * MVP intake for both orders and waitlist sign-ups.
 *
 * To go live, replace the console.info below with your fulfilment step —
 * an email (Resend / SendGrid), a database row, or a webhook into a
 * spreadsheet. The response shape stays the same, so the UI needs no change.
 */
export async function POST(request: Request) {
  let body: Partial<Payload>;

  try {
    body = (await request.json()) as Partial<Payload>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validate(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { intent, book } = result;
  const reference = createReference(intent === "order" ? "WZ" : "WL");

  const record =
    intent === "order"
      ? {
          intent,
          reference,
          receivedAt: new Date().toISOString(),
          book: { id: book.id, title: book.title },
          quantity: Number(body.quantity),
          total: (book.price ?? 0) * Number(body.quantity),
          currency: product.currency,
          customer: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            city: body.city,
            address: body.address,
          },
          payment: body.payment,
          note: body.note || undefined,
        }
      : {
          intent,
          reference,
          receivedAt: new Date().toISOString(),
          book: { id: book.id, title: book.title },
          customer: { name: body.name, email: body.email },
          note: body.note || undefined,
        };

  console.info(`[the-wiz] ${intent}`, record);

  return NextResponse.json({ reference, intent }, { status: 201 });
}
