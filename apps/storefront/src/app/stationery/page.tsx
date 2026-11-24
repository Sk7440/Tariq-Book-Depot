import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

export default function StationeryPage() {
  const stationery = products.filter((product) => product.kind === "stationery");
  return <div className="page-width"><div className="page-title"><span className="eyebrow">The writing table</span><h1>Useful things, beautifully quiet.</h1><p>Notebook, pen, and art-supply demonstrations ready for live Medusa variants when the backend is connected.</p></div><div className="filters"><button className="filter">Notebooks</button><button className="filter">Pens & ink</button><button className="filter">Art supplies</button><button className="filter">Under Rs. 1,000</button></div><div className="product-grid">{stationery.map((product) => <ProductCard key={product.id} product={product} />)}</div></div>;
}
