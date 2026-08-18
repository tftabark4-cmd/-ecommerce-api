const pool = require("../config/database");
const { logSecurityEvent } = require("../utils/securityLogger");

// Public: anyone (even unauthenticated) can browse products.
async function getProducts(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT id, category_id, name, description,
             price, stock_quantity, sku, is_active, created_at
      FROM products
      ORDER BY id DESC
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

async function getProductById(req, res, next) {
  try {
    const productId = req.params.id; // already validated & coerced

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// Admin-only.
async function createProduct(req, res, next) {
  try {
    const { category_id, name, description, price, stock_quantity, sku } = req.body;

    const result = await pool.query(`
      INSERT INTO products
        (category_id, name, description, price, stock_quantity, sku)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [category_id, name, description || null, price, stock_quantity, sku]);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "SKU already exists"
      });
    }
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "category_id does not reference an existing category"
      });
    }
    next(error);
  }
}

// Admin-only.
async function updateProduct(req, res, next) {
  try {
    const productId = req.params.id;
    const {
      category_id, name, description,
      price, stock_quantity, sku, is_active
    } = req.body;

    const result = await pool.query(`
      UPDATE products
      SET category_id = $1,
          name = $2,
          description = $3,
          price = $4,
          stock_quantity = $5,
          sku = $6,
          is_active = $7,
          updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [category_id, name, description, price,
        stock_quantity, sku, is_active, productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "SKU already exists"
      });
    }
    next(error);
  }
}

// Admin-only.
async function deactivateProduct(req, res, next) {
  try {
    const productId = req.params.id;
    const result = await pool.query(`
      UPDATE products
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    logSecurityEvent("PRODUCT_DEACTIVATED", {
      productId: result.rows[0].id,
      byUserId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
};
