import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  const q = await pool.query(`
    SELECT id, slug, title, description, category, level, format,
           instructor_name, duration_label, lessons_count, students_count,
           rating, review_count, price, old_price, image_url
    FROM courses
    WHERE is_published = true
    ORDER BY created_at DESC
  `);
  res.json(q.rows);
});

router.get('/:id', async (req, res) => {
  const q = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
  if (!q.rows.length) return res.status(404).json({ error: 'Course not found' });
  res.json(q.rows[0]);
});

export default router;