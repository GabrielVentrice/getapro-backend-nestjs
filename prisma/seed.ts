import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@gmail.com' },
    update: {},
    create: {
      email: 'alice@gmail.com',
      name: 'Alice Ferreira',
    },
  });

  const jonas = await prisma.user.upsert({
    where: { email: 'jonas@gmail.com' },
    update: {},
    create: {
      email: 'jonas@gmail.com',
      name: 'Jonas Bittencourt',
    },
  });

  console.log({ alice, jonas });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
