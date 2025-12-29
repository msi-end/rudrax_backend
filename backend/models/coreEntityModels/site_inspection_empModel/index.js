const pool = require('@/config/dbConfig');

class SiteInspectionEmpModel {
   /**
    * Update site inspection assignment status
    */
   static async updateStatus(siemp_id, siemp_status) {
      const query = `
         UPDATE site_inspection_emp
         SET siemp_status = ?, updated_at = NOW()
         WHERE siemp_id = ?
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [siemp_status, siemp_id]);
         return result.affectedRows > 0;
      } finally {
         conn.release();
      }
   }

   /**
    * Get all employees assigned to a site inspection
    */
   static async getAllBySiteInspectionId(siemp_siteInspection_id) {
      const query = `
         SELECT 
            sie.*,
            u.first_name,
            u.last_name
         FROM site_inspection_emp sie
         LEFT JOIN users u 
            ON u.u_id = sie.siemp_user_id
         WHERE sie.siemp_siteInspection_id = ?
         ORDER BY sie.created_at DESC
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [siemp_siteInspection_id]);
         return result;
      } finally {
         conn.release();
      }
   }

   /**
    * Get all site inspections assigned to a user
    */
   static async getAllByUserId(siemp_user_id) {
      const query = `
         SELECT 
            sie.*,
            si.siteInspection_title,
            si.siteInspection_status
         FROM site_inspection_emp sie
         LEFT JOIN site_inspection si
            ON si.siteInspection_id = sie.siemp_siteInspection_id
         WHERE sie.siemp_user_id = ?
         ORDER BY sie.created_at DESC
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [siemp_user_id]);
         return result;
      } finally {
         conn.release();
      }
   }

   /**
    * Get all assignments created by a specific admin/user
    */
   static async getAllByAssignedBy(siemp_assigned_by) {
      const query = `
         SELECT 
            sie.*,
            u.first_name,
            u.last_name
         FROM site_inspection_emp sie
         LEFT JOIN users u
            ON u.u_id = sie.siemp_user_id
         WHERE sie.siemp_assigned_by = ?
         ORDER BY sie.created_at DESC
      `;

      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [siemp_assigned_by]);
         return result;
      } finally {
         conn.release();
      }
   }
}

module.exports = SiteInspectionEmpModel;
