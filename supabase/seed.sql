insert into public.products
  (id, name, category, eyebrow, description, badge, art, active, sort_order)
values
  ('elfbar-rabbeats', 'Elfbar RabBeats 50K', 'Vapers', '50.000 pitadas', 'Gran autonomía, indicador digital y sabores intensos para elegir.', 'Más elegido', 'vape-blue', true, 0),
  ('ignite-v250', 'Ignite V250', 'Vapers', '25.000 pitadas', 'Diseño compacto, doble modo de potencia y carga USB-C.', 'Nuevo', 'vape-lime', true, 1),
  ('lost-mary', 'Lost Mary MO20000', 'Vapers', '20.000 pitadas', 'Formato ergonómico con pantalla y regulación de potencia.', null, 'vape-violet', true, 2),
  ('asad-black', 'Asad Black', 'Perfumes', 'Ámbar · Vainilla · Especias', 'Una fragancia intensa y envolvente, ideal para la noche.', 'Bestseller', 'perfume-amber', true, 3),
  ('club-intense', 'Club de Nuit Intense', 'Perfumes', 'Cítrico · Cuero · Amaderado', 'Elegante, persistente y con una salida fresca muy marcada.', null, 'perfume-ice', true, 4),
  ('yara-rose', 'Yara Rose', 'Perfumes', 'Floral · Dulce · Cremoso', 'Suave y femenino, con un corazón floral y fondo avainillado.', 'Últimas unidades', 'perfume-rose', true, 5)
on conflict (id) do nothing;

insert into public.product_variants
  (product_id, id, label, price, stock, active, sort_order)
values
  ('elfbar-rabbeats', 'banana-ice', 'Banana Ice', 30000, 12, true, 0),
  ('elfbar-rabbeats', 'watermelon-ice', 'Watermelon Ice', 30000, 9, true, 1),
  ('elfbar-rabbeats', 'strawberry-ice', 'Strawberry Ice', 31500, 7, true, 2),
  ('ignite-v250', 'blue-razz', 'Blue Razz', 26500, 8, true, 0),
  ('ignite-v250', 'peach-mango', 'Peach Mango', 26500, 6, true, 1),
  ('ignite-v250', 'mint', 'Fresh Mint', 26500, 0, true, 2),
  ('lost-mary', 'grape', 'Grape Ice', 24000, 5, true, 0),
  ('lost-mary', 'cherry', 'Cherry Lemon', 24500, 5, true, 1),
  ('lost-mary', 'kiwi', 'Kiwi Passion', 24500, 4, true, 2),
  ('asad-black', '30ml', '30 ml', 28000, 6, true, 0),
  ('asad-black', '50ml', '50 ml', 39000, 4, true, 1),
  ('asad-black', '100ml', '100 ml', 50000, 3, true, 2),
  ('club-intense', '50ml', '50 ml', 45500, 5, true, 0),
  ('club-intense', '105ml', '105 ml', 72000, 2, true, 1),
  ('yara-rose', '50ml', '50 ml', 36000, 3, true, 0),
  ('yara-rose', '100ml', '100 ml', 58000, 1, true, 1)
on conflict (product_id, id) do nothing;
