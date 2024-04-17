import express from 'express';

import { register, login } from '../controllers/authentication';
import { logRequest } from '../middlewares';

export default (router: express.Router) => {
    router.post('/auth/register', logRequest, register);
    router.post('/auth/login', logRequest, login);
}