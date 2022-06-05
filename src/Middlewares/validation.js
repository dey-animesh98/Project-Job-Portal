//email validation
const isValidEmail = function (email) {
    const emailRegex = /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/
    return emailRegex.test(email)
}
//password validation
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passwordRegex.test(password)
}
//name validation
const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z , ]{2,30}$/
    return nameRegex.test(name)
}
// mobile validation
const isValidPhone = function (Phone) {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(Phone)
}

//Date Validation
const isValidDate = function (date) {
    const dateRegex = /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/
    return dateRegex.test(date)
}
//Script validation
const isValidScripts = function (script) {
    const scriptRegex = /^[a-zA-Z0-9 '"$@,.;:?&!_-]{2,}$/
    return scriptRegex.test(script)
}
// Passout Date Validation
const isValidPassoutDate = function (passout) {
    const passoutRegex = /(0[1-9]|1[0-2])[\/][12]\d{3}/
    return passoutRegex.test(passout)
}
//Position validation
const isValidPosition = function (position) {
    return ['SDE-1', 'SDE-2', 'Data Analyst', 'Catalogue Analyst', 'Data Scientist', 'Recruiter', 'CSA', 'CSE', 'Process Engineer', 'Accountant'].indexOf(position) !== -1
}

//Department validation
const isValidDepartment = function (position) {
    return ['Engineering', 'Analyst', 'Finance', 'Human Resource', 'BPO'].indexOf(position) !== -1
}

//Qalification validation
// const isValidQalification = function (qualification) {
//     return ['Diploma', 'B.tech', 'M.tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA'].indexOf(qualification) !== -1
// }

//Qalification Status validation
const isValidQalificationStatus = function (qualificationStatus) {
    return ['completed', 'pursuing'].indexOf(qualificationStatus) !== -1
}

//value validation
const isValidValue = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
//Rating validation
const isValidRating = function (rating) {
    const ratingRegex = /^[\1-5]*$/
    return ratingRegex.test(rating)
}

//Interger Number Valdation
const isIntNumber = function (num) {
    const numRegex = /^[0-9]*$/
    return numRegex.test(num)
}
//request validation
const isValidRequest = function (request) {
    return (Object.keys(request).length > 0)
}

//Future & Present date
const isFutureDate = function (lastDate) {
    let currDate = new Date().getDate(), currMonth = new Date().getMonth() + 1, currYear = new Date().getFullYear()
    let splitedDate = lastDate.split('/')
    let year = Number(splitedDate[2]), month = Number(splitedDate[1]), date = Number(splitedDate[0])

    if (year < currYear) {
        return false
    } else if (year == currYear && month < currMonth) {
        return false
    } else if (year == currYear && month == currMonth && date < currDate) {
        return false
    } else {
        return true
    }
}

// Passout Date Validation
const isPastDate = function (passout) {
    let currMonth = new Date().getMonth() + 1, currYear = new Date().getFullYear()
    let splitedDate = passout.split('/')
    let month = Number(splitedDate[0]), year = Number(splitedDate[1])
    if (year > currYear) return false
    else if (year == currYear && month > currMonth) return false
    else return true
}

const lastDate = function (lastDate) {
    const applyDate = new Date().toLocaleDateString()
    let ApppSplitDte = applyDate.split("/")
    let aYear = Number(ApppSplitDte[2]), aMonth = Number(ApppSplitDte[1]), aDate = Number(ApppSplitDte[0])

    let splitedDate = lastDate.split('/')
    let lyear = Number(splitedDate[2]), lmonth = Number(splitedDate[1]), ldate = Number(splitedDate[0])

    if (aYear > lyear) {
        return false
    } else if (aYear == lyear && aMonth > lmonth) {
        return false
    } else if (aYear == lyear && aMonth == lmonth && aDate > ldate) {
        return false
    } else {
        return true
    }
}

const isEligbleQ = function (required, incoming) {
    for (let i = 0; i < required.length; i++) {
        if (incoming.includes(required[i])) {
            return true
        } else {
            return false
        }
    }
}

const isEmptyKey = function(key){ 
    let obArr = Object.keys(key)
    let str = ""
    obArr.forEach(e=>{
        if(key.hasOwnProperty(e) && key[e].trim() == "") {
            str+=`${e} `
        }
    })
    str = str.trim()
    return str=="" ? false : str
 }

module.exports = {
    isValidEmail, isValidPassword, isValidValue, isValidName, isValidPassoutDate,
    isValidPosition, isValidDepartment, isValidQalificationStatus, lastDate,
    isValidPhone, isValidRequest, isValidRating, isValidDate, isValidScripts,
    isFutureDate, isPastDate, isIntNumber, isEligbleQ, isEmptyKey
}