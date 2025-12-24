const pool = require('@/config/dbConfig');

class ClientModel {
   constructor(clientName, clientRefNo, clientContact, clientAltContact, clientAddress, clientEmail) {
      this.clientName = clientName;
      this.clientContact = clientContact;
      this.clientRefNo = clientRefNo;
      this.clientAltContact = clientAltContact;
      this.clientAddress = clientAddress;
      this.clientEmail = clientEmail;
   }
   static async getLastClientRef() {
      const query = 'SELECT client_ref_no FROM clients ORDER BY client_id DESC LIMIT 1';
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query);
         return rows;
      } catch (error) {
         console.error('Error retrieving all clients:', error);
         throw error;
      } finally {
         connPool.release();
      }
   }
   static async getClientProjects(client_id) {
      const query = `
            SELECT c.client_id, c.client_name, p.pro_id, p.pro_ref_no, p.pro_name 
            FROM clients c
            LEFT JOIN projects p ON c.client_id = p.pro_client_r_id WHERE client_id=?`;
      const connPool = await pool.getConnection();
      try {
         const [rows] = await connPool.query(query, [client_id]);
         return rows;
      } catch (error) {
         console.error('Error retrieving client projects:', error);
         throw error;
      } finally {
         connPool.release();
      }
   }

   static async getFinancesByProjectRef(pro_id) {
      if (!pro_id) {
         throw new Error('Project Reference Number is required.');
      }
      const collectionQuery = 'SELECT * FROM collections WHERE col_project_id = ?';
      const expenseQuery = 'SELECT * FROM expenses WHERE exp_project_id = ?';
      const connPool = await pool.getConnection();

      try {
         const [collections] = await connPool.query(collectionQuery, [pro_id]);
         const [expenses] = await connPool.query(expenseQuery, [pro_id]);
         return {
            collections: collections,
            expenses: expenses,
         };
      } catch (error) {
         console.error('Error retrieving project finances:', error);
         throw error;
      } finally {
         if (connPool) {
            connPool.release();
         }
      }
   }
}

module.exports = ClientModel;
