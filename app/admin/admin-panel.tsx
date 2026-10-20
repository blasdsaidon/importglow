"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/catalog";

function emptyProduct(): Product {
  return {
    id: `producto-${Date.now()}`,
    name: "",
    category: "Vapers",
    eyebrow: "",
    description: "",
    badge: "",
    art: "vape-blue",
    active: true,
    images: [],
    variants: [{ id: crypto.randomUUID(), label: "", price: 0, stock: 0, active: true }],
  };
}

function cloneProduct(product: Product): Product {
  return JSON.parse(JSON.stringify(product)) as Product;
}

export default function AdminPanel({ displayName, signOutPath }: { displayName: string; signOutPath: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const totalStock = useMemo(
    () => products.reduce((total, product) => total + product.variants.reduce((sum, variant) => sum + variant.stock, 0), 0),
    [products],
  );
  const lowStock = useMemo(
    () => products.reduce((total, product) => total + product.variants.filter((variant) => variant.stock > 0 && variant.stock <= 3).length, 0),
    [products],
  );

  async function loadProducts(preferredId?: string) {
    setLoading(true);
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "No se pudo cargar el catálogo.");
      setLoading(false);
      return;
    }
    const nextProducts = data.products as Product[];
    setProducts(nextProducts);
    const nextSelected = nextProducts.find((product) => product.id === preferredId) || nextProducts[0] || null;
    setSelected(nextSelected ? cloneProduct(nextSelected) : null);
    setLoading(false);
  }

  useEffect(() => { void loadProducts(); }, []);

  async function seedProducts() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/seed", { method: "POST" });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(data.error || "No se pudo cargar el catálogo.");
    setMessage("Catálogo inicial cargado. Ya podés editar productos y stock.");
    await loadProducts();
  }

  async function saveCurrent() {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(selected),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) return setMessage(data.error || "No se pudo guardar el producto.");
    setMessage("Cambios guardados correctamente.");
    await loadProducts(data.product.id);
  }

  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    if (!selected || !event.target.files?.length) return;
    setUploading(true);
    setMessage("");
    const uploaded = [...selected.images];
    for (const file of Array.from(event.target.files).slice(0, 6 - uploaded.length)) {
      const body = new FormData();
      body.set("file", file);
      body.set("productId", selected.id);
      const response = await fetch("/api/admin/images", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || `No se pudo subir ${file.name}.`);
        setUploading(false);
        return;
      }
      uploaded.push({ ...data.image, alt: selected.name });
    }
    setSelected({ ...selected, images: uploaded });
    setUploading(false);
    event.target.value = "";
  }

  function updateVariant(index: number, field: "label" | "price" | "stock" | "active", value: string | number | boolean) {
    if (!selected) return;
    const variants = selected.variants.map((variant, currentIndex) =>
      currentIndex === index ? { ...variant, [field]: value } : variant,
    );
    setSelected({ ...selected, variants });
  }

  if (loading) return <div className="admin-loading">Cargando panel…</div>;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/">IMPORT<strong>GLOW</strong></Link>
        <div>
          <span>Hola, {displayName}</span>
          <Link href="/" target="_blank">Ver tienda ↗</Link>
          <a href={signOutPath}>Salir</a>
        </div>
      </header>

      <section className="admin-intro">
        <div><p>PANEL DE ADMINISTRACIÓN</p><h1>Productos y stock</h1><span>Editá todo desde una sola pantalla.</span></div>
        <button className="admin-primary" onClick={() => { setSelected(emptyProduct()); setMessage(""); }}>＋ Nuevo producto</button>
      </section>

      <section className="admin-stats" aria-label="Resumen del catálogo">
        <div><span>Productos</span><strong>{products.length}</strong></div>
        <div><span>Unidades disponibles</span><strong>{totalStock}</strong></div>
        <div><span>Variantes con poco stock</span><strong>{lowStock}</strong></div>
      </section>

      {message && <div className="admin-message" role="status">{message}</div>}

      {!products.length && !selected ? (
        <section className="admin-empty">
          <span>01</span>
          <h2>Empezá con el catálogo que ya tenés</h2>
          <p>Cargaremos los seis productos actuales para que puedas modificar precios y cantidades.</p>
          <button className="admin-primary" disabled={saving} onClick={seedProducts}>{saving ? "Cargando…" : "Cargar catálogo actual"}</button>
        </section>
      ) : (
        <div className="admin-workspace">
          <aside className="admin-products">
            <div className="admin-list-heading"><strong>Catálogo</strong><span>{products.length} productos</span></div>
            {products.map((product) => {
              const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
              return (
                <button key={product.id} className={selected?.id === product.id ? "selected" : ""} onClick={() => { setSelected(cloneProduct(product)); setMessage(""); }}>
                  <span className="admin-thumb">{product.images[0] ? <img src={product.images[0].url} alt="" /> : product.category.slice(0, 1)}</span>
                  <span><strong>{product.name}</strong><small>{product.category} · {stock} unidades</small></span>
                  <i className={product.active ? "active" : "hidden"}>{product.active ? "Visible" : "Oculto"}</i>
                </button>
              );
            })}
          </aside>

          {selected && (
            <section className="admin-editor">
              <div className="admin-editor-heading">
                <div><p>{products.some((product) => product.id === selected.id) ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}</p><h2>{selected.name || "Producto sin nombre"}</h2></div>
                <label className="visibility-switch"><input type="checkbox" checked={selected.active} onChange={(event) => setSelected({ ...selected, active: event.target.checked })} /><span />{selected.active ? "Visible en la tienda" : "Oculto"}</label>
              </div>

              <div className="admin-form-grid">
                <label className="wide">Nombre del producto<input value={selected.name} onChange={(event) => setSelected({ ...selected, name: event.target.value })} placeholder="Ej. Ignite V250" /></label>
                <label>Categoría<select value={selected.category} onChange={(event) => { const category = event.target.value as Product["category"]; setSelected({ ...selected, category, art: category === "Vapers" ? "vape-blue" : "perfume-amber" }); }}><option>Vapers</option><option>Perfumes</option></select></label>
                <label>Etiqueta <small>(opcional)</small><input value={selected.badge || ""} onChange={(event) => setSelected({ ...selected, badge: event.target.value })} placeholder="Ej. Nuevo" /></label>
                <label className="wide">Descripción breve<input value={selected.eyebrow} onChange={(event) => setSelected({ ...selected, eyebrow: event.target.value })} placeholder="Ej. 25.000 pitadas" /></label>
                <label className="wide">Descripción<textarea rows={3} value={selected.description} onChange={(event) => setSelected({ ...selected, description: event.target.value })} placeholder="Contá lo más importante del producto" /></label>
              </div>

              <div className="admin-section-heading"><div><h3>Imágenes</h3><p>La primera imagen será la portada del producto.</p></div><label className="admin-upload">{uploading ? "Subiendo…" : "＋ Agregar imágenes"}<input type="file" accept="image/*" multiple disabled={uploading || selected.images.length >= 6} onChange={uploadImages} /></label></div>
              <div className="admin-images">
                {selected.images.map((image, index) => (
                  <div key={image.id}><img src={image.url} alt={image.alt} /><span>{index === 0 ? "Portada" : `Imagen ${index + 1}`}</span><button onClick={() => setSelected({ ...selected, images: selected.images.filter((item) => item.id !== image.id) })} aria-label="Quitar imagen">×</button></div>
                ))}
                {!selected.images.length && <div className="admin-image-placeholder"><b>Sin imágenes</b><span>Mientras tanto se usa la ilustración del catálogo.</span></div>}
              </div>

              <div className="admin-section-heading"><div><h3>Variantes, precio y stock</h3><p>Usá una fila por sabor, tamaño o presentación.</p></div><button className="admin-secondary" onClick={() => setSelected({ ...selected, variants: [...selected.variants, { id: crypto.randomUUID(), label: "", price: 0, stock: 0, active: true }] })}>＋ Agregar variante</button></div>
              <div className="admin-variants">
                <div className="variant-labels"><span>Variante</span><span>Precio</span><span>Stock</span><span>Estado</span><span /></div>
                {selected.variants.map((variant, index) => (
                  <div className="admin-variant" key={variant.id}>
                    <input value={variant.label} onChange={(event) => updateVariant(index, "label", event.target.value)} placeholder="Ej. Banana Ice" aria-label="Nombre de variante" />
                    <label className="money-input"><span>$</span><input type="number" min="0" value={variant.price || ""} onChange={(event) => updateVariant(index, "price", Number(event.target.value))} aria-label="Precio" /></label>
                    <input type="number" min="0" value={variant.stock} onChange={(event) => updateVariant(index, "stock", Number(event.target.value))} aria-label="Cantidad en stock" />
                    <label className="small-switch"><input type="checkbox" checked={variant.active} onChange={(event) => updateVariant(index, "active", event.target.checked)} /><span>{variant.active ? "Activa" : "Oculta"}</span></label>
                    <button className="remove-variant" disabled={selected.variants.length === 1} onClick={() => setSelected({ ...selected, variants: selected.variants.filter((_, currentIndex) => currentIndex !== index) })} aria-label="Quitar variante">×</button>
                  </div>
                ))}
              </div>

              <footer className="admin-savebar">
                <span>Los cambios se verán en la tienda al guardar.</span>
                <button className="admin-primary" disabled={saving || uploading} onClick={saveCurrent}>{saving ? "Guardando…" : "Guardar producto"}</button>
              </footer>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
