const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        namaBarang: "Camera",
        deskripsiBarang: "ini adalah Camera",
        img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=1770&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hargaBarang: 300000,
        quantity: 1,
      },
      {
        id: 2,
        namaBarang: "Handphone",
        deskripsiBarang: "ini adalah Handphone",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1780&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hargaBarang: 500000,
        quantity: 1,
      },
      {
        id: 3,
        namaBarang: "Keyboard",
        deskripsiBarang: "ini adalah Keyboard",
        img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1765&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hargaBarang: 100000,
        quantity: 1,
      },
      {
        id: 4,
        namaBarang: "Laptop",
        deskripsiBarang: "ini adalah Laptop",
        img: "https://images.unsplash.com/photo-1504707748692-419802cf939d?auto=format&fit=crop&q=80&w=2047&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hargaBarang: 1500000,
        quantity: 1,
      },
      {
        id: 5,
        namaBarang: "Monitor",
        deskripsiBarang: "ini adalah Monitor",
        img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1770&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hargaBarang: 700000,
        quantity: 1,
      },
      {
        id: 6,
        namaBarang: "Mouse",
        deskripsiBarang: "ini adalah Mouse",
        img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1767&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        hargaBarang: 80000,
        quantity: 1,
      },
    ]
    },
  )}

main()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})