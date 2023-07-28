import dotenv from "dotenv"
import { Command } from 'commander';

const program = new Command();

program.option('--persistence <persistence>', 'variable de ambiente', 'MONGO');
program.parse();
const persistence = program.opts().persistence;

dotenv.config()

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    privateKey: process.env.PRIVATE_KEY,
    idGitHub: process.env.ID_GITHUB,
    secretGitHub: process.env.SECRET_GITHUB,
    passDefault: process.env.PASS_DEFAULT,
    entorno: process.env.ENT,
    persistence,
}