const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();

const rajaOngkirUrl = 'https://api.rajaongkir.com/starter'; // or 'pro' if you're using Pro
const rajaOngkirKey = process.env.RAJAONGKIR_API_KEY;

exports.postAlamat = async (req, res) => {
    const { userId, alamat, kota, provinsi, kodePos } = req.body;

    if (!userId || !alamat || !kota || !provinsi || !kodePos) {
        return res.status(400).json({
            message: 'All fields are required',
        });
    }

    try {
        // Check if the user already has a default address
        const existingDefaultAlamat = await prisma.alamatPengiriman.findFirst({
            where: {
                userId: userId,
                isDefault: true
            }
        });

        // Set isDefault to true if there are no default addresses, otherwise false
        const isDefault = !existingDefaultAlamat;

        // Create the new address
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

        // If the new address is default, update existing checkouts
        if (isDefault) {
            await prisma.checkout.updateMany({
                where: {
                    userId: userId,
                    alamatPengirimanId: null,
                },
                data: {
                    alamatPengirimanId: newAlamat.id
                }
            });
        }

        res.status(200).json({ newAlamat, message: 'success creating alamat' });
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
        await prisma.alamatPengiriman.updateMany({
            where: {
                userId: data.userId,
                isDefault: true
            },
            data: {
                isDefault: false
            },
        });

        await prisma.alamatPengiriman.update({
            where: {
                id: data.id
            },
            data: {
                isDefault: true,
            },
        });

        await prisma.checkout.updateMany({
            where: {
                userId: data.userId,
            },
            data: {
                alamatPengirimanId: data.id
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
    const { userId } = req.body;

    try {
        // Hapus alamat yang diinginkan
        const deletedAlamat = await prisma.alamatPengiriman.delete({
            where: {
                id: id
            }
        });

        // Ambil semua alamat yang tersisa untuk user yang sama
        const allAlamat = await prisma.alamatPengiriman.findMany({
            where: {
                userId: userId
            }
        });

        // Jika hanya ada satu alamat tersisa, set alamat tersebut sebagai isDefault: true
        if (allAlamat.length === 1) {
            const remainingAlamat = allAlamat[0];
            await prisma.alamatPengiriman.update({
                where: { id: remainingAlamat.id },
                data: { isDefault: true }
            });
        }

        res.status(200).json({
            deletedAlamat,
            message: 'Success delete alamat'
        });
    } catch (error) {
        console.error('Failed delete alamat', error);
        res.status(500).json({
            message: 'Failed delete alamat'
        });
    }
};

const getCityRajaOngkir = async () => {
    try {
        const response = await axios.get(`${rajaOngkirUrl}/city`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'key': rajaOngkirKey,
                }
            })
        return response.data;
    } catch (error) {
        console.error('failed fetch api', error)
        throw new Error('Error fetching cities from Raja Ongkir API');
    }
}

const getProvinceRajaOngkir = async () => {
    try {
        const response = await axios.get(`${rajaOngkirUrl}/province`, {
            headers: {
                'Content-Type': 'application/json',
                'key': rajaOngkirKey,
            }
        })
        return response.data;
    } catch (error) {
        console.error('failed fetch api', error)
        throw new Error('Error fetching province from Raja Ongkir API');
    }
}

exports.getCityOngkir = async (req, res) => {
    try {
        const getCity = await getCityRajaOngkir();
        res.status(200).json({
            getCity,
            message: 'success get city'
        })
    } catch (error) {
        console.error('failed get city', error);
        res.status(500).json({
            message: 'failed get city'
        })
    }
}

exports.getProvinceOngkir = async (req, res) => {
    try {
        const getProvince = await getProvinceRajaOngkir();
        res.status(200).json({
            getProvince,
            message: 'success get province'
        })
    } catch (error) {
        console.error('failed get province', error);
        res.status(500).json({
            message: 'failed get province'
        })
    }
}



