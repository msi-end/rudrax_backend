const pool = require('@/config/dbConfig');

class queryEmployeeModel {
   static async findAll() {
      const query = 'SELECT * FROM query_emp';
      const conn = await pool.getConnection();
      try {
         const [rows] = await conn.query(query);
         return rows;
      } catch (error) {
         console.error('Error fetching all query employees:', error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async findOne(qemp_id) {
      const query = 'SELECT * FROM query_emp WHERE qemp_id = ?';
      const conn = await pool.getConnection();
      try {
         const [rows] = await conn.query(query, [qemp_id]);
         return rows[0];
      } catch (error) {
         console.error(`Error fetching query employee by ID ${qemp_id}:`, error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async create(data) {
      const query = `
         INSERT INTO query_emp 
         (qemp_id, qemp_user_id,qemp_query_id, qemp_assigned_by, qemp_status) 
         VALUES (?, ?,?, ?, ?)`;
      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [
            data.qemp_id,
            data.qemp_user_id,
            data.qemp_query_id,
            data.qemp_assigned_by,
            data.qemp_status,
         ]);
         if (result.affectedRows > 0) {
            return {
               status: result.affectedRows > 0,
               data: {
                  qemp_id: result.insertId,
                  qemp_id: data.qemp_id,
                  qemp_user_id: data.qemp_user_id,
                  qemp_query_id:data.qemp_query_id,
                  qemp_assigned_by: data.qemp_assigned_by,
                  qemp_status: data.qemp_status,
               },
            };
         } else {
            return { status: result.affectedRows > 0 };
         }
      } catch (error) {
         console.error('Error creating query employee:', error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async update(qemp_id, data) {
      const query = `
         UPDATE query_emp 
         SET  qemp_user_id = ?,qemp_query_id=?, qemp_assigned_date = ?, qemp_assigned_by = ?, qemp_status = ?
         WHERE qemp_id = ?`;
      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [
            data.qemp_user_id,
            data.qemp_query_id,
            data.qemp_assigned_date,
            data.qemp_assigned_by,
            data.qemp_status,
            qemp_id,
         ]);
         return {
            status: result.affectedRows > 0,
            msg: result.affectedRows > 0 ? 'query employee updated.' : 'Update failed.',
         };
      } catch (error) {
         console.error(`Error updating query employee with ID ${qemp_id}:`, error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async remove(qemp_id) {
      const query = 'DELETE FROM query_emp WHERE qemp_id = ?';
      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [qemp_id]);
         return {
            status: result.affectedRows > 0,
            msg: result.affectedRows > 0 ? 'Deleted successfully.' : 'No record deleted.',
         };
      } catch (error) {
         console.error(`Error deleting query employee with ID ${qemp_id}:`, error);
         throw error;
      } finally {
         conn.release();
      }
   }
}

module.exports = queryEmployeeModel;
