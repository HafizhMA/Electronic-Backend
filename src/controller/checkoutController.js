const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.postAlamat = async (req, res) => {
    const { userId, alamat, kota, provinsi, kodePos } = req.body;

    if (!userId || !alamat || !kota || !provinsi || !kodePos) {
        return res.status(400).json({
            message: 'All fields are required',
        });
    }

    try {
        const newAlamat = await prisma.alamatPengiriman.create({
            data: {
                alamat,
                kota,
                provinsi,
                kodePos,
                User: {
                    connect: { id: userId }
                }
            },
        });

        res.status(200).json({ newAlamat, message: 'success creating alamat' })
    } catch (error) {
        console.error('error creating alamat', error);
        res.status(500).json({
            message: 'failed creating alamat'
        });
    }
}