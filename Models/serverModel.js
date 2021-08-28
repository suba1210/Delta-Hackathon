const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ServerSchema = new Schema({

    name : {
        type:String
    },

    routers : [{
        type: Schema.Types.ObjectId,
        ref : 'Router'
    }],

    data : [{
        type: Schema.Types.ObjectId,
        ref : 'Schema'
    }]

},{
    timestamps: true
});



module.exports = mongoose.model('Server', ServerSchema);