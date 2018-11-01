const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({

});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;