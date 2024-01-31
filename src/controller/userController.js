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
        return res.status(400).json({error: 'semua form harus diisi'})
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

        console.log(newUser);

        const token = jwt.sign({userId: newUser.id}, secret, {expiresIn: '1h'});
        res.json({
            message: 'registrasi sukses', user:newUser,token
        })

    } catch (error) {
            console.log('error registrasi :', error);
            res.status(500).json({ error: 'Internal server error' })
        }
    
}

// login
exports.login = async(req,res)=>{
    const {email, password} = req.body;

    if (!email || !password ){
        return res.status(400).json({error: 'semua harus diisi'});
    }

    try {
        const checkUser = await prisma.user.findUnique({
            where: {email},
        });

        if(!checkUser){
            return res.status(400).json({error: 'email salah'})
        }

        // Pastikan checkUser tidak kosong sebelum mencoba membandingkan password
        if (checkUser.password) {
            const matchPassword = await bcrypt.compare(password, checkUser.password)
            if (matchPassword) {
                const token = jwt.sign({ userId: checkUser.id }, secret, { expiresIn: '1h' });
                return res.json({ message: 'Login berhasil', checkUser, token })
            } else {
                return res.status(401).json({ error: 'password salah' })
            }
        } else {
            return res.status(400).json({ error: 'password tidak ditemukan atau kosong' })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'Login gagal' })
    }
}


// Get user by email
exports.getUserByEmail = async (req, res) => {
    const { id } = req.params; // Ambil userEmail dari URL

    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
        });

        if (!user) {
            return res.status(404).json({
                message: 'User tidak ditemukan',
                status: false,
            });
        }

        return res.json({
            message: 'User ditemukan',
            status: true,
            user,
        });

    } catch (error) {
        console.log('Error dalam mendapatkan informasi user:', error);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};



