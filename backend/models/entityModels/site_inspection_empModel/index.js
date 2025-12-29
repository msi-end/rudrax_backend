const pool = require('@/config/dbConfig');

class SiteInspectionEmployeeModel {
   static async findAll() {
      const query = 'SELECT * FROM site_inspection_emp';
      const conn = await pool.getConnection();
      try {
         const [rows] = await conn.query(query);
         return rows;
      } catch (error) {
         console.error('Error fetching all project employees:', error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async findOne(siemp_id) {
      const query = 'SELECT * FROM site_inspection_emp WHERE siemp_id = ?';
      const conn = await pool.getConnection();
      try {
         const [rows] = await conn.query(query, [siemp_id]);
         return rows[0];
      } catch (error) {
         console.error(`Error fetching project employee by ID ${siemp_id}:`, error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async create(data) {
      const query = `
         INSERT INTO site_inspection_emp 
         ( siemp_user_id,siemp_siteInspection_id, siemp_assigned_by, siemp_status) 
         VALUES (?, ?, ?, ?)`;
      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [
            data.siemp_user_id,
            data.siemp_siteInspection_id,
            data.siemp_assigned_by,
            data.siemp_status,
         ]);
         if (result.affectedRows > 0) {
            return {
               status: result.affectedRows > 0,
               data: {
                  siemp_id: result.insertId,
                  siemp_user_id: data.siemp_user_id,
                  siemp_siteInspection_id: data.siemp_siteInspection_id,
                  siemp_assigned_by: data.siemp_assigned_by,
                  siemp_status: data.siemp_status,
               },
            };
         } else {
            return { status: result.affectedRows > 0 };
         }
      } catch (error) {
         console.error('Error creating project employee:', error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async update(siemp_id, data) {
      const query = `
         UPDATE site_inspection_emp 
         SET siemp_user_id = ?,siemp_siteInspection_id=?, siemp_assigned_date = ?, siemp_assigned_by = ?, siemp_status = ?
         WHERE siemp_id = ?`;
      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [
            data.siemp_user_id,
            data.siemp_siteInspection_id,
            data.siemp_assigned_date,
            data.siemp_assigned_by,
            data.siemp_status,
            siemp_id,
         ]);
         return {
            status: result.affectedRows > 0,
            msg: result.affectedRows > 0 ? 'Project employee updated.' : 'Update failed.',
         };
      } catch (error) {
         console.error(`Error updating project employee with ID ${siemp_id}:`, error);
         throw error;
      } finally {
         conn.release();
      }
   }

   static async remove(siemp_id) {
      const query = 'DELETE FROM site_inspection_emp WHERE siemp_id = ?';
      const conn = await pool.getConnection();
      try {
         const [result] = await conn.query(query, [siemp_id]);
         return {
            status: result.affectedRows > 0,
            msg: result.affectedRows > 0 ? 'Deleted successfully.' : 'No record deleted.',
         };
      } catch (error) {
         console.error(`Error deleting project employee with ID ${siemp_id}:`, error);
         throw error;
      } finally {
         conn.release();
      }
   }
}

module.exports = SiteInspectionEmployeeModel;
