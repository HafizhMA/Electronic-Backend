const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require('axios');
require('dotenv').config();

const rajaOngkirUrl = 'https://api.rajaongkir.com/starter';
const rajaOngkirKey = process.env.RAJAONGKIR_API_KEY;
const serverKeyMidtrans = Buffer.from(process.env.SERVER_KEY_MIDTRANS).toString('base64');

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

exports.checkoutOneProduct = async (req, res) => {
    const { data } = req.body;

    try {
        const createCart = await prisma.cartItem.create({
            data: {
                userId: data.userId,
                productId: data.productId,
                quantity: 1
            }
        });

        const defaultAlamat = await prisma.alamatPengiriman.findFirst({
            where: {
                userId: data.userId,
                isDefault: true
            }
        });

        if (defaultAlamat) {
            const createCheckout = await prisma.checkout.create({
                data: {
                    userId: data.userId,
                    items: {
                        connect: {
                            id: createCart.id
                        },
                    },
                    alamatPengirimanId: defaultAlamat.id
                }
            });

            return res.status(200).json({
                createCheckout,
                message: 'success create checkout'
            })
        }

        const createCheckout = await prisma.checkout.create({
            data: {
                userId: data.userId,
                items: {
                    connect: {
                        id: createCart.id
                    },
                },
            }
        });

        return res.status(200).json({
            createCheckout,
            message: 'success create checkout'
        })
    } catch (error) {
        console.log('error create checkout', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

exports.postAlamat = async (req, res) => {
    const { userId, alamat, kotaId, provinsiId, kodePos } = req.body;

    if (!userId || !alamat || !kotaId || !provinsiId || !kodePos) {
        return res.status(400).json({
            message: 'All fields are required',
        });
    }

    try {
        // Ambil data kota dan provinsi dari API Raja Ongkir
        const citiesResponse = await getCityRajaOngkir();
        const provincesResponse = await getProvinceRajaOngkir();

        const city = citiesResponse.rajaongkir.results.find(c => c.city_id === kotaId);
        const province = provincesResponse.rajaongkir.results.find(p => p.province_id === provinsiId);

        if (!city || !province) {
            return res.status(404).json({
                message: 'City or Province not found',
            });
        }

        // Check if the user already has a default address
        const existingDefaultAlamat = await prisma.alamatPengiriman.findFirst({
            where: {
                userId: userId,
                isDefault: true
            }
        });

        const isDefault = !existingDefaultAlamat;

        // Create the new address
        const newAlamat = await prisma.alamatPengiriman.create({
            data: {
                alamat,
                kotaId: kotaId,
                kota: city.city_name,
                provinsiId: provinsiId,
                provinsi: province.province,
                kodePos,
                isDefault,
                User: {
                    connect: { id: userId }
                },
            },
        });

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
        const citiesResponse = await getCityRajaOngkir();
        const provincesResponse = await getProvinceRajaOngkir();

        const city = citiesResponse.rajaongkir.results.find(c => c.city_id === updateData.kotaId);
        const province = provincesResponse.rajaongkir.results.find(p => p.province_id === updateData.provinsiId);

        if (!city || !province) {
            return res.status(404).json({
                message: 'City or Province not found',
            });
        }

        const updatedData = await prisma.alamatPengiriman.update({
            where: {
                id: updateData.id
            },
            data: {
                provinsiId: updateData.provinsiId,
                provinsi: province.province,
                kotaId: updateData.kotaId,
                kota: city.city_name,
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
                data: {
                    isDefault: true
                }
            });

            // connect ke alamat yang tersisa
            await prisma.checkout.updateMany({
                where: {
                    userId: userId,
                },
                data: {
                    alamatPengirimanId: remainingAlamat.id
                }
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

const getProvinceRajaOngkirSatuan = async (id) => {
    try {
        const response = await axios.get(`${rajaOngkirUrl}/province`, {
            headers: {
                'Content-Type': 'application/json',
                'key': rajaOngkirKey,
            },
            params: { id }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch province from Raja Ongkir API', error);
        throw new Error('Error fetching province from Raja Ongkir API');
    }
};

exports.getProvinceOngkirSatuan = async (req, res) => {
    const { id } = req.query;
    try {
        const provinceData = await getProvinceRajaOngkirSatuan(id);
        res.status(200).json({
            province: provinceData,
            message: 'Success fetching province',
        });
    } catch (error) {
        console.error('Failed to get province', error);
        res.status(500).json({
            message: 'Failed to get province',
        });
    }
};

exports.getOngkir = async (req, res) => {
    const { data } = req.body;

    try {
        const sellerAddress = await prisma.alamatPengiriman.findFirst({
            where: { id: data.alamatPenjual.id },
        });

        const buyerAddress = await prisma.alamatPengiriman.findFirst({
            where: { userId: data.userId },
        });

        if (!sellerAddress || !buyerAddress) {
            return res.status(400).json({
                message: 'Invalid address information',
            });
        }

        const service = data.service;
        const weightProduct = data.checkoutProduct.berat;

        const ongkirParams = {
            origin: sellerAddress.kotaId,
            destination: buyerAddress.kotaId,
            weight: weightProduct,
            courier: service,
        };

        const ongkir = await axios.post(`${rajaOngkirUrl}/cost`, ongkirParams, {
            headers: {
                'Content-Type': 'application/json',
                key: rajaOngkirKey,
            },
        });

        res.status(200).json({
            ongkir: ongkir.data,
            product: data.checkoutProduct,
            message: 'success get ongkir',
        });
    } catch (error) {
        console.error('failed fetch ongkir', error);
        res.status(500).json({
            message: 'failed fetch ongkir',
        });
    }
};

exports.connectJasaCart = async (req, res) => {
    const { data } = req.body;

    try {
        const existingService = await prisma.jasaKirim.findFirst({
            where: {
                cartItems: {
                    some: {
                        id: data.newServiceCost.id,
                    },
                },
            },
        });

        if (existingService) {
            const updatedService = await prisma.jasaKirim.update({
                where: {
                    id: existingService.id,
                },
                data: {
                    namaJasa: data.newServiceCost.services,
                    ongkosKirim: data.newServiceCost.biaya,
                },
            });

            return res.status(200).json({
                updatedService,
                message: 'Success updated jasa kirim',
            });
        } else {
            // Jika JasaKirim belum ada, buat yang baru
            const createService = await prisma.jasaKirim.create({
                data: {
                    namaJasa: data.newServiceCost.services,
                    ongkosKirim: data.newServiceCost.biaya,
                    cartItems: {
                        connect: { id: data.newServiceCost.id },
                    },
                },
            });

            return res.status(200).json({
                createService,
                message: 'Success connect jasa kirim to cart items',
            });
        }
    } catch (error) {
        console.error('Failed connect jasa kirim to cart items', error);
        res.status(500).json({
            message: 'Failed connect jasa kirim to cart items',
        });
    }
};

exports.midtransPayment = async (req, res) => {
    const { data } = req.body;

    const itemDetail = data.item_details.map((items, index) => {
        const quantity = data.quantity[index];
        const discountedPrice = items.hargaBarang - (items.hargaBarang * (items.diskon / 100));

        return {
            id: items.id,
            price: discountedPrice,
            quantity: quantity,
            name: items.namaBarang,
            brand: items.kategori,
            category: items.kategori,
            merchant_name: items.user.username,
            url: `http://127.0.0.1:5173/detail/${items.id}`
        }
    });

    const itemDetails = data.item_details.map((items, index) => {
        const quantity = data.quantity[index];
        const discountedPrice = items.hargaBarang - (items.hargaBarang * (items.diskon / 100));

        return {
            id: items.id,
            price: discountedPrice,
            quantity: quantity,
            name: items.namaBarang,
            brand: items.kategori,
            category: items.kategori,
            merchant_name: items.user.username,
            url: `http://127.0.0.1:5173/detail/${items.id}`
        }
    });

    const customer = await prisma.user.findFirst({
        where: {
            id: data.customerId
        }, include: {
            AlamatPengiriman: {
                where: {
                    isDefault: true
                }
            }
        }
    })

    const services = await prisma.cartItem.findMany({
        where: {
            checkoutId: data.id,
        },
        include: { jasaKirim: true }
    });

    const allService = services.map(service => service.jasaKirim);

    allService.forEach(service => {
        itemDetail.push({
            id: service.id,
            price: service.ongkosKirim,
            quantity: 1,
            name: service.namaJasa,
            brand: 'Logistics',
            category: 'Shipping',
            merchant_name: 'Shipping Provider',
            url: 'shipping url'
        });
    });

    const purchasedItemProduct = itemDetails.map(product => {
        const matchingData = data.item_details.find(detail => detail.id === product.id);
        return {
            ...product,
            img: matchingData.img
        };
    });

    const transactionData = {
        transaction_details: {
            order_id: `order-${Math.floor(Math.random() * 10000000000)}`,
            gross_amount: data.gross_Amount
        },
        item_details: itemDetail,
        customer_details: {
            first_name: customer.username,
            email: customer.email,
            phone: customer.no_telp,
            billing_address: {
                first_name: customer.username,
                email: customer.email,
                phone: customer.no_telp,
                address: customer.AlamatPengiriman[0].alamat,
                city: customer.AlamatPengiriman[0].kota,
                postal_code: customer.AlamatPengiriman[0].kodePos,
                country_code: "IDN"
            },
            shipping_address: {
                first_name: customer.username,
                email: customer.email,
                phone: customer.no_telp,
                address: customer.AlamatPengiriman[0].alamat,
                city: customer.AlamatPengiriman[0].kota,
                postal_code: customer.AlamatPengiriman[0].kodePos,
                country_code: "IDN"
            }
        },
    }

    await prisma.checkout.update({
        where: {
            id: data.id
        },
        data: {
            purchasedItem: {
                product: purchasedItemProduct,
                services: allService
            }
        }
    })
    try {
        const response = await axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions', transactionData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${serverKeyMidtrans}`
            }
        });

        const dataPayment = await prisma.payment.create({
            data: {
                checkoutId: data.id,
                transactionId: transactionData.transaction_details.order_id,
                paymentUrl: response.data.redirect_url
            }
        })

        const cartItems = await prisma.cartItem.findMany({
            where: {
                checkoutId: data.id
            },
            include: {
                jasaKirim: true
            }
        });

        for (const cartItem of cartItems) {
            if (cartItem.jasaKirimId) {
                await prisma.jasaKirim.delete({
                    where: { id: cartItem.jasaKirimId }
                });
            }
        }

        await prisma.cartItem.deleteMany({
            where: {
                checkoutId: data.id
            }
        });


        res.status(201).json({
            response: response.data,
            dataPayment,
            message: 'Success getting payment from Midtrans'
        });
    } catch (error) {
        console.error('Error creating transaction:', error.response?.data || error.message);
        res.status(501).json({
            message: 'Error creating transaction'
        });
    }

}

exports.postPesan = async (req, res) => {
    const { data } = req.body;

    try {
        await prisma.checkout.update({
            where: {
                id: data.id
            },
            data: {
                pesan: data.pesan
            }
        })

        res.status(200).json({
            message: 'success post pesan'
        })
    } catch (error) {
        console.error('failed post pesan', error);
        res.status(500).json({
            message: 'failed post pesan'
        })
    }
}





