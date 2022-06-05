const mongoose = require('mongoose')

const applicantSchema = new mongoose.Schema(
    {
        name: {type:String, required:true, trim:true},
        email:{type:String, required:true, trim:true},
        mobile :{type:String, required:true, trim:true},
        password:{type:String, required:true, trim:true},
        qualification:[{type:String, required:true,trim:true, enum:['Diploma','B.tech','M.tech','B.Sc','M.Sc','BBA','MBA']}],
        percentage:{type:Number, required:true,trim:true,min:1, max:100},
        qualificationStatus:{type:String, required:true, trim:true, enum:['completed', 'pursuing']},
        passout:{type:String}, // When completed this field will required. Year and month of passout not greater than current date
        jobsApplied:{type:Number,default:0}


    },{timestamps:true}
)

module.exports =mongoose.model('Applicant',applicantSchema)