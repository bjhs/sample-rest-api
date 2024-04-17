import express from 'express';

import { login } from '../controllers/authentication';

export default (router: express.Router) => {
    router.post('/auth/login', login);
}