const jobModel = require('../Models/jobModel')
const hrModel = require('../Models/hrModel')
const applicantModel = require('../Models/applicantModel')
const applicationModel = require('../Models/applicationModel')
const validation = require('../Middlewares/validation')
const ObjectId = require('mongoose').Types.ObjectId

//---------------------------------------------------------Apply Job API(Applicant Authorization)-----------------------------------------------------------------------------------//
const applyJob = async (req, res) => {
    try {
        const jobIdParams = req.params.jobId
        const applicantIdParams = req.params.applicantId

        if (!ObjectId.isValid(jobIdParams)) return res.status(400).send({ status: false, message: `${jobIdParams} is an invalid job id.` })
        if (!ObjectId.isValid(applicantIdParams)) return res.status(400).send({ status: false, message: `${applicantIdParams} is an invalid applicant id.` })

        const isAlreadyApplied = await applicationModel.findOne({ applicantId: applicantIdParams, jobId: jobIdParams })
        if (isAlreadyApplied) return res.status(400).send({ status: false, message: "You have already applied with this job." })

        const getJobById = await jobModel.findOne({ _id: jobIdParams })
        if (!getJobById) return res.status(404).send({ status: false, message: `No Job found with ${jobIdParams} id.` })

        const getApplicantById = await applicantModel.findOne({ _id: applicantIdParams })
        if (!getApplicantById) return res.status(404).send({ status: false, message: `No Applicant found with ${applicantIdParams} id.` })
        //Eligibility Criteria (Percentage, lastdate, Qulification)
        //Date
        const lastApplyDate = getJobById.lastDate
        if (!validation.lastDate(lastApplyDate))
            return res.status(404).send({ status: false, message: `No longer accepting applications(Last Apply exprired).` })

        //Qualification
        const requiredQualification = getJobById.qualification
        const applicantQalification = getApplicantById.qualification
        if (!validation.isEligbleQ(requiredQualification, applicantQalification))
            return res.status(404).send({ status: false, message: `Sorry! You are not eligible(Qualification Criteria).` })

        //Percentage
        const percentageRequired = getJobById.percentage
        const ApplicantPercentage = getApplicantById.percentage
        if (percentageRequired > ApplicantPercentage) return res.status(404).send({ status: false, message: "Sorry! You are not eligible(Percentage criteria)" })

        const applicationData = {}
        applicationData['jobId'] = jobIdParams
        applicationData['applicantId'] = applicantIdParams
        applicationData['applicantName'] = getApplicantById.name

        const getPosition = getJobById.position
        applicationData['position'] = getPosition

        const getCompany = getJobById.company
        applicationData['company'] = getCompany

        const getHrId = getJobById.hrId
        const getHr = await hrModel.findOne({ _id: getHrId })
        applicationData['postedBy'] = getHr.name
        applicationData['hrId'] = getHrId

        const applyDate = new Date().toLocaleDateString()
        applicationData['dateApplied'] = applyDate

        await applicantModel.findOneAndUpdate({ _id: applicantIdParams }, { $inc: { jobsApplied: +1 } })
        await jobModel.findOneAndUpdate({ _id: jobIdParams }, { $inc: { totalApplications: +1 } })

        const createApplication = await applicationModel.create(applicationData)
        return res.status(201).send({ status: true, message: "You have successfully applied.", data: createApplication })

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}


//--------------------------------------------------------Find Applicantions--------------------------------------------------------------------//
const findApplicantion = async (req,res)=>{
    try{
        const userQuery = req.query
        // Only Hr can access this
        // query using company, position, applicant name

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}
//-----------------------------------------------------
const applicationsByHrId = async (req,res)=>{
    try{
        const hrIdParams = req.params.hrId
        // Only Hr can access this
        // all jobs posted by user and applications of all jobs

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}
//-----------------------------------------------------
const applicationsByJobId = async (req,res)=>{
    try{
        const jobIdParams = req.params.jobId
        // Only Hr can access this
        // all applications in new key 'applicants' with job details.

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

module.exports = { applyJob,findApplicantion,applicationsByHrId, applicationsByJobId }