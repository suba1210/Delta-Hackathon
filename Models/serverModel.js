const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ServerSchema = new Schema({

    name : {
        type:String
    },

    routers : [{
        type: Schema.Types.ObjectId,
        ref : 'Router'
    }]


},{
    timestamps: true
});



module.exports = mongoose.model('Server', ServerSchema);