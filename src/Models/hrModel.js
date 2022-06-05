const mongoose = require('mongoose')

const hrSchema = new mongoose.Schema(
    {
        name: {type:String, required:true, trim:true},
        company:{type:String, required:true, trim:true},
        employeeId: {type:String, required:true, trim:true, unique:true},
        email: {type:String, required:true, trim:true, unique:true},
        mobile:{type:String, required:true, trim:true, unique:true},
        password:{type:String, required:true, trim:true}

     })
module.exports = mongoose.model('Hr',hrSchema)