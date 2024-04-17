import express from 'express';
import { getAllUsers, deleteUser, updateUser } from '../controllers/users';
import { logRequest, isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', logRequest, isAuthenticated, getAllUsers);
    router.delete('/users/:id', logRequest, isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:id', logRequest, isAuthenticated, isOwner, updateUser);
}