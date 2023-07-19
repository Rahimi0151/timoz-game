const yup = require('yup')

const create = (req, res, next)=>{
    const userSchema = yup.object({
        email: yup.string().max(255).email().required('email required'),
        password: yup.string().min(8).max(255).required('password required'),
    });
    
    userSchema.validate(req.body)
        .then(() => {next();})
        .catch((error)=>{res.status(400).json({message: error.message})})
}
module.exports = {create}