import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const {
    customer_name, customer_email, customer_phone,
    payment_method, delivery_method,
    subtotal_amount, shipping_amount, discount_amount, total_amount,
    items
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderNumber = `AC-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await client.query(
      `INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        payment_method, delivery_method,
        subtotal_amount, shipping_amount, discount_amount, total_amount
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, order_number, total_amount`,
      [
        orderNumber, customer_name, customer_email, customer_phone,
        payment_method, delivery_method,
        subtotal_amount, shipping_amount, discount_amount, total_amount
      ]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (
          order_id, item_type, product_id, course_id,
          title_snapshot, unit_price, quantity, line_total
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          order.rows[0].id, item.item_type, item.product_id ?? null, item.course_id ?? null,
          item.title_snapshot, item.unit_price, item.quantity, item.line_total
        ]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ok: true, order: order.rows[0] });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

export default router;