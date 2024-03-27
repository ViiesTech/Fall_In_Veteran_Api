const mongoose = require('mongoose')


const PageModal = new mongoose.Schema({
    OwnerPageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Members:[mongoose.Schema.Types.ObjectId],
    PageName: String,
    PageImage: String,
    Mode: String,
})

const page = mongoose.model('page', PageModal);

module.exports  =  page;