const hrModel = require('../Models/hrModel')
const validation = require('../Middlewares/validation')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

//-----------------------------------------------------------------Register HR---------------------------------------------------------------------------------//
const registerHr = async (req, res) => {
    try {
        const hrData = req.body
        if (!validation.isValidRequest(hrData)) return res.status(400).send({ status: false, message: 'Please enter your details to Register.' })

        const { name, company, employeeId, email, mobile, password } = hrData

        // Validation of Required Fields
        const incomingKeys = Object.keys(hrData)
        const requiredKeys = ["name", "company", "employeeId", "email", "mobile", "password"]

        for (let i = 0; i < requiredKeys.length; i++) {
            if (!(incomingKeys.includes(requiredKeys[i]))) {
                return res.status(400).send({ status: false, message: `${requiredKeys[i]} is required.` })
            }
        }

        //Name Valiadtion
        if (!validation.isValidName(name)) return res.status(400).send({ status: false, message: "Name should contain alphabets only." })

        // Email Validation 
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "Not a valid emailId. e.g: abc@xyz.com" })

        // Mobile No Valiadtion
        if (!validation.isValidPhone(mobile))
            return res.status(400).send({ status: false, message: "Mobile no should be only 10 digit number, starts with 6-9." });

        // Password Validation
        if (!validation.isValidPassword(password))
            return res.status(400).send({ status: false, message: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & ] and length should be min of 8-15 charachaters" });

        // Validation of Unique Fields
        const uniqueEmail = await hrModel.findOne({ email })
        if (uniqueEmail) return res.status(400).send({ status: false, message: `${email} already registered with us.` })

        const uniqueMobile = await hrModel.findOne({ mobile })
        if (uniqueMobile) return res.status(400).send({ status: false, message: `${mobile} already registered with us.` })

        const uniqueEmployeeId = await hrModel.findOne({ employeeId })
        if (uniqueEmployeeId) return res.status(400).send({ status: false, message: `${employeeId} already registered with us.` })

        // Data Creation
        const createHr = await hrModel.create(hrData)
        res.status(201).send({ status: true, message: 'Your registration is successful.', data: createHr })

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

//-----------------------------------------------------------------Login HR---------------------------------------------------------------------------------//
const loginHr = async (req, res) => {
    try {
        const credential = req.body
        if (!validation.isValidRequest(credential)) return res.status(400).send({ status: false, message: 'Please enter your login details.' })

        const { email, password } = credential

        // Validation of Required Fields
        if (!validation.isValidValue(email && password))
            return res.status(400).send({ status: false, message: "Please fill required fields [email & password]  to login." })

        // Find hr by email
        const findHr = await hrModel.findOne({ email })
        if (!findHr) return res.status(404).send({ status: false, message: `${email} not found` })

        // Verifying Password
        const actualPass = findHr.password
        if (actualPass != password) return res.status(401).send({ status: false, message: "Incorrect Password" })

        // Token Generation
        let token = await jwt.sign({
            hrId: findHr._id,
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60
        }, 'aN$ieSh&1@9*3aHR')

        res.setHeader('x-auth-token', token)
        res.status(200).send({ status: true, message: "Login Successful", data: {hrId:findHr._id, token: token } })

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

//------------------------------------------------------------------Job Post API------------------------------------------------------------------------//


module.exports = { registerHr, loginHr }