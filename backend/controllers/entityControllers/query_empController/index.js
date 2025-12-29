const QueryEmployeeModel = require('@/models/entityModels/query_empModel');

class QueryEmployeeController {
   static async findAll(req, res) {
      try {
         const data = await QueryEmployeeModel.findAll();
         res.status(200).json({ status: true, msg: 'Employees fetched From queries', data });
      } catch (err) {
         res.status(500).json({ status: false, msg: 'Fetch error', data: null });
      }
   }

   static async findOne(req, res) {
      const { qemp_id } = req.body;
      try {
         const employee = await QueryEmployeeModel.findOne(qemp_id);
         if (!employee) return res.status(404).json({ status: false, msg: 'Not found', data: null });
         res.status(200).json({ status: true, msg: 'Employee found In the queries', data: employee });
      } catch (err) {
         res.status(500).json({ status: false, msg: 'Fetch error', data: null });
      }
   }

   static async create(req, res) {
      try {
         const dataArray = req.body;
         if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ status: false, msg: 'Invalid input data', data: null });
         }
         const results = [];
         for (const data of dataArray) {
            const result = await QueryEmployeeModel.create(data);
            results.push(result.data);
         }
         res.status(201).json({ status: true, msg: 'Employee assigned', data: results });
      } catch (err) {
         res.status(500).json({ status: false, msg: 'Creation failed', error: err.message });
      }
   }

   static async update(req, res) {
      const { qemp_id, ...data } = req.body;
      try {
         const result = await QueryEmployeeModel.update(qemp_id, data);
         if (!result.status) return res.status(404).json({ status: false, msg: 'Update failed', data: null });
         res.status(200).json({ status: true, msg: 'Employee updated in queries', data: { qemp_id, ...data } });
      } catch (err) {
         res.status(500).json({ status: false, msg: 'Update error', data: null });
      }
   }

   static async remove(req, res) {
      const { qemp_id } = req.body;
      try {
         const result = await QueryEmployeeModel.remove(qemp_id);
         if (!result.status) return res.status(404).json({ status: false, msg: 'Delete failed', data: null });
         res.status(200).json({ status: true, msg: 'Employee removed From queries', data: { qemp_id } });
      } catch (err) {
         res.status(500).json({ status: false, msg: 'Delete error', data: null });
      }
   }
}

module.exports = QueryEmployeeController;
