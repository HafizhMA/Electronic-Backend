const { PrismaClient } = require("@prisma/client");
const { default: axios } = require("axios");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT env
const secret = process.env.JWT_SECRET;

// register
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "semua form harus diisi" });
  }

  try {
    const duplicateUser = await prisma.user.findUnique({
      where: { email },
    });

    if (duplicateUser) {
      return res.status(400).json({ error: "email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    const token = jwt.sign({ userId: newUser.id }, secret, { expiresIn: "1h" });
    res.json({
      message: "registrasi sukses",
      user: newUser,
      token,
    });
  } catch (error) {
    console.log("error registrasi :", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "semua harus diisi" });
  }

  try {
    const checkUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!checkUser) {
      return res.status(400).json({ error: "email salah" });
    }

    // Pastikan checkUser tidak kosong sebelum mencoba membandingkan password
    if (checkUser.password) {
      const matchPassword = await bcrypt.compare(password, checkUser.password);
      if (matchPassword) {
        const token = jwt.sign({ userId: checkUser.id }, secret, {
          expiresIn: "1h",
        });
        return res.json({ message: "Login berhasil", checkUser, token });
      } else {
        return res.status(401).json({ error: "password salah" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "password tidak ditemukan atau kosong" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Login gagal" });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params; // Ambil userEmail dari URL

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
        status: false,
      });
    }

    return res.json({
      message: "User ditemukan",
      status: true,
      user,
    });
  } catch (error) {
    console.log("Error dalam mendapatkan informasi user:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const sendEmailForgotPassword = async (nama, token, email) => {
  let data = {
    service_id: process.env.SERVICE_ID,
    template_id: process.env.TEMPLATE_ID,
    user_id: process.env.USER_ID,
    template_params: {
      'nama': nama,
      'token': token,
      'to_email': email
    },
    'accessToken': process.env.ACCESS_TOKEN
  };

  try {
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', data)

    return true
  } catch (error) {
    console.log(error);
    return false
  }
}

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body

  // logic disini
  const checkUser = await prisma.user.findUnique({
    where: { email },
  });

  if (checkUser) {

    const resetPasswordToken = jwt.sign({ userId: checkUser.id }, secret, { expiresIn: '1h' });

    await prisma.user.update({
      where: { email },
      data: {
        token_reset_password: resetPasswordToken,
      },
    });
    // function send email
    // params1: nama user
    // params2: email user
    const response = await sendEmailForgotPassword(checkUser.email, `update-password/${resetPasswordToken}`, checkUser.email)

    if (response) {
      return res.json({ message: 'Email berhasil terkirim!' })
    } else {
      return res.status(400).json({ error: 'Email gagal terkirim!' })
    }
    // jika tidak ada, kirim response error / belum terdaftar
  } else if (!checkUser) {
    return res.status(400).json({ error: 'belum terdaftar' })
  }
}

exports.checkToken = async (req, res) => {
  const { token } = req.body

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decode);

    const user = await prisma.user.findUnique({
      where: {
        id: decode.userId
      },
    });

    if (!user.token_reset_password) {
      return res.json({
        message: "token invalid",
        status: false,
      })
    }

    if (user) {
      return res.json({
        message: "token valid",
        status: true,
      })
    }
  } catch (error) {
    return res.json({
      message: 'Token invalid',
      status: false,
    })
  }
}

// Update Password
exports.updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);

    const user = await prisma.user.findUnique({
      where: {
        id: decode.userId
      },
    });

    if (!user || !user.token_reset_password || user.token_reset_password !== token) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.update({
      where: { id: decode.userId },
      data: {
        password: hashedNewPassword,
        token_reset_password: null,
      },
    });

    res.json({
      status: true,
      message: 'Password Updated Successful'
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Password Update Failed' });
  }
};


