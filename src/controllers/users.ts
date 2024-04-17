import express from 'express';
import { getUsers, deleteUserById, updateUserById, getUserById } from '../db/users';
import { random, authentication } from '../helpers';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users).end();
    } catch (error) {
        console.log("User controller - getAllUsers");
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        return res.status(200).json(deletedUser);
    } catch (error) {
        console.log("User controller - deleteUser");
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        console.log("Going to update user")
        console.log(user)

        const { username, password } = req.body;

        if (username) {
            user.username = username;
        }

        if (password) {
            const salt = random();
            const auth = {
                salt,
                password: authentication(salt, password)
            }  
            user.authentication = auth;  
            req.cookies['BJHS-AUTH'] = null;
        }

        const updatedUser = await updateUserById(id, user )

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log("User controller - updateUser");
        console.log(error);
        return res.sendStatus(400);
    }
}