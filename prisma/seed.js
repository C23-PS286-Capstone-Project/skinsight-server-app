const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { hash, genSalt } = require('bcrypt')

async function main() {
    await prisma.user.deleteMany()
    await prisma.history.deleteMany()
    let user = await prisma.user.create({
      data: {
        name: 'Developer',
        gender: 'male',
        birthday: '2000-12-10',
        email: 'dev@example.com',
        birthplace: 'Jakarta',
        address: 'Jakarta',
        username: 'root',
        password: await hash('root', await genSalt()),
        
    }
    })
    // await prisma.history.create({
    //   data: {
    //     user_id: user.id,
    //     // image: null,
    //     // prediction_score: 10.5,
    //     // prediction_age: '20-40',
    //     // prediction_result: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis, repudiandae dolorum. Possimus, sunt. Fugiat tenetur, vel quae doloremque molestiae fugit soluta veniam consequuntur ad libero voluptate ipsa ut recusandae eius.',
    //     // date: new Date().toISOString()
    //   }
    // })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })