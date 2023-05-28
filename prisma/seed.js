const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { hash, genSalt } = require('bcrypt')

async function main() {
    await prisma.user.deleteMany()
    await prisma.user.createMany(
        {data: [
            {
                name: 'Developer',
                gender: 'male',
                birthday: '2000-12-10',
                email: 'dev@example.com',
                birthplace: 'Jakarta',
                address: 'Jakarta',
                username: 'root',
                password: await hash('root', await genSalt())
            }
        ]}
    )
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