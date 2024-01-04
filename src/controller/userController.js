const { PrismaClient } = require('@prisma/client');
const { default: axios } = require('axios');

const prisma = new PrismaClient()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// JWT env
const secret = process.env.JWT_SECRET;

// register
exports.register = async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: 'semua harus diisi'})
    }

    try{
        const duplicateUser = await prisma.user.findUnique({
            where: {email},
        })
        
        if (duplicateUser){
            return res.status(400).json({error: 'email sudah terdaftar'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign({userId: newUser.id}, secret, {expiresIn: '1h'});
        res.json({
            message: 'registrasi sukses', user:newUser,token
        })

    } catch (error) {
            console.log('error registrasi :', error);
            res.status(500).json({ error: 'Internal server error' })
        }
    
}