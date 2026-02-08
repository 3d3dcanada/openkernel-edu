import { Router } from 'express';
import lessonsRouter from './lessons';
import progressRouter from './progress';
import examplesRouter from './examples';
import executeRouter from './execute';
import authRouter from '../auth/routes';

const router = Router();

router.use('/auth', authRouter);

router.use('/lessons', lessonsRouter);
router.use('/progress', progressRouter);
router.use('/examples', examplesRouter);
router.use('/execute', executeRouter);

export default router;
