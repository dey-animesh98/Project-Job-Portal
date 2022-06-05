const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const applicationSchema = new mongoose.Schema(
    {
        jobId: { type: ObjectId, required: true, ref: 'Job' }, // path param
        applicantId: { type: ObjectId, required: true, ref: 'Applicant' }, //from path param 
        applicantName: { type: String, required: true },//from applicant id
        position: { type: String, required: true }, //Detect by job id
        dateApplied: { type: String, required: true },//CONTROLLER
        company: { type: String, required: true },  //Detect by job id
        postedBy: { type: String, required: true },
        hrId: { type: ObjectId, required: true, ref: 'Hr' }, // Detect by job id
        status: { type: String, default: 'Submitted', enum: ['Submitted', 'Accepted', 'Under Review', 'Rejected', 'withdrawn'] } // only can change by concerned person

    }, { timestamps: true }
)

module.exports = mongoose.model('Application', applicationSchema)