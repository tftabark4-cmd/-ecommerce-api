const pool = require("../config/database");

async function getCategories(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT * FROM categories ORDER BY id DESC
    `);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const categoryId = req.params.id;

    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// Admin-only.
async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;

    const result = await pool.query(`
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name, description || null]);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category name already exists"
      });
    }
    next(error);
  }
}

// Admin-only.
async function updateCategory(req, res, next) {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const result = await pool.query(`
      UPDATE categories
      SET name = $1, description = $2
      WHERE id = $3
      RETURNING *
    `, [name, description, categoryId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category name already exists"
      });
    }
    next(error);
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory
};
