const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schemaSchema = new Schema({

    name : {
        type:String
    },
    name1:{
        type : String
    },
    type1 : {
        type : String
    },
    name2:{
        type : String
    },
    type2 : {
        type : String
    },
    name3:{
        type : String
    },
    type3 : {
        type : String
    }

},{
    timestamps: true
});



module.exports = mongoose.model('Schema', schemaSchema);