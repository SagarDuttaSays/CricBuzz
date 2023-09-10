const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/services\/(.*)/, methods: ['GET'] },
            { url: /\/api\/user\/cart\/(.*)/, methods: ['POST'] },
            `${api}/admin/login`,   
            `${api}/admin/signup`   
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        done(null, true)
    }

    done();
}
module.exports = authJwt