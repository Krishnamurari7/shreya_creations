/** Ready-to-ship shop items eligible for instant Razorpay checkout (not custom stitch). */
export function isReadyMadeProduct(product) {
  if (!product) return false;
  if (product.ready_made === true || product.readyMade === true) return true;
  if (product.order_type === "ready_made" || product.orderType === "ready_made") return true;
  const slug = String(product.slug || "");
  return slug === "potli-bag" || slug === "bridal-jewellery-set";
}

export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";
}
