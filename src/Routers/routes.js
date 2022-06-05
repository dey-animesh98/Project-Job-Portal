const express = require('express');
const router = express.Router();

const hrController = require('../Controllers/hrController')
const jobController = require('../Controllers/jobController')
const applicantController = require('../Controllers/applicantController')
const applicantionController = require('../Controllers/applicationController')
const authentications = require('../Middlewares/auth');

//HR API
router.post('/register/hr', hrController.registerHr)
router.post('/login/hr', hrController.loginHr)

// JOBS API
// router.post('/:hrId/jobs/post', jobController.postJob)
router.post('/:hrId/jobs/post', authentications.hrAuthentication, jobController.postJob)
router.get('/jobs', jobController.getJobs)


// APPLICANT API
router.post('/register/applicant', applicantController.registerApplicant)
router.post('/login/applicant', applicantController.loginApplicant)


// APPLICATIONS API
router.post('/apply/applicant/:applicantId/job/:jobId', applicantionController.applyJob)

module.exports = router