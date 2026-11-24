import Link from "next/link";

export default function OrderConfirmationPage() {
  return <div className="page-width confirmation-page"><article className="confirmation-card"><span className="section-kicker">Order confirmation</span><h1>Confirmation is shown by the live order service.</h1><p>This route is ready for a Medusa order response, but no order has been submitted.</p><Link className="button" href="/books">Continue shopping</Link></article></div>;
}
