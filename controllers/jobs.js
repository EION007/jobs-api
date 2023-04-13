const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getOneJob = async (req, res) => {
    const {user: {userId}, params: {id: jobID}} = req

    const job = await Job.findOne({
        _id: jobID, createdBy: userId
    })

    if (!job) {
        throw new NotFoundError(`No job found with the ID ${jobID}`)
    }

    res.status(StatusCodes.OK).json({job})

}

const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId},
        params: {id: jobID}
    } = req

    if (company === '' || position === '') {
        throw new BadRequestError("Company or position fields cannot be empty")
    }

    const job = await Job.findOneAndUpdate(
        {_id: jobID, createdBy: userId},
        req.body,
        {new: true, runValidators: true}
    )

    if (!job) {
        throw new NotFoundError(`No job found with the ID ${jobID}`)
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async (req, res) => {
    const {
        user: {userId},
        params: {id: jobID}
    } = req

    const job = await Job.findOneAndDelete({_id: jobID, createdBy: userId})

    if (!job) {
        throw new NotFoundError(`No job found with the ID ${jobID}`)
    }

    res.status(StatusCodes.OK).send()
}


module.exports = {getAllJobs, getOneJob, updateJob, createJob, deleteJob}