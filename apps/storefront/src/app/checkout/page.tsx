import Link from "next/link";

export default function CheckoutPage() {
  return <div className="page-width"><div className="page-title"><span className="eyebrow">Five considered steps</span><h1>Checkout</h1><p>COD is the planned first payment method. This foundation does not submit an order until a configured Medusa backend is available.</p></div><form className="form" action="/cart"><label>Email<input type="email" name="email" required placeholder="you@example.com" /></label><label>Full name<input name="name" required /></label><label>Address<textarea name="address" required rows={4} placeholder="House, street, area, city, province" /></label><div className="notice">Shipping options, tax, payment sessions, and order completion are backend-owned. No fake success state is shown here.</div><button className="button" type="submit">Return to cart</button><Link className="text-link" href="/books">Continue shopping</Link></form></div>;
}
