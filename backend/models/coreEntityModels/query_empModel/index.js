const pool = require('@/config/dbConfig');

class QueryEmpModel {
   /**
    * Update query assignment status
    */
   static async updateStatus(qemp_id, qemp_status) {
      const query = `
         UPDATE query_emp
         SET qemp_status = ?, updated_at = NOW()
         WHERE qemp_id = ?
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [qemp_status, qemp_id]);
         return result.affectedRows > 0;
      } finally {
         conn.release();
      }
   }

   /**
    * Get all employees assigned to a specific query
    */
   static async getAllByQueryId(qemp_query_id) {
      const query = `
         SELECT 
            qe.*,
            u.first_name,
            u.last_name
         FROM query_emp qe
         LEFT JOIN users u ON u.u_id = qe.qemp_user_id
         WHERE qe.qemp_query_id = ?
         ORDER BY qe.created_at DESC
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [qemp_query_id]);
         return result;
      } finally {
         conn.release();
      }
   }

   /**
    * Get all queries assigned to a specific user
    */
   static async getAllByUserId(qemp_user_id) {
      const query = `
         SELECT 
            qe.*,
            q.query_title,
            q.query_status
         FROM query_emp qe
         LEFT JOIN queries q ON q.query_id = qe.qemp_query_id
         WHERE qe.qemp_user_id = ?
         ORDER BY qe.created_at DESC
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [qemp_user_id]);
         return result;
      } finally {
         conn.release();
      }
   }

   /**
    * Get all assignments created by a specific admin/user
    */
   static async getAllByAssignedBy(qemp_assigned_by) {
      const query = `
         SELECT 
            qe.*,
            u.first_name,
            u.last_name
         FROM query_emp qe
         LEFT JOIN users u ON u.u_id = qe.qemp_user_id
         WHERE qe.qemp_assigned_by = ?
         ORDER BY qe.created_at DESC
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [qemp_assigned_by]);
         return result;
      } finally {
         conn.release();
      }
   }
}

module.exports = QueryEmpModel;
