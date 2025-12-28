const expenseModel = require('@/models/entityModels/project_expenseModel');

class ExpenseController {
   // Fetch all expenses
   static async findAll(req, res) {
      try {
         const expenses = await expenseModel.findAll();
         return res.status(200).send({ status: true, msg: 'Expenses retrieved successfully', data: expenses });
      } catch (error) {
         console.error('Error fetching expenses:', error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Fetch a single expense by ID
   static async findOne(req, res) {
      const { exp_id } = req.body;
      try {
         const expense = await expenseModel.findOne(exp_id);
         if (!expense) {
            return res.status(404).send({ status: false, msg: 'Expense not found', data: null });
         }
         return res.status(200).send({ status: true, msg: 'Expense retrieved successfully', data: expense });
      } catch (error) {
         console.error(`Error fetching expense with ID ${exp_id}:`, error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Create a new expense
   static async create(req, res) {
      const {
         exp_type,
         exp_name,
         exp_amount,
         exp_mode,
         exp_status,
         exp_attachment_url,
         exp_remark,
         exp_paid_by,
         exp_date,
         exp_category,
         exp_project_id,
         exp_project_phase,
      } = req.body;

      if (!exp_type || !exp_amount || !exp_mode || !exp_date) {
         return res.status(400).send({ status: false, msg: 'Required fields missing', data: null });
      }

      try {
         const row = await expenseModel.create(
            exp_type,
            exp_name,
            exp_amount,
            exp_mode,
            exp_status,
            exp_attachment_url,
            exp_remark,
            exp_paid_by,
            exp_date,
            exp_category,
            exp_project_id,
            exp_project_phase
         );
         return res.status(201).send({
            status: true,
            msg: 'Expense created successfully',
            data: {
               exp_id: row.exp_id,
               exp_type,
               exp_name,
               exp_amount,
               exp_mode,
               exp_status,
               exp_attachment_url,
               exp_remark,
               exp_paid_by,
               exp_date,
               exp_category,
               exp_project_id,
               exp_project_phase,
            },
         });
      } catch (error) {
         console.error('Error creating expense:', error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Update an existing expense
   static async update(req, res) {
      const {
         exp_id,
         exp_type,
         exp_name,
         exp_amount,
         exp_mode,
         exp_status,
         exp_attachment_url,
         exp_remark,
         exp_paid_by,
         exp_date,
         exp_category,
         exp_project_id,
         exp_project_phase,
      } = req.body;

      if (!exp_id || !exp_type || !exp_name || !exp_amount || !exp_mode || !exp_date) {
         return res.status(400).send({ status: false, msg: 'All required fields must be provided', data: null });
      }

      try {
         const result = await expenseModel.update(
            exp_id,
            exp_type,
            exp_name,
            exp_amount,
            exp_mode,
            exp_status,
            exp_attachment_url,
            exp_remark,
            exp_paid_by,
            exp_date,
            exp_category,
            exp_project_id,
            exp_project_phase
         );

         if (!result.status) {
            return res.status(404).send({ status: false, msg: 'Expense not found', data: null });
         }

         return res
            .status(200)
            .send({
               status: true,
               msg: 'Expense updated successfully',
               data: {
                  exp_id,
                  exp_type,
                  exp_name,
                  exp_amount,
                  exp_mode,
                  exp_status,
                  exp_attachment_url,
                  exp_remark,
                  exp_paid_by,
                  exp_date,
                  exp_category,
                  exp_project_id,
                  exp_project_phase,
               },
            });
      } catch (error) {
         console.error(`Error updating expense with ID ${exp_id}:`, error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }

   // Delete an expense
   static async remove(req, res) {
      const { exp_id } = req.body;

      try {
         const result = await expenseModel.remove(id);
         if (!result.status) {
            return res.status(404).send({ status: false, msg: 'Expense not found', data: null });
         }
         return res.status(200).send({ status: true, msg: 'Expense deleted successfully', data: { exp_id: id } });
      } catch (error) {
         console.error(`Error deleting expense with ID ${id}:`, error);
         return res.status(500).send({ status: false, msg: 'Internal Server Error', data: null });
      }
   }
}

module.exports = ExpenseController;
