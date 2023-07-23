const yup = require('yup')
const config = require('config')
const jwt = require('jsonwebtoken')


const create = (req, res, next)=>{
    const userSchema = yup.object({
        email: yup.string().max(255).email().required('email required'),
        password: yup.string().min(8).max(255).required('password required'),
    });
    
    userSchema.validate(req.body)
        .then(() => {next();})
        .catch((error)=>{res.status(400).json({message: error.message})})
}

const isLogin = (req, res, next) => {
    if (!req.headers['x-auth-token']) return res.status(401).json({message: "login required: no key"})
    // const header = req.headers['x-auth-token'];
    // const key = config.get('jwt-secret-key');

    // jwt.verify(header, key).then(next()).catch((e)=>{return res.status(401).json({message: "login required"})})

    // if (jwt.verify(header, key)) next()
    // return res.status(401).json({message: "login required"})

    const token = req.headers['x-auth-token'];
    const secretKey = config.get('jwt-secret-key');
    
    // Verify the JWT token
    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {return res.status(401).json({message: "login required"})}
        req.user = decodedToken
        next()
    });
    



}

module.exports = {
    create: create,
    login: create,
    isLogin: isLogin,
}