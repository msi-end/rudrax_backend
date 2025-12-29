require('module-alias/register');
require('dotenv').config({ path: '.env.development' });

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const corsOptions = require('@/config/corsOptions');
// const requestLogger = require('@/utils/req_logger');
const { eventlogger } = require('@/middleware/logEvents');
const credentials = require('@/middleware/credentials');
const jwt_authenticationVerify = require('@/middleware/verifyJWT');

const PORT = process.env.PORT || 3500;
require('@/config/dbConfig');

///
////
///// DEV imports =================
const { print } = require('@/_dev/route.reader');
// const testRoute = require('@/routers/test.route.js');
////////////////////////////////

app.use(cors());
app.use(eventlogger);
app.use(credentials);
// app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.use(requestLogger);

const appRoutes_entity = require('@/routers/applicationApi');
const appRoutes_core = require('@/routers/coreApi');
const appRoutes_core_file = require('@/routers/file_uploadApi');
const appRoutes_notification = require('@/routers/notificationApi');
const appRoutes_invoice = require('@/routers/invoiceApi');
const appRoutes_search = require('@/routers/searchApi');
const appRoutes_pagination = require('@/routers/paginationApi');
const appRoutes_file_manager = require('@/routers/file_managerApi');
const authRoutes = require('@/routers/authApi');

////// auth routes
app.use('/api/v1', authRoutes);
// app.use(jwt_authenticationVerify)

////// api routes
app.use('/api/v1', appRoutes_entity);
app.use('/api/v1', appRoutes_core);
app.use('/api/v1', appRoutes_core_file);
app.use('/api/v1/notification', appRoutes_notification);
app.use('/api/v1/invoice', appRoutes_invoice);
app.use('/api/v1', appRoutes_search);
app.use('/api/v1', appRoutes_pagination);
app.use('/api/v1/fs', appRoutes_file_manager);

///
////
///// DEV Executions =================
app._router.stack.forEach(print.bind(null, []));
// app.use(require('express-status-monitor')());
////////////////////////////////

app.listen(PORT, () => {
   console.log(`server running at port ${PORT} 🚀`);
});
