const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const SubSchema = new Schema({

    name : {
        type:String
    },
    send : {
        type : String
    }

},{
    timestamps: true
});



module.exports = mongoose.model('Sub', SubSchema);