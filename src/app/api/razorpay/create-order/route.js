import { NextResponse } from "next/server";

const ALLOWED_SLUGS = new Set(["potli-bag", "bridal-jewellery-set"]);

export async function POST(request) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "TODO(owner): add Razorpay key id and secret in environment variables." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { productSlug, productTitle, amount } = body || {};

    if (!ALLOWED_SLUGS.has(String(productSlug || ""))) {
      return NextResponse.json({ error: "This product is not eligible for online payment." }, { status: 400 });
    }

    const rupees = Number(amount);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const paise = Math.round(rupees * 100);
    const receipt = `${productSlug}-${Date.now()}`.slice(0, 40);

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: paise,
        currency: "INR",
        receipt,
        notes: {
          product_slug: productSlug,
          product_title: productTitle || productSlug,
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      return NextResponse.json(
        { error: orderData.error?.description || "Could not create Razorpay order." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
    });
  } catch {
    return NextResponse.json({ error: "Payment setup failed." }, { status: 500 });
  }
}
