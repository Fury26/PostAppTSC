import {authServer} from './config';
import {tokens} from "./models/Tokens";


export const checkToken = async (jwt: tokens): Promise<tokens | null> => {
    try {
        let check = await fetch(`${authServer}/check`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: jwt.accessToken}),
        });
        check = await check.json();

        if(check) return jwt;

        check = await fetch(`${authServer}/token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: jwt.refreshToken}),
        });

        if(check.status === 200) {
            const newToken = await check.json();
            return {
                accessToken: newToken.accessToken,
                refreshToken: jwt.refreshToken,
            };
        } else return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}