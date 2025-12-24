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
   static async findAll() {
      const query =
         'SELECT c.*,p.pro_name,p.pro_ref_no,cn.client_name FROM collections c JOIN projects p on p.pro_id=c.col_project_id JOIN clients cn ON cn.client_id= p.pro_client_r_id ORDER BY c.col_date DESC';
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query);
         return rows;
      } catch (error) {
         console.error('Error retrieving all collectionss:', error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Get a single collections by ID
   static async findOne(col_id) {
      const query =
         'SELECT c.*,p.pro_name,p.pro_ref_no,cn.client_name FROM collections c JOIN projects p on p.pro_id=c.col_project_id JOIN clients cn ON cn.client_id= p.pro_client_r_id WHERE c.col_id = ?';
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query, [col_id]);
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error(`Error retrieving collections with ID ${col_id}:`, error);
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
