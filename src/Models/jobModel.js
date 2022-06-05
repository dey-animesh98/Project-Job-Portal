const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const jobSchema = new mongoose.Schema(
    {
        hrId: { type: ObjectId, required: true, trim: true, ref: 'Hr' }, //path param
        company:{ type: String, required: true, trim: true }, //Set using hr id
        position: { type: String, required: true, trim: true, enum: ['SDE-1', 'SDE-2', 'Data Analyst', 'Catalogue Analyst', 'Data Scientist', 'Recruiter', 'CSA', 'CSE', 'Process Engineer', 'Accountant'] },
        department: { type: String, required: true, trim: true, enum: ['Engineering', 'Analyst', 'Finance', 'Human Resource', 'BPO'] },
        openings: { type: Number, required: true, trim: true, min:1 },
        lastDate: { type: String, required: true, trim: true },  //DD/MM/YYYY
        qualification: [{ type: String, required: true, trim: true, enum: ['Diploma', 'B.tech', 'M.tech', 'B.Sc', 'M.Sc', 'BBA', 'MBA'] }],
        percentage: { type: Number, required: true, trim: true, min:1, max:100 },
        totalApplications: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false }

    }, { timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)
