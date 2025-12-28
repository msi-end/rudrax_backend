// Hello, this is a Model for Collections!

const pool = require('@/config/dbConfig');

class CollectionsModel {
   constructor(col_amount, col_mode, col_remark, col_date, col_project_id) {
      this.col_amount = col_amount;
      this.col_mode = col_mode;
      this.col_remark = col_remark;
      this.col_date = col_date;
      this.col_project_id = col_project_id;
   }

   // Get all collectionss
   static async findAll(from_date, to_date, getBy_pro_id) {
      let query = `
        SELECT 
          collections.*,
          p.pro_id,
          p.pro_name,
          p.pro_ref_no,
          c.client_name
        FROM collections
        JOIN projects p ON collections.col_project_id = p.pro_id
        LEFT JOIN clients c ON c.client_id = p.pro_client_r_id
      `;

      const params = [];
      if (from_date && to_date) {
         query += ` WHERE DATE(collections.col_date) BETWEEN ? AND ? `;
         params.push(from_date, to_date);
      } else if (from_date) {
         query += ` WHERE DATE(collections.col_date) >= ? `;
         params.push(from_date);
      } else if (to_date) {
         query += ` WHERE DATE(collections.col_date) <= ? `;
         params.push(to_date);
      } else if (getBy_pro_id) {
         query += ` WHERE collections.col_project_id = ? `;
         params.push(getBy_pro_id);
      }

      query += ` ORDER BY collections.col_id DESC`;

      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query, params);
         console.log(rows);
         return rows;
      } catch (err) {
         console.error('Error retrieving all collections:', err);
         throw err;
      } finally {
         connPool.release();
      }
   }

   // Get single collection
   static async findOne(col_id) {
      const query = ` SELECT collections.*, p.pro_id,
          p.pro_name,
          p.pro_ref_no,
          c.client_name
        FROM collections
        JOIN projects p ON collections.col_project_id = p.pro_id
        LEFT JOIN clients c ON c.client_id = p.pro_client_r_id WHERE collections.col_id = ?`;
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query, [col_id]);
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error(`Error retrieving collection with ID ${col_id}:`, error);
         throw error;
      } finally {
         connPool.release();
      }
   }
   // Create a new collections
   static async create(col_amount, col_mode, col_remark, col_date, col_project_id, col_project_phase) {
      const query = `INSERT INTO collections (col_amount, col_mode, col_remark, col_date, col_project_id,col_project_phase) VALUES (?, ?, ?, ?, ?,?)`;
      const connPool = await pool.getConnection();
      try {
         const [result] = await connPool.query(query, [
            col_amount,
            col_mode,
            col_remark,
            col_date,
            col_project_id,
            col_project_phase,
         ]);
         if (result.affectedRows > 0) {
            return {
               col_id: result.insertId,
               col_amount,
               col_mode,
               col_remark,
               col_date,
               col_project_id,
               col_project_phase,
            };
         }
      } catch (error) {
         console.error('Error creating collections:', error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Update an existing collections
   static async update(col_id, col_amount, col_mode, col_remark, col_date, col_project_id, col_project_phase) {
      const query = `UPDATE collections 
                     SET col_amount = ?, col_mode = ?, col_remark = ?, col_date = ?, col_project_id = ? ,col_project_phase=?
                     WHERE col_id = ?`;
      const connPool = await pool.getConnection();
      try {
         const [result] = await connPool.query(query, [
            col_amount,
            col_mode,
            col_remark,
            col_date,
            col_project_id,
            col_project_phase,
            col_id,
         ]);
         return result.affectedRows > 0;
      } catch (error) {
         console.error(`Error updating collections with ID ${col_id}:`, error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Delete a collections
   static async remove(col_id) {
      const query = 'DELETE FROM collections WHERE col_id = ?';
      const connPool = await pool.getConnection();
      try {
         const [result] = await connPool.query(query, [col_id]);
         return result.affectedRows > 0;
      } catch (error) {
         console.error(`Error deleting collections with ID ${col_id}:`, error);
         throw error;
      } finally {
         connPool.release();
      }
   }
}

module.exports = CollectionsModel;
