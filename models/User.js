const {Scehema, model} = require('mongoose');

const schema = new Scehema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    links: [{type: Types.ObjectId, ref: "Link"}]
})

module.exports = model('User', schema);