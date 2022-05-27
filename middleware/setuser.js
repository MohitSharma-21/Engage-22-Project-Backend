const { User, Token } = require("../models");

const requireAuth = (req, res, next) => {

    // checks user is login or not

    const token = req.headers['authorization']

    if (token) {

        // const token = header[1];

        Token.findOne({
            token: token
        })
            .then((result) => {
                if (result) {
                    req.user = result.user;
                    next();
                }
                else
                    res.status(401).send("The requested page needs a username and a password.");

            })
            .catch((err) => console.log(err))

    }
    else {
        res.status(401).send("The requested page needs a username and a password and a token in authorization header");

    }

}


module.exports = { requireAuth };