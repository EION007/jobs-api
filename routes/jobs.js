const express = require('express')
const router = express.Router();
const {getAllJobs, getOneJob, updateJob, createJob, deleteJob} = require('../controllers/jobs')

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getOneJob).delete(deleteJob).patch(updateJob)


module.exports = router;