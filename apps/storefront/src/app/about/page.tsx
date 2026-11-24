import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return <div className="about-page page-width">
    <section className="about-hero"><span className="section-kicker">Tariq Book Depot · Lahore</span><h1>Books and paper, chosen for the lives around them.</h1><div className="ink-rule" /><p>Our shop brings English and Urdu literature, academic texts, notebooks, pens, and fine art supplies together under one practical, warmly editorial roof.</p></section>
    <section className="craft-grid"><article><span>01</span><h2>Authentic editions</h2><p>English and Urdu literature, academic texts, and carefully selected non-fiction.</p></article><article><span>02</span><h2>Archival paper & ink</h2><p>Notebooks, fountain pens, ruling, GSM, and color choices considered for daily use.</p></article><article><span>03</span><h2>Bookshop-grade packing</h2><p>Protective corners and considered wrapping for books, notebooks, and gift sets.</p></article></section>
    <section className="story-band"><div className="story-art"><span>Reading<br />&<br />writing</span></div><div className="story-copy"><span className="section-kicker">From Lahore</span><h2>Two traditions, one useful table.</h2><p>A novel for the commute. A lined notebook for the lecture. A fountain pen for a letter. The store is organized around objects that earn their place in everyday life.</p><p>This site presents demonstration catalog information until the configured store backend is connected.</p></div></section>
    <section className="dispatch-card"><div><span className="section-kicker">Dispatch information</span><h2>From our Lahore worktable</h2></div><dl><div><dt>Location</dt><dd>Lahore, Pakistan</dd></div><div><dt>Customer care</dt><dd>Details published with the live store</dd></div><div><dt>Coverage</dt><dd>Nationwide delivery</dd></div><div><dt>Academic & bulk</dt><dd>Institutional inquiries</dd></div></dl></section>
    <section className="closing-band"><h2>Find the page or pen that belongs with you.</h2><div className="actions"><Link className="button light" href="/books">Browse books <ArrowRight size={17} /></Link><Link className="button outline-light" href="/stationery">Explore stationery</Link></div></section>
  </div>;
}
