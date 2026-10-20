"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Variant = {
  id: string;
  label: string;
  price: number;
  stock: number;
  active: boolean;
};

type Product = {
  id: string;
  name: string;
  category: "Vapers" | "Perfumes";
  eyebrow: string;
  description: string;
  variants: Variant[];
  art: string;
  badge?: string;
  active: boolean;
  images: { id: string; url: string; objectKey?: string; alt: string }[];
};

type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

const WHATSAPP_NUMBER = "5493425601607";

const sampleProducts: Product[] = [
  {
    id: "elfbar-rabbeats",
    name: "Elfbar RabBeats 50K",
    category: "Vapers",
    eyebrow: "50.000 pitadas",
    description: "Gran autonomía, indicador digital y sabores intensos para elegir.",
    art: "vape-blue",
    badge: "Más elegido",
    active: true,
    images: [],
    variants: [
      { id: "banana-ice", label: "Banana Ice", price: 30000, stock: 12, active: true },
      { id: "watermelon-ice", label: "Watermelon Ice", price: 30000, stock: 9, active: true },
      { id: "strawberry-ice", label: "Strawberry Ice", price: 31500, stock: 7, active: true },
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
    active: true,
    images: [],
    variants: [
      { id: "blue-razz", label: "Blue Razz", price: 26500, stock: 8, active: true },
      { id: "peach-mango", label: "Peach Mango", price: 26500, stock: 6, active: true },
      { id: "mint", label: "Fresh Mint", price: 26500, stock: 0, active: true },
    ],
  },
  {
    id: "lost-mary",
    name: "Lost Mary MO20000",
    category: "Vapers",
    eyebrow: "20.000 pitadas",
    description: "Formato ergonómico con pantalla y regulación de potencia.",
    art: "vape-violet",
    active: true,
    images: [],
    variants: [
      { id: "grape", label: "Grape Ice", price: 24000, stock: 5, active: true },
      { id: "cherry", label: "Cherry Lemon", price: 24500, stock: 5, active: true },
      { id: "kiwi", label: "Kiwi Passion", price: 24500, stock: 4, active: true },
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
    active: true,
    images: [],
    variants: [
      { id: "30ml", label: "30 ml", price: 28000, stock: 6, active: true },
      { id: "50ml", label: "50 ml", price: 39000, stock: 4, active: true },
      { id: "100ml", label: "100 ml", price: 50000, stock: 3, active: true },
    ],
  },
  {
    id: "club-intense",
    name: "Club de Nuit Intense",
    category: "Perfumes",
    eyebrow: "Cítrico · Cuero · Amaderado",
    description: "Elegante, persistente y con una salida fresca muy marcada.",
    art: "perfume-ice",
    active: true,
    images: [],
    variants: [
      { id: "50ml", label: "50 ml", price: 45500, stock: 5, active: true },
      { id: "105ml", label: "105 ml", price: 72000, stock: 2, active: true },
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
    active: true,
    images: [],
    variants: [
      { id: "50ml", label: "50 ml", price: 36000, stock: 3, active: true },
      { id: "100ml", label: "100 ml", price: 58000, stock: 1, active: true },
    ],
  },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 4h2.1l1.9 9.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6" />
      <circle cx="9.5" cy="19" r="1.25" />
      <circle cx="17" cy="19" r="1.25" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path className="whatsapp-bubble" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" />
      <path className="whatsapp-handset" d="M8.1 7.5c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.5l.7 1.8c.1.3.1.5-.1.7l-.7.8c-.2.2-.1.4 0 .6.8 1.4 1.9 2.4 3.3 3.1.2.1.4.1.6-.1l.9-1.1c.2-.2.4-.3.7-.1l1.9.9c.3.1.5.3.5.5 0 .3-.1 1.4-.8 2-.6.6-1.5.9-2.4.7-1.3-.3-2.9-1-4.7-2.6-2.2-2-3.4-4.4-3.3-5.6 0-.7.3-1.3.6-1.7Z" />
    </svg>
  );
}

function ProductArt({ product }: { product: Product }) {
  const isVape = product.category === "Vapers";

  if (product.images[0]) {
    return (
      <div className="product-photo">
        <img src={product.images[0].url} alt={product.images[0].alt || product.name} />
      </div>
    );
  }

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

export default function Storefront({ products = sampleProducts }: { products?: Product[] }) {
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

  useEffect(() => {
    if (!hasOverlay) return;

    const scrollY = window.scrollY;
    const previous = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previous.overflow;
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [hasOverlay]);

  return (
    <main>
      <header className="site-header">
        <a className="header-brand" href="#inicio" aria-label="ImportGlow, inicio">
          <img src="/importglow-logo.jpeg" alt="" />
          <span><strong>IMPORTGLOW</strong><small>Catálogo online</small></span>
        </a>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir categorías">
          <span />
          <span />
        </button>
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
          <CartIcon />
          <b>{totalItems}</b>
        </button>
      </header>

      <nav className="category-strip" role="tablist" aria-label="Categorías">
        {(["Todos", "Vapers", "Perfumes"] as const).map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => {
              setCategory(item);
              document.getElementById(item === "Todos" ? "inicio" : "catalogo")?.scrollIntoView({ behavior: "smooth" });
            }}
            role="tab"
            aria-selected={category === item}
          >
            {item === "Todos" ? "Inicio" : item}
            <span>{item === "Todos" ? products.length : products.filter((product) => product.category === item).length}</span>
          </button>
        ))}
      </nav>

      <section className="promo-section" id="inicio">
        <div className="promo-banner">
          <p className="kicker">DESTACADOS</p>
          <h1>Elegidos para vos.</h1>
          <a href="#catalogo">Ver catálogo <span>→</span></a>
        </div>
      </section>

      <section className="catalog-section" id="catalogo">
        <div className="section-heading">
          <div>
            <p className="kicker">NOVEDADES</p>
            <h2>{category === "Todos" ? "Nuevos ingresos" : category}</h2>
          </div>
          <button onClick={() => { setCategory("Todos"); setQuery(""); }}>Ver todos</button>
        </div>

        {filteredProducts.length ? (
          <div className="product-grid">
            {filteredProducts.map((product) => {
              const availablePrices = product.variants.filter((variant) => variant.stock > 0).map((variant) => variant.price);
              const startingPrice = availablePrices.length ? Math.min(...availablePrices) : null;
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
                      <span>{startingPrice === null ? <strong>Sin stock</strong> : <>Desde <strong>{currency.format(startingPrice)}</strong></>}</span>
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

      <section className="catalog-cta">
        <div><p className="kicker">ATENCIÓN PERSONALIZADA</p><h2>¿Necesitás ayuda para elegir?</h2><span>Te asesoramos y armamos el pedido con vos.</span></div>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Consultar por WhatsApp <span>→</span></a>
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
        <span><WhatsAppIcon /></span>
        <strong>WhatsApp</strong>
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
