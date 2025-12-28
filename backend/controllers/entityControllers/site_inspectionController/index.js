// Hello, this is a Controller for site inspections!
const SiteInspectionModel = require('@/models/entityModels/site_inspectionModel');

class SiteInspectionsController {
   static async findAll(req, res) {
      try {
         const inspections = await SiteInspectionModel.findAll();
         res.status(200).send({
            status: true,
            msg: 'Site inspections retrieved successfully',
            data: inspections,
         });
      } catch (error) {
         console.error(error);
         res.status(500).send({
            status: false,
            msg: 'Failed to retrieve site inspections',
            data: null,
         });
      }
   }

   static async findOne(req, res) {
      try {
         const { si_id } = req.body;
         const inspection = await SiteInspectionModel.findOne(si_id);
         if (!inspection) {
            return res.status(404).send({
               status: false,
               msg: 'Site inspection not found',
               data: null,
            });
         }
         res.status(200).send({
            status: true,
            msg: 'Site inspection retrieved successfully',
            data: inspection,
         });
      } catch (error) {
         console.error(error);
         res.status(500).send({
            status: false,
            msg: 'Failed to retrieve site inspection',
            data: null,
         });
      }
   }

   static async create(req, res) {
      try {
         const { pro_id, si_asign_id, si_date, si_location, si_type, status } = req.body;
         const result = await SiteInspectionModel.create(pro_id, si_asign_id, si_date, si_location, si_type, status);
         if (!result.status) {
            return res.status(500).json({
               status: false,
               msg: 'Something went wrong!',
               data: result?.error,
            });
         }
         res.status(201).send({
            status: true,
            msg: 'Site inspection created successfully',
            data: { si_id: result.id, pro_id,si_asign_id, si_date, si_location, si_type, status },
         });
      } catch (error) {
         console.error(error);
         res.status(500).send({
            status: false,
            msg: 'Failed to create site inspection',
            data: error,
         });
      }
   }

   static async update(req, res) {
      try {
         const { si_id, pro_id, si_asign_id, si_date, si_location, si_type, status } = req.body;

         const result = await SiteInspectionModel.update(si_id, pro_id, si_asign_id, si_date, si_location, si_type, status);

         if (!result?.status) {
            return res.status(404).send({
               status: false,
               msg: 'Site inspection not found',
               data: null,
            });
         }

         res.status(200).send({
            status: true,
            msg: 'Site inspection updated successfully',
            data: {
               si_id,
               pro_id,
               si_asign_id,
               si_date,
               si_location,
               si_type,
               status,
            },
         });
      } catch (error) {
         console.error(error);
         res.status(500).send({
            status: false,
            msg: 'Failed to update site inspection',
            data: null,
         });
      }
   }

   static async remove(req, res) {
      try {
         const { si_id } = req.body;
         const result = await SiteInspectionModel.remove(si_id);
         if (!result?.status) {
            return res.status(404).send({
               status: false,
               msg: 'Site inspection not found',
               data: null,
            });
         }
         res.status(200).send({
            status: true,
            msg: 'Site inspection deleted successfully',
            data: { si_id },
         });
      } catch (error) {
         console.error(error);
         res.status(500).send({
            status: false,
            msg: 'Failed to delete site inspection',
            data: null,
         });
      }
   }
}

module.exports = SiteInspectionsController;
