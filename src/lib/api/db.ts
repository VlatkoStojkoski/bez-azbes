import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
	const prismaClient = new PrismaClient({
		log: ['query', 'info', 'warn', 'error'],
	});

	return prismaClient;
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;