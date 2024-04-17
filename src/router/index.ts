import express from 'express';
import authentication from './authentication';
import usersMod from './users'
const router = express.Router();

export default (): express.Router => {
    authentication(router);
    usersMod(router);
    return router;
}