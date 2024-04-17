import express from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Auth controller - Login - Missing required inputs");
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if (!user) {
            console.log("Auth controller - Login - User not found by mail");
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if (expectedHash != user.authentication.password) {
            console.log("Auth controller - Login - Passwords differ");
            return res.sendStatus(401);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("BJHS-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" })

        return res.status(200).json(user).end();
    } catch (error) {
        console.log("Auth controller - login");
        console.log(error);
        res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            console.log("Auth controller - Register - Missing required inputs");
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email);

        if (user) {
            console.log("Auth controller - Register - User already exists");
            return res.sendStatus(400);
        }

        const salt = random();
        const newUser = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        return res.status(200).json(newUser).end();
    } catch (error) {
        console.log("Auth controller - register");
        console.log(error);
        return res.sendStatus(400);
    }
}