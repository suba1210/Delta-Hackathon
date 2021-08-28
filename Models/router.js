const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const RouterSchema = new Schema({

    name : {
        type:String
    },
    type : {
        type : String
    },
    server : {
        type: Schema.Types.ObjectId,
        ref : 'Server'
    },
    send : {
        type : String,
        default : "NOTHING TO SHOW"
    }

},{
    timestamps: true
});



module.exports = mongoose.model('Router', RouterSchema);