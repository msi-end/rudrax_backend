const QueryEmpModel = require('@/models/coreEntityModels/query_empModel');

class QueryEmpController {
   /**
    * Update query assignment status
    */
   static async updateStatus(req, res) {
      try {
         const { qemp_id, qemp_status } = req.body;

         if (!qemp_id || !qemp_status) {
            return res.status(400).json({
               status: false,
               msg: 'Missing required fields: qemp_id and qemp_status',
               data: null,
            });
         }

         const updated = await QueryEmpModel.updateStatus(qemp_id, qemp_status);

         if (!updated) {
            return res.status(404).json({
               status: false,
               msg: 'Query assignment not found or no changes made',
               data: null,
            });
         }

         res.status(200).json({
            status: true,
            msg: 'Query status updated successfully',
            data: {
               qemp_id,
               qemp_status,
            },
         });
      } catch (err) {
         console.error('Error updating query status:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while updating query status',
            data: null,
         });
      }
   }

   /**
    * Get all employees assigned to a query
    */
   static async getAllByQueryId(req, res) {
      try {
         const { qemp_query_id } = req.body;

         if (!qemp_query_id) {
            return res.status(400).json({
               status: false,
               msg: 'Query ID is required',
               data: null,
            });
         }

         const records = await QueryEmpModel.getAllByQueryId(qemp_query_id);

         res.status(200).json({
            status: true,
            msg: records.length ? 'Query assignments retrieved successfully' : 'No assignments found for this query',
            data: records,
         });
      } catch (err) {
         console.error('Error fetching query assignments:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while fetching query assignments',
            data: null,
         });
      }
   }

   /**
    * Get all queries assigned to a user
    */
   static async getAllByUserId(req, res) {
      try {
         const { qemp_user_id } = req.body;

         if (!qemp_user_id) {
            return res.status(400).json({
               status: false,
               msg: 'User ID is required',
               data: null,
            });
         }

         const records = await QueryEmpModel.getAllByUserId(qemp_user_id);

         res.status(200).json({
            status: true,
            msg: records.length ? 'User query assignments retrieved successfully' : 'No queries assigned to this user',
            data: records,
         });
      } catch (err) {
         console.error('Error fetching user queries:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while fetching user queries',
            data: null,
         });
      }
   }

   /**
    * Get all assignments made by a specific admin/user
    */
   static async getAllByAssignedBy(req, res) {
      try {
         const { qemp_assigned_by } = req.body;

         if (!qemp_assigned_by) {
            return res.status(400).json({
               status: false,
               msg: 'Assigned By user ID is required',
               data: null,
            });
         }

         const records = await QueryEmpModel.getAllByAssignedBy(qemp_assigned_by);

         res.status(200).json({
            status: true,
            msg: records.length ? 'Assignments retrieved successfully' : 'No assignments found',
            data: records,
         });
      } catch (err) {
         console.error('Error fetching assignments by assigner:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while fetching assignments',
            data: null,
         });
      }
   }
}

module.exports = QueryEmpController;
