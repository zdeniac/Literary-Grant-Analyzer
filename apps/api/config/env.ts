import dotenv from "dotenv";

dotenv.config({
    path: process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env',
});


export const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
};