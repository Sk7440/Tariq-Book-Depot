import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return <div className="about-page page-width">
    <section className="about-hero"><span className="section-kicker">Tariq Book Depot · Lahore</span><h1>Everyday stationery for study, work, and home.</h1><div className="ink-rule" /><p>Browse the paper, erasers, pencils, scales, and sharpeners currently listed in our catalog.</p></section>
    <section className="craft-grid"><article><span>Paper</span><h2>Paper for printing and writing</h2><p>BLC and Copy Mate paper products are listed with the sizes, weights, and sheet quantities provided.</p></article><article><span>Pencils and erasers</span><h2>School and office basics</h2><p>ORO and Piano pencils, plus Oro eraser packs, are described using the supplied product details.</p></article><article><span>Desk tools</span><h2>Scales and sharpeners</h2><p>Dux and Oro rulers and sharpeners are listed with their stated lengths and pack quantities.</p></article></section>
    <section className="story-band"><div className="story-art"><span>Paper<br />&<br />tools</span></div><div className="story-copy"><span className="section-kicker">The catalog</span><h2>Product details from the source.</h2><p>Descriptions, available specifications, prices, and photographs are taken from the product information supplied to the store.</p><p>Checkout remains unavailable until the Medusa commerce service is connected.</p></div></section>
    <section className="closing-band"><h2>Browse the available products.</h2><div className="actions"><Link className="button light" href="/shop">Shop all products <ArrowRight size={17} /></Link><Link className="button outline-light" href="/stationery">Browse stationery</Link></div></section>
  </div>;
}
