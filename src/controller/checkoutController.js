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
        const existingAlamat = await prisma.alamatPengiriman.findFirst({
            where: {
                userId: userId
            }
        });

        const isDefault = !existingAlamat;

        const newAlamat = await prisma.alamatPengiriman.create({
            data: {
                alamat,
                kota,
                provinsi,
                kodePos,
                isDefault,
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

exports.getAlamat = async (req, res) => {
    try {
        const Alamat = await prisma.alamatPengiriman.findMany({
            include: {
                User: true
            }
        });

        if (Alamat.length === 0) {
            return res.status(404).json({
                message: 'No such alamat pengirim'
            });
        }

        res.status(200).json({
            Alamat,
            message: 'Success getting alamat pengirim'
        });
    } catch (error) {
        console.error('Error fetching alamat pengirim:', error);
        res.status(500).json({
            message: 'Error fetching alamat pengirim'
        });
    }
};
