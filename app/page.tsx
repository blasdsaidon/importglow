"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Variant = {
  id: string;
  label: string;
  price: number;
  stock: boolean;
};

type Product = {
  id: string;
  name: string;
  category: "Vapers" | "Perfumes";
  eyebrow: string;
  description: string;
  variants: Variant[];
  art: "vape-blue" | "vape-lime" | "vape-violet" | "perfume-amber" | "perfume-ice" | "perfume-rose";
  badge?: string;
};

type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

const WHATSAPP_NUMBER = "5493425601607";

const products: Product[] = [
  {
    id: "elfbar-rabbeats",
    name: "Elfbar RabBeats 50K",
    category: "Vapers",
    eyebrow: "50.000 pitadas",
    description: "Gran autonomía, indicador digital y sabores intensos para elegir.",
    art: "vape-blue",
    badge: "Más elegido",
    variants: [
      { id: "banana-ice", label: "Banana Ice", price: 30000, stock: true },
      { id: "watermelon-ice", label: "Watermelon Ice", price: 30000, stock: true },
      { id: "strawberry-ice", label: "Strawberry Ice", price: 31500, stock: true },
    ],
  },
  {
    id: "ignite-v250",
    name: "Ignite V250",
    category: "Vapers",
    eyebrow: "25.000 pitadas",
    description: "Diseño compacto, doble modo de potencia y carga USB-C.",
    art: "vape-lime",
    badge: "Nuevo",
    variants: [
      { id: "blue-razz", label: "Blue Razz", price: 26500, stock: true },
      { id: "peach-mango", label: "Peach Mango", price: 26500, stock: true },
      { id: "mint", label: "Fresh Mint", price: 26500, stock: false },
    ],
  },
  {
    id: "lost-mary",
    name: "Lost Mary MO20000",
    category: "Vapers",
    eyebrow: "20.000 pitadas",
    description: "Formato ergonómico con pantalla y regulación de potencia.",
    art: "vape-violet",
    variants: [
      { id: "grape", label: "Grape Ice", price: 24000, stock: true },
      { id: "cherry", label: "Cherry Lemon", price: 24500, stock: true },
      { id: "kiwi", label: "Kiwi Passion", price: 24500, stock: true },
    ],
  },
  {
    id: "asad-black",
    name: "Asad Black",
    category: "Perfumes",
    eyebrow: "Ámbar · Vainilla · Especias",
    description: "Una fragancia intensa y envolvente, ideal para la noche.",
    art: "perfume-amber",
    badge: "Bestseller",
    variants: [
      { id: "30ml", label: "30 ml", price: 28000, stock: true },
      { id: "50ml", label: "50 ml", price: 39000, stock: true },
      { id: "100ml", label: "100 ml", price: 50000, stock: true },
    ],
  },
  {
    id: "club-intense",
    name: "Club de Nuit Intense",
    category: "Perfumes",
    eyebrow: "Cítrico · Cuero · Amaderado",
    description: "Elegante, persistente y con una salida fresca muy marcada.",
    art: "perfume-ice",
    variants: [
      { id: "50ml", label: "50 ml", price: 45500, stock: true },
      { id: "105ml", label: "105 ml", price: 72000, stock: true },
    ],
  },
  {
    id: "yara-rose",
    name: "Yara Rose",
    category: "Perfumes",
    eyebrow: "Floral · Dulce · Cremoso",
    description: "Suave y femenino, con un corazón floral y fondo avainillado.",
    art: "perfume-rose",
    badge: "Últimas unidades",
    variants: [
      { id: "50ml", label: "50 ml", price: 36000, stock: true },
      { id: "100ml", label: "100 ml", price: 58000, stock: true },
    ],
  },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function ProductArt({ product }: { product: Product }) {
  const isVape = product.category === "Vapers";

  return (
    <div className={`product-art ${product.art}`} aria-hidden="true">
      <span className="art-glow" />
      {isVape ? (
        <div className="vape-device">
          <span className="vape-cap" />
          <span className="vape-screen">{product.id === "elfbar-rabbeats" ? "50K" : "⚡"}</span>
          <strong>{product.name.split(" ")[0]}</strong>
          <small>IMPORTGLOW</small>
        </div>
      ) : (
        <div className="perfume-bottle">
          <span className="bottle-cap" />
          <span className="bottle-label">
            <small>IMPORTGLOW</small>
            <strong>{product.name}</strong>
            <i>EAU DE PARFUM</i>
          </span>
        </div>
      )}
      <span className="art-shadow" />
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState<"Todos" | "Vapers" | "Perfumes">("Todos");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [delivery, setDelivery] = useState("Retiro coordinado");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("importglow-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // A fresh cart is fine if browser storage is unavailable.
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem("importglow-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return products.filter((product) => {
      const categoryMatch = category === "Todos" || product.category === category;
      const textMatch =
        !normalized ||
        product.name.toLocaleLowerCase("es").includes(normalized) ||
        product.eyebrow.toLocaleLowerCase("es").includes(normalized) ||
        product.variants.some((variant) => variant.label.toLocaleLowerCase("es").includes(normalized));
      return categoryMatch && textMatch;
    });
  }, [category, query]);

  const cartDetails = useMemo(
    () =>
      cart.flatMap((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        const variant = product?.variants.find((candidate) => candidate.id === item.variantId);
        return product && variant ? [{ ...item, product, variant }] : [];
      }),
    [cart],
  );

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartDetails.reduce((total, item) => total + item.variant.price * item.quantity, 0);

  function showProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedVariant("");
  }

  function addToCart(product: Product, variantId: string) {
    if (!variantId) return;
    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === product.id && item.variantId === variantId,
      );
      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { productId: product.id, variantId, quantity: 1 }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  }

  function updateQuantity(productId: string, variantId: string, delta: number) {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.productId !== productId || item.variantId !== variantId) return [item];
        const quantity = item.quantity + delta;
        return quantity > 0 ? [{ ...item, quantity }] : [];
      }),
    );
  }

  function removeItem(productId: string, variantId: string) {
    setCart((current) =>
      current.filter((item) => item.productId !== productId || item.variantId !== variantId),
    );
  }

  function beginCheckout() {
    if (!cart.length) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const customerWhatsapp = String(form.get("whatsapp") || "");
    const email = String(form.get("email") || "");
    const payment = String(form.get("payment") || "");
    const address = String(form.get("address") || "");
    const city = String(form.get("city") || "");
    const notes = String(form.get("notes") || "");

    const itemLines = cartDetails.map(
      ({ product, variant, quantity }) =>
        `• ${quantity} × ${product.name} — ${variant.label} — ${currency.format(variant.price * quantity)}`,
    );
    const message = [
      "✨ *NUEVO PEDIDO — IMPORTGLOW*",
      "",
      `*Cliente:* ${name}`,
      `*WhatsApp:* ${customerWhatsapp}`,
      email ? `*Email:* ${email}` : "",
      `*Entrega:* ${delivery}`,
      address ? `*Dirección:* ${address}` : "",
      city ? `*Localidad:* ${city}` : "",
      `*Forma de pago:* ${payment}`,
      "",
      "*Productos:*",
      ...itemLines,
      "",
      `*Total estimado: ${currency.format(subtotal)}*`,
      notes ? `\n*Observaciones:* ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  }

  const hasOverlay = menuOpen || cartOpen || checkoutOpen || Boolean(selectedProduct);

  return (
    <main>
      <header className="site-header">
        <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir categorías">
          <span />
          <span />
        </button>
        <a className="brand" href="#inicio" aria-label="ImportGlow, inicio">
          <span>IMPORT</span>
          <strong>GLOW</strong>
        </a>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar perfume, vape o sabor..."
            aria-label="Buscar productos"
          />
        </label>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${totalItems} productos`}>
          <span aria-hidden="true">▱</span>
          <b>{totalItems}</b>
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="kicker">IMPORTADOS · SELECCIÓN PREMIUM</p>
          <h1>
            Encontrá tu próxima
            <span>obsesión.</span>
          </h1>
          <p className="hero-text">
            Perfumes que dejan huella y vapers con sabores que se sienten. Elegí tu variante y pedí directo por WhatsApp.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#catalogo">Explorar catálogo <span>↘</span></a>
            <a className="text-link" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Hablar con nosotros ↗</a>
          </div>
          <div className="trust-row">
            <span><b>01</b> Productos seleccionados</span>
            <span><b>02</b> Atención personalizada</span>
            <span><b>03</b> Compra simple</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <div className="hero-word">GLOW</div>
          <div className="hero-vape"><i>50K</i><strong>RABBEATS</strong></div>
          <div className="hero-perfume"><i /><strong>NOIR</strong><small>EAU DE PARFUM</small></div>
          <p>PERFUMES <span>×</span> VAPERS</p>
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading">
          <div>
            <p className="kicker">CATÁLOGO</p>
            <h2>Elegidos para vos</h2>
          </div>
          <p>Precios y disponibilidad de muestra. Seleccioná cada producto para ver sus variantes.</p>
        </div>

        <div className="category-tabs" role="tablist" aria-label="Categorías">
          {(["Todos", "Vapers", "Perfumes"] as const).map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              role="tab"
              aria-selected={category === item}
            >
              {item}
              <span>{item === "Todos" ? products.length : products.filter((product) => product.category === item).length}</span>
            </button>
          ))}
        </div>

        {filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const startingPrice = Math.min(...product.variants.filter((variant) => variant.stock).map((variant) => variant.price));
              return (
                <article className="product-card" key={product.id}>
                  <button className="product-image-button" onClick={() => showProduct(product)} aria-label={`Ver ${product.name}`}>
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                    <ProductArt product={product} />
                    <span className="view-product">Ver producto ↗</span>
                  </button>
                  <div className="product-card-body">
                    <p>{product.category} · {product.eyebrow}</p>
                    <button className="product-title" onClick={() => showProduct(product)}>{product.name}</button>
                    <div className="product-card-footer">
                      <span>Desde <strong>{currency.format(startingPrice)}</strong></span>
                      <button onClick={() => showProduct(product)} aria-label={`Elegir variante de ${product.name}`}>+</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-search">
            <strong>No encontramos coincidencias</strong>
            <p>Probá buscar otro producto, tamaño o sabor.</p>
            <button onClick={() => { setQuery(""); setCategory("Todos"); }}>Ver todo el catálogo</button>
          </div>
        )}
      </section>

      <section className="how-section">
        <p className="kicker">ASÍ DE SIMPLE</p>
        <div className="how-grid">
          <div><b>1</b><strong>Elegí</strong><p>Explorá productos y seleccioná tu sabor o tamaño.</p></div>
          <div><b>2</b><strong>Armá</strong><p>Sumá al carrito y completá tus datos de entrega.</p></div>
          <div><b>3</b><strong>Confirmá</strong><p>Enviá el pedido por WhatsApp y coordinamos todo.</p></div>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#inicio"><span>IMPORT</span><strong>GLOW</strong></a>
        <p>Tu selección de perfumes y vapers importados.</p>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp ↗</a>
        <small>Venta de productos con nicotina exclusiva para mayores de 18 años.</small>
      </footer>

      <a
        className="floating-whatsapp"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola ImportGlow, quería hacer una consulta.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Consultar directamente por WhatsApp"
      >
        <em>¿Te ayudamos?</em>
        <span aria-hidden="true">✆</span>
      </a>

      {hasOverlay && <button className="page-overlay" aria-label="Cerrar" onClick={() => { setMenuOpen(false); setCartOpen(false); setCheckoutOpen(false); setSelectedProduct(null); }} />}

      <aside className={`side-panel menu-panel ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="panel-heading">
          <div><p className="kicker">EXPLORAR</p><h2>Categorías</h2></div>
          <button className="close-button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button>
        </div>
        <nav>
          {(["Todos", "Vapers", "Perfumes"] as const).map((item) => (
            <button key={item} onClick={() => { setCategory(item); setMenuOpen(false); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span>{item === "Todos" ? "Inicio" : item}</span><b>↗</b>
            </button>
          ))}
        </nav>
        <div className="panel-note"><span>+18</span><p>Los productos con nicotina son exclusivamente para mayores de edad.</p></div>
      </aside>

      <aside className={`side-panel cart-panel ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="panel-heading">
          <div><p className="kicker">CARRITO</p><h2>Tu pedido</h2></div>
          <button className="close-button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button>
        </div>
        <div className="cart-items">
          {cartDetails.length ? cartDetails.map(({ product, variant, quantity }) => (
            <div className="cart-item" key={`${product.id}-${variant.id}`}>
              <div>
                <strong>{product.name}</strong>
                <span>{variant.label} · {currency.format(variant.price)}</span>
              </div>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(product.id, variant.id, -1)} aria-label="Quitar uno">−</button>
                <b>{quantity}</b>
                <button onClick={() => updateQuantity(product.id, variant.id, 1)} aria-label="Agregar uno">+</button>
                <button className="remove-button" onClick={() => removeItem(product.id, variant.id)} aria-label="Eliminar producto">×</button>
              </div>
            </div>
          )) : (
            <div className="empty-cart"><span>＋</span><strong>Tu carrito está vacío</strong><p>Agregá productos para comenzar el pedido.</p></div>
          )}
        </div>
        <div className="cart-summary">
          <div><span>Subtotal</span><strong>{currency.format(subtotal)}</strong></div>
          <div className="cart-total"><span>Total estimado</span><strong>{currency.format(subtotal)}</strong></div>
          <button className="primary-button full-button" onClick={beginCheckout} disabled={!cart.length}>Continuar pedido <span>→</span></button>
          <small>El envío se coordina por WhatsApp.</small>
        </div>
      </aside>

      {selectedProduct && (
        <section className="modal product-modal" role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
          <button className="close-button floating-close" onClick={() => setSelectedProduct(null)} aria-label="Cerrar producto">×</button>
          <div className="detail-art"><ProductArt product={selectedProduct} /></div>
          <div className="detail-copy">
            <p className="kicker">{selectedProduct.category}</p>
            <h2>{selectedProduct.name}</h2>
            <p className="detail-eyebrow">{selectedProduct.eyebrow}</p>
            <p className="detail-description">{selectedProduct.description}</p>
            <div className="variant-heading"><strong>Elegí una opción</strong><span>Precio y stock por variante</span></div>
            <div className="variant-grid">
              {selectedProduct.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={selectedVariant === variant.id ? "selected" : ""}
                  disabled={!variant.stock}
                  onClick={() => setSelectedVariant(variant.id)}
                >
                  <span>{variant.label}</span>
                  <strong>{currency.format(variant.price)}</strong>
                  <small>{variant.stock ? "Disponible" : "Sin stock"}</small>
                </button>
              ))}
            </div>
            <button className="primary-button full-button detail-add" disabled={!selectedVariant} onClick={() => addToCart(selectedProduct, selectedVariant)}>
              {selectedVariant ? "Agregar al pedido" : "Elegí una opción"} <span>＋</span>
            </button>
            <small className="age-note">Producto de muestra. Vapers: venta exclusiva para mayores de 18 años.</small>
          </div>
        </section>
      )}

      {checkoutOpen && (
        <section className="modal checkout-modal" role="dialog" aria-modal="true" aria-label="Datos del pedido">
          <button className="close-button floating-close" onClick={() => setCheckoutOpen(false)} aria-label="Cerrar formulario">×</button>
          <div className="checkout-heading"><p className="kicker">FINALIZAR</p><h2>Datos del pedido</h2><p>Completá tus datos y te llevamos a WhatsApp con el mensaje listo.</p></div>
          <form onSubmit={submitOrder}>
            <div className="form-grid">
              <label>Nombre y apellido<input name="name" required autoComplete="name" placeholder="Tu nombre" /></label>
              <label>WhatsApp<input name="whatsapp" required inputMode="tel" autoComplete="tel" placeholder="Ej. 342 555 1234" /></label>
              <label>Email <span>(opcional)</span><input name="email" type="email" autoComplete="email" placeholder="nombre@email.com" /></label>
              <label>Forma de entrega<select value={delivery} onChange={(event) => setDelivery(event.target.value)}><option>Retiro coordinado</option><option>Envío en Santa Fe</option><option>Envío a otra localidad</option></select></label>
              <label>Forma de pago<select name="payment"><option>Efectivo</option><option>Transferencia</option></select></label>
              {delivery !== "Retiro coordinado" && <label>Localidad<input name="city" required placeholder="Tu localidad" /></label>}
            </div>
            {delivery !== "Retiro coordinado" && <label>Dirección de entrega<input name="address" required placeholder="Calle, número y referencias" /></label>}
            <label>Observaciones <span>(opcional)</span><textarea name="notes" rows={3} placeholder="Horario, aclaraciones o consultas..." /></label>
            <div className="order-total">
              <div><span>Productos</span><strong>{currency.format(subtotal)}</strong></div>
              <div><span>Envío</span><strong>A coordinar</strong></div>
              <div><span>Total estimado</span><strong>{currency.format(subtotal)}</strong></div>
            </div>
            <button className="primary-button full-button" type="submit">Realizar pedido por WhatsApp <span>↗</span></button>
            <small className="form-note">Al continuar, se abrirá WhatsApp con los datos y productos de tu pedido.</small>
          </form>
        </section>
      )}
    </main>
  );
}
