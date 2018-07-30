const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.verifyNewUsers = functions.auth.user().onCreate((user) => {

    if (!user.email.includes('@byui.edu')) {
        // delete the account
        return admin.auth().deleteUser(user.uid)
            .then(() => {
                return admin.auth().revokeRefreshTokens(user.uid);
            })
            .then(() => {
                console.log('Invalid account - User deleted: ' + user.email);
            });
    }

    // disable the account
    admin.auth().revokeRefreshTokens(user.uid);
    return admin.auth().updateUser(user.uid, {
        disabled: true
    })
        .then(() => {
            console.log('Valid account - User disabled: ' + user.email);
        });

});
