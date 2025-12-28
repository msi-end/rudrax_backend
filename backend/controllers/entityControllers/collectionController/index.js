const collectionModel = require('@/models/entityModels/collectionModel');
const organizeByPhase = require('@/utils/functions/collectionOrganizer');

class CollectionController {
   // Fetch all collections
   static async findAll(req, res) {
      const { from_date, to_date, getBy_pro_id, showListView } = req.query;
      try {
         const collections = await collectionModel.findAll(from_date, to_date, getBy_pro_id);
         const organizedData = showListView === 'true' ? collections : await organizeByPhase(collections);
         return res.status(200).send({
            status: true,
            msg: 'Collections retrieved successfully',
            data: organizedData,
         });
      } catch (error) {
         console.error('Error fetching collections:', error);
         return res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
         });
      }
   }

   // Fetch a single collection by ID
   static async findOne(req, res) {
      const { col_id } = req.body;
      try {
         const collection = await collectionModel.findOne(col_id);
         if (!collection) {
            return res.status(404).send({ status: false, msg: 'Collection not found', data: null });
         }
         return res.status(200).send({ status: true, msg: 'Collection retrieved successfully', data: collection });
      } catch (error) {
         console.error(`Error fetching collection with ID ${col_id}:`, error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Create a new collection
   static async create(req, res) {
      const { col_amount, col_mode, col_remark, col_date, col_project_id, col_project_phase } = req.body;
      if (!col_amount || !col_mode || !col_date || !col_project_id) {
         return res.status(400).send({ status: false, msg: 'All required fields must be provided', data: null });
      }
      try {
         const newCollection = await collectionModel.create(
            col_amount,
            col_mode,
            col_remark,
            col_date,
            col_project_id,
            col_project_phase
         );
         return res.status(201).send({ status: true, msg: 'Collection created successfully', data: newCollection });
      } catch (error) {
         console.error('Error creating collection:', error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Update an existing collection
   static async update(req, res) {
      const { col_id } = req.body;
      const { col_amount, col_mode, col_remark, col_date, col_project_id } = req.body;
      if (!col_amount || !col_mode || !col_date || !col_project_id) {
         return res.status(400).send({ status: false, msg: 'All required fields must be provided', data: null });
      }
      try {
         const isUpdated = await collectionModel.update(
            col_id,
            col_amount,
            col_mode,
            col_remark,
            col_date,
            col_project_id,
            col_project_phase
         );
         if (!isUpdated) {
            return res.status(404).send({ status: false, msg: 'Collection not found', data: null });
         }
         return res.status(200).send({ status: true, msg: 'Collection updated successfully', data: null });
      } catch (error) {
         console.error(`Error updating collection with ID ${col_id}:`, error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Delete a collection
   static async remove(req, res) {
      const { id } = req.body;
      try {
         const isDeleted = await collectionModel.remove(id);
         if (!isDeleted) {
            return res.status(404).send({ status: false, msg: 'Collection not found', data: null });
         }
         return res.status(200).send({ status: true, msg: 'Collection deleted successfully', data: { col_id: id } });
      } catch (error) {
         console.error(`Error deleting collection with ID ${id}:`, error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }
}

module.exports = CollectionController;
