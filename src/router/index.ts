import express from 'express';
import authentication from './authentication';
import login from './login';
const router = express.Router();

export default (): express.Router => {
    authentication(router);
    login(router);
    return router;
}