const pool = require('@/config/dbConfig');

class SuperAdminAuthModel {
   constructor(name, contact, user_id, hashpassword) {
      this.name = name;
      this.contact = contact;
      this.user_id = user_id;
      this.hashpassword = hashpassword;
   }

   // Insert a new uer
   static async create(id, user_id, hashpassword) {
      const connPool = await pool.getConnection();
      try {
         const queryTwo = `UPDATE super_admin_auth SET su_user_id=?, su_password=? WHERE su_r_id = ? `;
         const [result] = await connPool.query(queryTwo, [user_id, hashpassword, id]);


         if (result?.affectedRows) {
            return { status: true, result, msg: 'Successfully inserted!' };
         } else {
            return { status: false, msg: 'Something went wrong!' };
         }
      } catch (error) {
         console.error('Transaction rolled back due to error:', error);
      } finally {
         connPool.release();
      }
   }

   static async findByLoginInfo(user_id) {
      const connPool = await pool.getConnection();
      const selectUserSQL =
         'SELECT su_a_id as id, su_user_id as user_id, su_password as password FROM super_admin_auth WHERE su_user_id = ? LIMIT 0,1';
      try {
         const [rows] = await connPool.query(selectUserSQL, [user_id]);
         if (rows.length > 0) {
            const { id, password, user_id } = rows[0];
            return { id, password, user_id };
         }
         return null;
      } catch (error) {
         console.error(`Error Finding Info  su_admin with user_id: ${user_id}:`, error);
      } finally {
         connPool.release();
      }
   }
   static async updateRefreshToken(id, refreshToken) {
      const connPool = await pool.getConnection();
      const updateSQL = 'UPDATE super_admin_auth SET su_token =? WHERE su_a_id = ?';
      try {
         const [rows] = await connPool.query(updateSQL, [refreshToken, id]);
         if (rows.length > 0) {
            return { status: true, msg: 'refresh token added!' };
         }
         return null;
      } catch (error) {
         console.error(`Error Updating refreshToken su_admin with ID ${id}:`, error);
      } finally {
         connPool.release();
      }
   }
   static async getUserByToken(refreshToken) {
      const connPool = await pool.getConnection();
      const updateSQL = 'SELECT su_a_id as id, su_user_id as user_id FROM super_admin_auth WHERE su_token = ?';
      try {
         const [rows] = await connPool.query(updateSQL, [refreshToken]);
         if (rows.length > 0) {
            return rows[0];
         }
         return null;
      } catch (error) {
         console.error(`Error retrieve userInfo su_admin ln:128:`, error);
      } finally {
         connPool.release();
      }
   }
   static async DeleteToken(refreshToken) {
      const connPool = await pool.getConnection();
      const updateSQL = `UPDATE super_admin_auth SET su_token ='' WHERE su_token = ?`;
      try {
         const [rows] = await connPool.query(updateSQL, [refreshToken]);
         if (rows.length > 0) {
            return { status: true, msg: 'refresh token added!' };
         }
         return null;
      } catch (error) {
         console.error(`Error Updating refreshToken su_admin with ID:`, error);
      } finally {
         connPool.release();
      }
   }
}
module.exports = SuperAdminAuthModel;
