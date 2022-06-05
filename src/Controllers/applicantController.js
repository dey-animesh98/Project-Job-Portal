const jobModel = require('../Models/jobModel')
const applicantModel = require('../Models/applicantModel')
const validation = require('../Middlewares/validation')
const ObjectId = require('mongoose').Types.ObjectId
const jwt = require('jsonwebtoken')

//---------------------------------------------------------------Create Applicant-------------------------------------------------------------------------//
const registerApplicant = async (req, res) => {
    try {
        const applicantData = req.body
        if (!validation.isValidRequest(applicantData)) return res.status(400).send({ status: false, message: 'Please enter your details to Register.' })

        const { name, email, mobile, password, qualification, percentage, passout, qualificationStatus } = applicantData

        // Validation of Required Fields
        const incomingKeys = Object.keys(applicantData)
        const requiredKeys = ["name", "email", "mobile", "password", "qualification", "percentage", "qualificationStatus"]

        for (let i = 0; i < requiredKeys.length; i++) {
            if (!(incomingKeys.includes(requiredKeys[i]))) {
                return res.status(400).send({ status: false, message: `${requiredKeys[i]} is required.` })
            }
        }
        // Name Valiadtion
        if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "Name should contain alphabets only." })

        // Email Validation 
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "Not a valid emailId. e.g: abc@xyz.com" })

        // Mobile No Valiadtion
        if (!validation.isValidPhone(mobile))
            return res.status(400).send({ status: false, message: "Mobile no should be only 10 digit number, starts with 6-9." });

        // Password Validation
        if (!validation.isValidPassword(password))
            return res.status(400).send({ status: false, message: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & ] and length should be min of 8-15 charachaters" });

        // Qualification Validation
        if (qualification) {
            const qualificationArr = qualification.trim().split(',').map(a => a.trim())
            const validqualification = ['Diploma', 'B.tech', 'M.tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA']
            for (let i = 0; i < qualificationArr.length; i++) {
                if (!(validqualification.includes(qualificationArr[i]))) {
                    return res.status(400).send({ status: false, message: "Entered Qualifiaction Name not Listed. Only use ['Diploma', 'B.tech', 'M.tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA']" })
                }
            }
            applicantData['qualification'] = qualificationArr
        }

        // Percentage Validation
        if (!validation.isIntNumber(percentage))
            return res.status(400).send({ status: false, message: "Percentage should contains integer numbers only." })

        if ((percentage < 1) || (percentage > 100))
            return res.status(400).send({ status: false, message: "Please enter a valid percentage between 1-100" })

        // Qualification Status Validation
        if (!validation.isValidQalificationStatus(qualificationStatus))
            return res.status(400).send({ status: false, message: "Status should be 'completed' / 'pursuing' " })
        // If Completed
        if (qualificationStatus == 'completed') {
            if (!validation.isValidValue(passout)) return res.status(400).send({ status: false, message: "Please enter passout" })
            if (!validation.isValidPassoutDate(passout)) return res.status(400).send({ status: false, message: "Date format should be a valid date and in MM/YYYY" })
            if (!validation.isPastDate(passout)) return res.status(400).send({ status: false, message: "You can't enter future date." })
            // if pursuing
        } else if (qualificationStatus == 'pursuing') {
            if (passout) return res.status(400).send({ status: false, message: "Passout year is not required when pursuing." })
        }
        // Validation of Unique Fields
        const uniqueEmail = await applicantModel.findOne({ email })
        if (uniqueEmail) return res.status(400).send({ status: false, message: `${email} already registered with us.` })

        const uniqueMobile = await applicantModel.findOne({ mobile })
        if (uniqueMobile) return res.status(400).send({ status: false, message: `${mobile} already registered with us.` })

        const createApplicant = await applicantModel.create(applicantData)
        return res.status(201).send({ status: true, message: "Applicant Created Successfully", data: createApplicant })

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

//-----------------------------------------------------------------------Applicant Login API--------------------------------------------------------------------//
const loginApplicant = async (req, res) => {
    try {
        const credential = req.body
        if (!validation.isValidRequest(credential)) return res.status(400).send({ status: false, message: 'Please enter your login details.' })

        const { email, password } = credential

        // Validation of Required Fields
        if (!validation.isValidValue(email && password))
            return res.status(400).send({ status: false, message: "Please fill required fields [email & password]  to login." })

        // Find hr by email
        const findApplicant = await applicantModel.findOne({ email })
        if (!findApplicant) return res.status(404).send({ status: false, message: `${email} not found` })

        // Verifying Password
        const actualPass = findApplicant.password
        if (actualPass != password) return res.status(401).send({ status: false, message: "Incorrect Password" })

        // Token Generation
        let token = await jwt.sign({
            applicantId: findApplicant._id,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, 'aN$ieSh&1@9*3aAP')

        // res.setHeader('x-auth-token', token)
        res.status(200).send({ status: true, message: "Login Successful", data: { applicantId:findApplicant._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

//---------------------------------------------------------------------------Applications------------------------------------------------------//
const myApplications = async(req,res)=>{
    try{
        const applicantId = req.params.applicantId
        //applcations in of applicant

    }catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

module.exports = { registerApplicant, loginApplicant, myApplications }

