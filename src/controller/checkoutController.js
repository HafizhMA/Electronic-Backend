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
                },
            },
        });

        if (newAlamat.isDefault === true) {
            await prisma.checkout.updateMany({
                where: {
                    userId: userId,
                    alamatPengirimanId: null,
                },
                data: {
                    alamatPengirimanId: newAlamat.id
                }
            })
        }


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
            },
            orderBy: {
                isDefault: 'desc'
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

exports.setAlamat = async (req, res) => {
    const { data } = req.body;
    try {
        // Step 1: Update all addresses of the user to isDefault: false
        await prisma.alamatPengiriman.updateMany({
            where: {
                userId: data.userId,
                isDefault: true
            },
            data: {
                isDefault: false
            },
        });

        // Step 2: Set the selected address to isDefault: true
        await prisma.alamatPengiriman.update({
            where: {
                id: data.id
            },
            data: {
                isDefault: true,
            },
        });

        // Step 3: Link the default address to the user's checkout process
        await prisma.checkout.updateMany({
            where: {
                userId: data.userId,
            },
            data: {
                alamatPengirimanId: data.id // Assuming `alamatPengirimanId` stores the address ID
            }
        });

        return res.status(200).json({
            message: 'Successfully updated the selected address and linked it to the checkout.'
        });
    } catch (error) {
        console.error('Error updating delivery address:', error);
        res.status(500).json({
            message: 'Error updating delivery address'
        });
    }
}

exports.updateAlamat = async (req, res) => {
    const { updateData } = req.body;

    try {
        const updatedData = await prisma.alamatPengiriman.update({
            where: {
                id: updateData.id
            },
            data: {
                provinsi: updateData.provinsi,
                kota: updateData.kota,
                kodePos: updateData.kodePos,
                alamat: updateData.alamat,
            }
        })

        res.status(200).json({
            updatedData,
            message: 'success update alamat'
        })
    } catch (error) {
        console.error('failed update alamat', error);
        res.status(500).json({
            message: 'failed update alamat'
        })
    }
}

exports.deleteAlamat = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAlamat = await prisma.alamatPengiriman.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({
            deletedAlamat,
            message: 'success delete alamat'
        })
    } catch (error) {
        console.error('failed delete alamat', error);
        res.status(500).json({
            message: 'failed delete alamat'
        })
    }
}


