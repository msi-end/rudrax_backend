const ClientsModel = require('@/models/coreEntityModels/clientModel');

class ClientsCoreController {
   // Get Last +1 Controller clients
   static async getClientsLastRef(req, res) {
      try {
         const [data] = await ClientsModel.getLastClientRef();
         let lastNum = parseInt(data['client_ref_no'].slice(-4));
         let newRef = data['client_ref_no'].replace(lastNum, lastNum + 1);
         return res.status(200).send({
            status: true,
            msg: 'Clients Ref retrieved successfully',
            data: { lastRefNo: data['client_ref_no'], newRefNo: newRef },
         });
      } catch (error) {
         console.error('Error fetching clients:', error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }
   static async getClientProjects(req, res) {
      const { client_id } = req.query;
      try {
         const data = await ClientsModel.getClientProjects(client_id);
         return res.status(200).send({
            status: true,
            msg: 'Client projects retrieved successfully',
            data: data,
         });
      } catch (error) {
         console.error('Error fetching client projects:', error);
         return res.status(500).send({
            status: false,
            msg: 'Internal Server Error',
            data: null,
         });
      }
   }

   static async getProject_Col_Exp(req, res) {
      const { pro_id } = req.query;
      if (!pro_id) {
         return res.status(400).send({
            status: false,
            msg: 'Missing required field: pro_id',
            data: null,
         });
      }
      try {
         const financeData = await ClientsModel.getFinancesByProjectRef(pro_id);
         return res.status(200).send({
            status: true,
            msg: 'Project finances retrieved successfully.',
            data: financeData,
         });
      } catch (error) {
         console.error('Error fetching project finances:', error);
         return res.status(500).send({
            status: false,
            msg: 'Internal Server Error retrieving project finances.',
            data: null,
         });
      }
   }
}

module.exports = ClientsCoreController;
