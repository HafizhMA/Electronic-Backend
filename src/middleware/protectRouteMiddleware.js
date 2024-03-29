const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const auth = req.headers['authorization'];
    console.log('Request Headers:', req);
    console.log('Authorization Header:', auth);

    if (!auth) {
        console.log('no authorization');
        return res.status(401).json({
            message: 'no authorization'
        });
    }
    const token = auth.split(' ')[1];

    try {
        const verifToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log('isi verifToken', verifToken);
        if (!verifToken.userId) {
            console.log('Token verification failed');
            res.status(401).json({
                message: "No Authorized"
            })
            return
        } else {
            console.log('Token verified successfully');
            next();
        }
    } catch (error) {
        res.status(401).json({
            message: "No Authorized"
        })
    }
}

module.exports = authenticateToken;