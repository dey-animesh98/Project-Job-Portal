const jwt = require('jsonwebtoken')

// HR Authentication
const hrAuthentication = async function (req, res, next) {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(401).send({ status: false, msg: "JWT Token must be present" });
        let splittoken = token.split(' ')

        jwt.verify(splittoken[1], "aN$ieSh&1@9*3aHR", (err, decode) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    message: err.message
                })
            } else {
                req.decodeToken = decode
                //console.log(req.decodeToken)
                next()
            }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

// Applicant Authentication
const applicantAuthentication = async function (req, res, next) {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(401).send({ status: false, msg: "JWT Token must be present" });
        let splittoken = token.split(' ')

        jwt.verify(splittoken[1], "aN$ieSh&1@9*3aAP", (err, decode) => {
            if (err) {
                return res.status(401).send({
                    status: false,
                    message: err.message
                })
            } else {
                req.decodeToken = decode
                //console.log(req.decodeToken)
                next()
            }
        })

    } catch (err) {
        return res.status(500).send({ status: false, message: 'ERROR', Error: err.message })
    }
}

module.exports = { hrAuthentication, applicantAuthentication }

