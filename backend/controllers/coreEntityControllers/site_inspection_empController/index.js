const SiteInspectionEmpModel = require('@/models/coreEntityModels/site_inspection_empModel');

class SiteInspectionEmpController {
   /**
    * Update site inspection assignment status
    */
   static async updateStatus(req, res) {
      try {
         const { siemp_id, siemp_status } = req.body;

         if (!siemp_id || !siemp_status) {
            return res.status(400).json({
               status: false,
               msg: 'Missing required fields: siemp_id and siemp_status',
               data: null,
            });
         }

         const updated = await SiteInspectionEmpModel.updateStatus(siemp_id, siemp_status);

         if (!updated) {
            return res.status(404).json({
               status: false,
               msg: 'Site inspection assignment not found or no changes made',
               data: null,
            });
         }

         res.status(200).json({
            status: true,
            msg: 'Site inspection status updated successfully',
            data: {
               siemp_id,
               siemp_status,
            },
         });
      } catch (err) {
         console.error('Error updating site inspection status:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while updating site inspection status',
            data: null,
         });
      }
   }

   /**
    * Get all employees assigned to a site inspection
    */
   static async getAllBySiteInspectionId(req, res) {
      try {
         const { siemp_siteInspection_id } = req.body;

         if (!siemp_siteInspection_id) {
            return res.status(400).json({
               status: false,
               msg: 'Site inspection ID is required',
               data: null,
            });
         }

         const records = await SiteInspectionEmpModel.getAllBySiteInspectionId(siemp_siteInspection_id);

         res.status(200).json({
            status: true,
            msg: records.length
               ? 'Site inspection assignments retrieved successfully'
               : 'No assignments found for this site inspection',
            data: records,
         });
      } catch (err) {
         console.error('Error fetching site inspection assignments:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while fetching site inspection assignments',
            data: null,
         });
      }
   }

   /**
    * Get all site inspections assigned to a user
    */
   static async getAllByUserId(req, res) {
      try {
         const { siemp_user_id } = req.body;

         if (!siemp_user_id) {
            return res.status(400).json({
               status: false,
               msg: 'User ID is required',
               data: null,
            });
         }

         const records = await SiteInspectionEmpModel.getAllByUserId(siemp_user_id);

         res.status(200).json({
            status: true,
            msg: records.length
               ? 'User site inspections retrieved successfully'
               : 'No site inspections assigned to this user',
            data: records,
         });
      } catch (err) {
         console.error('Error fetching user site inspections:', err);
         res.status(500).json({
            status: false,
            msg: 'Internal server error while fetching user site inspections',
            data: null,
         });
      }
   }

   /**
    * Get all assignments created by a specific admin/user
    */
   static async getAllByAssignedBy(req, res) {
      try {
         const { siemp_assigned_by } = req.body;

         if (!siemp_assigned_by) {
            return res.status(400).json({
               status: false,
               msg: 'Assigned-by user ID is required',
               data: null,
            });
         }

         const records = await SiteInspectionEmpModel.getAllByAssignedBy(siemp_assigned_by);

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

module.exports = SiteInspectionEmpController;
