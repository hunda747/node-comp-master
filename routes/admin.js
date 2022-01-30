const path = require('path');
// const path = require('path');


const express = require('express');

const adminController = require('../controllers/admin');
const apiAdminController = require('../controllers/apiAdminController');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/login', adminController.getLogin);

router.post('/adminLogin', adminController.getUser);

router.post('/requests', adminController.getRequest)
router.post('/history', adminController.getHistory)
router.get('/report', adminController.getReport)

router.get('/request/:requestId', adminController.getProduct);
router.get('/history/:requestId', adminController.getHistoryDetail);

router.post('/search', adminController.getSearchResult)

router.post('/request-detail', adminController.getEmail);

//api
// router.post('api/requests', adminController.getRequest)
// router.post('api/history', adminController.getHistory)
// router.get('api/request/:requestId', adminController.getProduct);

// router.post('api/request-detail', adminController.getEmail);

router.post('/api/adminLogin', apiAdminController.getUser);

router.post('/api/requests', authorize.verifyToken, apiAdminController.getRequest);
router.post('/api/history', authorize.verifyToken, apiAdminController.getHistory)
router.get('/api/request/:requestId', authorize.verifyToken, apiAdminController.getProduct);

router.post('/api/respond/:id/:message', authorize.verifyToken, apiAdminController.getEmail);





module.exports = router;