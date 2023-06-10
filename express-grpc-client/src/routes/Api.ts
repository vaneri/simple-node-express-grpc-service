import { Router } from 'express';
import Index from '../controller/api/index';
import GreatingsClient from '../controller/api/hello_grpc/GreatingGrpc';

const router = Router();

router.get('/', Index.index);
router.get('/person/greating', GreatingsClient.index)

export default router;