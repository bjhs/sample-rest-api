import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies["BJHS-AUTH"];
        if (!sessionToken) {
            console.log("IsAuthenticated - Missing session token");
            return res.sendStatus(400);
        }

        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            console.log("IsAuthenticated - User not found");
            return res.sendStatus(401);
        }

        merge(req, {identity: user});
        next();
    } catch (error) {
        console.log("IsAuthenticated middleware");
        console.log(error);
        return res.sendStatus(401);
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            console.log("IsOwner - Missing identity");
            return res.sendStatus(401);
        }

        if (currentUserId.toString() !== id) {
            console.log("IsOwner - Not a owner");
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.log("IsOwner middleware");
        console.log(error);
        return res.sendStatus(401);
    }
}

export const logRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        console.log("Request "+req.path);
        console.log(req.body);
        console.log(req.params);

        next();
    } catch (error) {
        console.log("LogRequest middleware");
        console.log(error);
        return res.sendStatus(400);
    }
}
