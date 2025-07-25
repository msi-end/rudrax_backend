const coreInvoiceModel = require('@/models/coreEntityModels/invoiceModel');

const InvoiceController = {
   async create(req, res) {
      try {
         const { invoiceData, items } = req.body;
         const created = await coreInvoiceModel.createInvoiceWithItems(invoiceData, items);
         res.status(201).send({ status: true, msg: 'Invoice created successfully', data: created });
      } catch (err) {
         console.error('Error creating invoice:', err);
         res.status(500).send({ status: false, msg: 'Server error', data: null });
      }
   },

   async findAll(req, res) {
      try {
         const data = await coreInvoiceModel.findAll();
         res.status(200).send({ status: true, msg: 'All invoices fetched', data });
      } catch (err) {
         console.error('Error fetching invoices:', err);
         res.status(500).send({ status: false, msg: 'Server error', data: null });
      }
   },

   async findOne(req, res) {
      try {
         const data = await coreInvoiceModel.findOne(req.params.id);
         res.status(200).send({ status: true, msg: 'Invoice fetched', data });
      } catch (err) {
         console.error('Error fetching invoice:', err);
         res.status(500).send({ status: false, msg: 'Server error', data: null });
      }
   },

   async update(req, res) {
      try {
         const updated = await coreInvoiceModel.update(req.params.id, req.body);
         res.status(200).send({ status: true, msg: updated ? 'Invoice updated' : 'No changes made', data: null });
      } catch (err) {
         console.error('Error updating invoice:', err);
         res.status(500).send({ status: false, msg: 'Server error', data: null });
      }
   },

   async remove(req, res) {
      try {
         const deleted = await coreInvoiceModel.remove(req.params.id);
         res.status(200).send({ status: true, msg: deleted ? 'Invoice deleted' : 'Invoice not found', data: null });
      } catch (err) {
         console.error('Error deleting invoice:', err);
         res.status(500).send({ status: false, msg: 'Server error', data: null });
      }
   },

   async paginate(req, res) {
      try {
         const limit = parseInt(req.query.limit) || 10;
         const offset = parseInt(req.query.offset) || 0;
         const data = await coreInvoiceModel.paginate(limit, offset);
         res.status(200).send({ status: true, msg: 'Paginated data fetched', data });
      } catch (err) {
         console.error('Error in pagination:', err);
         res.status(500).send({ status: false, msg: 'Server error', data: null });
      }
   },
};

module.exports = InvoiceController;
