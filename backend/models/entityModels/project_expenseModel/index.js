const pool = require('@/config/dbConfig');

class ExpenseModel {
   constructor(
      exp_type,
      exp_name,
      exp_amount,
      exp_mode,
      exp_status,
      exp_attachment_url,
      exp_remark,
      exp_paid_by,
      exp_date,
      exp_category,
      exp_project_id
   ) {
      this.exp_type = exp_type;
      this.exp_name = exp_name;
      this.exp_amount = exp_amount;
      this.exp_mode = exp_mode;
      this.exp_status = exp_status;
      this.exp_attachment_url = exp_attachment_url;
      this.exp_remark = exp_remark;
      this.exp_paid_by = exp_paid_by;
      this.exp_date = exp_date;
      this.exp_category = exp_category;
      this.exp_project_id = exp_project_id;
   }

   // Get all project_expenses
   static async findAll() {
      const query = 'SELECT pe.*,p.pro_name,p.pro_ref_no,c.client_name FROM `project_expenses` pe LEFT JOIN projects p ON p.pro_id=pe.exp_project_id LEFT JOIN clients c ON c.client_id=p.pro_client_r_id ORDER BY pe.exp_date DESC';
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query);
         return rows;
      } catch (error) {
         console.error('Error retrieving all project_expenses:', error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Get a single expense by ID
   static async findOne(exp_id) {
      const query = 'SELECT pe.*,p.pro_name,p.pro_ref_no,c.client_name FROM `project_expenses` pe LEFT JOIN projects p ON p.pro_id=pe.exp_project_id LEFT JOIN clients c ON c.client_id=p.pro_client_r_id WHERE pe.exp_id = ?';
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query, [exp_id]);
         return rows.length > 0 ? rows[0] : null;
      } catch (error) {
         console.error(`Error retrieving expense with ID ${exp_id}:`, error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Create a new expense
   static async create(
      exp_type,
      exp_name,
      exp_amount,
      exp_mode,
      exp_status,
      exp_attachment_url,
      exp_remark,
      exp_paid_by,
      exp_date,
      exp_category,
      exp_project_id,
      exp_project_phase
   ) {
      const query = `
         INSERT INTO project_expenses (
            exp_type, exp_name, exp_amount, exp_mode, exp_status, 
            exp_attachment_url, exp_remark, exp_paid_by, 
            exp_date, exp_category, exp_project_id,exp_project_phase
         ) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `;
      const connPool = await pool.getConnection();
      try {
         const [result] = await connPool.query(query, [
            exp_type,
            exp_name,
            exp_amount,
            exp_mode,
            exp_status,
            exp_attachment_url,
            exp_remark,
            exp_paid_by,
            exp_date,
            exp_category,
            exp_project_id,
            exp_project_phase,
         ]);
         if (result.affectedRows > 0) {
            return {
               status: true,
               msg: 'Expense created successfully.',
               exp_id: result.insertId,
            };
         }
         return { status: false, msg: 'Failed to create expense.' };
      } catch (error) {
         console.error('Error creating expense:', error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Update an existing expense
   static async update(
      exp_id,
      exp_type,
      exp_name,
      exp_amount,
      exp_mode,
      exp_status,
      exp_attachment_url,
      exp_remark,
      exp_paid_by,
      exp_date,
      exp_category,
      exp_project_id,
      exp_project_phase
   ) {
      const query = `
         UPDATE project_expenses SET
            exp_type = ?,
            exp_name = ?,
            exp_amount = ?,
            exp_mode = ?,
            exp_status = ?,
            exp_attachment_url = ?,
            exp_remark = ?,
            exp_paid_by = ?,
            exp_date = ?,
            exp_category = ?,
            exp_project_id = ?,
            exp_project_phase=?
         WHERE exp_id = ?
      `;
      const connPool = await pool.getConnection();
      try {
         const [result] = await connPool.query(query, [
            exp_type,
            exp_name,
            exp_amount,
            exp_mode,
            exp_status,
            exp_attachment_url,
            exp_remark,
            exp_paid_by,
            exp_date,
            exp_category,
            exp_project_id,
            exp_project_phase,
            exp_id,
         ]);
         return {
            status: result.affectedRows > 0,
            msg: result.affectedRows > 0 ? 'Expense updated successfully.' : 'No expense updated.',
         };
      } catch (error) {
         console.error(`Error updating expense with ID ${exp_id}:`, error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   // Delete an expense
   static async remove(exp_id) {
      const query = 'DELETE FROM project_expenses WHERE exp_id = ?';
      const connPool = await pool.getConnection();
      try {
         const [result] = await connPool.query(query, [exp_id]);
         return {
            status: result.affectedRows > 0,
            msg: result.affectedRows > 0 ? 'Expense deleted successfully.' : 'No expense deleted.',
         };
      } catch (error) {
         console.error(`Error deleting expense with ID ${exp_id}:`, error);
         throw error;
      } finally {
         connPool.release();
      }
   }
}

module.exports = ExpenseModel;
