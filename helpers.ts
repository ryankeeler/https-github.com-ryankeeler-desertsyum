// credentialHelper.ts
import fs from 'fs';
import ENV from './env';
import test, { Page } from 'playwright/test';
import {ai} from "@zerostep/playwright"

interface Credentials {
    username: string;
    password: string;
}

export function getRandomCredentials(): Credentials {
    const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8')).loginUserNames;
    const usernames = Object.keys(credentials).filter(key => key.startsWith('username'));
    const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];

    return {
        username: credentials[randomUsername],
        password: credentials.password
    };
}

export function getResourcesPath(): string {
    return ENV.RESOURCES_PATH?.toString() || '';
}

export function randomText(length: number): Promise<string> {
    let random = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        random += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return Promise.resolve(random);
}

export async function loginToProposifyUsingAI(page: Page){
    const aiArgs = {page, test}
    await ai('Enter "fe.testing+1704476354@proposify.com" as Your Email Address', aiArgs)
    await ai('Enter "fe.testing+1704476354@proposify.com" as password', aiArgs)
    await ai('Click Login', aiArgs)
}