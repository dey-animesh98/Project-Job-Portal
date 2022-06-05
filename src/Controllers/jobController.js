const jobModel = require('../Models/jobModel')
const hrModel = require('../Models/hrModel')
const validation = require('../Middlewares/validation')
const ObjectId = require('mongoose').Types.ObjectId

//----------------------------------------------------------Job Post API (Authorization)-----------------------------------------------------------------------------------//
const postJob = async (req, res) => {
    try {
        const hrIdParams = req.params.hrId

        if (!ObjectId.isValid(hrIdParams)) return res.status(400).send({ status: false, message: `${hrIdParams} is an invalid HR id.` })

        const getHrById = await hrModel.findOne({ _id: hrIdParams })
        if (!getHrById) return res.status(404).send({ status: false, message: `No HR found with ${hrIdParams} id.` })

        const hrIdfromToken = req.hrId
        if (hrIdParams !== hrIdfromToken) return res.status(403).send({ status: false, message: "You are not authorized to perfom the action." })
        if (!validation.isValidRequest(req.body)) return res.status(400).send({ status: false, message: "No input. Please Fill all required fields." })

        const jobDetails = req.body
        const { position, department, openings, lastDate, qualification, percentage } = jobDetails

        const incomingKeys = Object.keys(jobDetails)
        const requiredKeys = ["position", "department", "openings", "lastDate", "qualification", "percentage"]

        for (let i = 0; i < requiredKeys.length; i++) {
            if (!(incomingKeys.includes(requiredKeys[i]))) {
                return res.status(400).send({ status: false, message: `${requiredKeys[i]} is required.` })
            }
        }

        jobDetails['hrId'] = hrIdParams

        const getCompany = await hrModel.findById(hrIdParams)
        jobDetails['company'] = getCompany.company

        if (!validation.isValidPosition(position))
            return res.status(400).send({ status: false, message: "Entered Position Name not Listed. Only use ['SDE-1', 'SDE-2', 'Data Analyst', 'Catalogue Analyst', 'Data Scientist', 'Recruiter', 'CSA', 'CSE', 'Process Engineer', 'Accountant']" })

        if (!validation.isValidDepartment(department))
            return res.status(400).send({ status: false, message: "Entered Department Name not Listed. Only use ['Engineering', 'Analyst', 'Finance', 'Human Resource', 'BPO']" })

        if (!validation.isIntNumber(openings) || openings < 1)
            return res.status(400).send({ status: false, message: "Openings should contains integer numbers only min value is 1" })

        if (!validation.isValidDate(lastDate))
            return res.status(400).send({ status: false, message: "Date format should be a valid date and in DD/MM/YYYY" })

        if (!validation.isFutureDate(lastDate))
            return res.status(400).send({ status: false, message: "You have entered a past date." })

        if (qualification) {
            const qualificationArr = qualification.trim().split(',').map(a => a.trim())
            const validqualification = ['Diploma', 'B.tech', 'M.tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA']
            for (let i = 0; i < qualificationArr.length; i++) {
                if (!(validqualification.includes(qualificationArr[i]))) {
                    return res.status(400).send({ status: false, message: "Entered Qualifiaction Name not Listed. Only use ['Diploma', 'B.tech', 'M.tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA']" })
                }
            }
            jobDetails['qualification'] = qualificationArr
        }

        if (!validation.isIntNumber(percentage))
            return res.status(400).send({ status: false, message: "Percentage should contains integer numbers only." })

        if ((percentage < 1) || (percentage > 100))
            return res.status(400).send({ status: false, message: "Please enter a valid percentage between 1-100" })

        const jobData = await jobModel.create(jobDetails)
        return res.status(201).send({ status: true, message: "Your job successfully posted", data: jobData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}


//-------------------------------------------------------------Get Jobs-------------------------------------------------------------------------//
const getJobs = async function (req, res) {
    try {
        const userQuery = req.query

        const invalidQuery = validation.isEmptyKey(userQuery)
        if (invalidQuery) return res.status(400).send({ status: true, message: `${invalidQuery} can't be empty.` })

        const filter = { isDeleted: false }
        const { company, position, department, qualification } = userQuery

        if (Object.keys(userQuery.length > 0)) {
            if (company) {
                filter['company'] = company
            }
            if (position) {
                filter['position'] = position
            }
            if (department) {
                filter['department'] = department
            }
            if (qualification) {
                const qualificationArray = qualification.trim().split(",").map((q) => q.trim());
                filter['qualification'] = { $all: qualificationArray }
            }
        }
        const findJobs = await jobModel.find(filter).collation({ locale: "en", strength: 2 });
        if (findJobs.length === 0) return res.status(404).send({ status: true, message: `No job(s) Found` })
        return res.status(200).send({ status: true, message: "Results", data: findJobs })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}
module.exports = { postJob, getJobs }
