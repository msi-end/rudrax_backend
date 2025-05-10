require('module-alias/register');

const express = require('express');
const coreRouter = express.Router();
const ClientCoreController = require('@/controllers/coreEntityControllers/clientController');
const ProjectCoreController = require('@/controllers/coreEntityControllers/projectController');
const VendorCoreController = require('@/controllers/coreEntityControllers/vendorController');
const ExpenseCoreController = require('@/controllers/coreEntityControllers/expenseController');
const MaterialCoreController = require('@/controllers/coreEntityControllers/material_reqController');
const UsersCoreController = require('@/controllers/coreEntityControllers/usersController');

// [CLIENT]-----------
coreRouter.get('/core/client/get_lastRef', ClientCoreController.getClientsLastRef);
coreRouter.get('/core/client/get_clientProject', ClientCoreController.getClientProjects);
coreRouter.get('/core/client/get_ProjectInfo', ClientCoreController.getProject_Col_Exp);

// [VENDOR]-----------
coreRouter.get('/core/vendor/get_lastRef', VendorCoreController.getVendorLastRef);
coreRouter.get('/core/vendor/get_vendor_payment_purchase', VendorCoreController.getVendor_Purch_Payment);

// [EXPENSES]-----------
coreRouter.post('/core/expense/create', ExpenseCoreController.add_Expense_and_dist);
coreRouter.get('/core/expense/get_expense_details/:exp_id', ExpenseCoreController.getExpenseDetails);
coreRouter.post('/core/expense/update', ExpenseCoreController.updateExpense);

// [PROJECTS]-----------
coreRouter.get('/core/project/get_project_detail/:pro_id', ProjectCoreController.getFullProject_OtherDetails_);

// [Material]-----------
coreRouter.post('/core/material_req/create', MaterialCoreController.insertMaterialRequestWithItems);
coreRouter.get('/core/material_req/readAll', MaterialCoreController.readAll);
coreRouter.get('/core/material_req/realAll_by_materialId/:id', MaterialCoreController.findAllByMatrialReqId);
coreRouter.put('/core/material_req/update', MaterialCoreController.updateMaterialItemList);

coreRouter.put('/core/material_req/update_by_materialId', MaterialCoreController.updateMaterialItemList);
coreRouter.get('/core/material_req/status/finance_dep/:mr_item_id', MaterialCoreController.updateFdApproval);
coreRouter.get('/core/material_req/status/material_dep/:mr_item_id', MaterialCoreController.updateMdApproval);
coreRouter.get( '/core/material_req/status/material_delivery/:mr_item_id',MaterialCoreController.updateMrDeliveryStatus
);

// [User]-----------
coreRouter.post('/core/users/create/:role', UsersCoreController.create);
coreRouter.get('/core/users/readAll/:role', UsersCoreController.findAll);
coreRouter.get('/core/users/readOne/:role/:id', UsersCoreController.findOne);
coreRouter.put('/core/users/update/:role/:id', UsersCoreController.update);
coreRouter.put('/core/users/updatePassword/:role/:id', UsersCoreController.updatePassword);
coreRouter.put('/core/users/toggleStatus/:role/:id', UsersCoreController.toggleStatus);
coreRouter.delete('/core/users/delete/:role/:id', UsersCoreController.remove);



module.exports = coreRouter;
