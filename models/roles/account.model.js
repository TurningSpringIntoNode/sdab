const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({

});

const AccountModel = mongoose.model('AccountModel', AccountSchema);

module.exports = AccountModel;