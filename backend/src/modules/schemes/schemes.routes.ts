import { Router } from 'express';
import { SchemesController } from './schemes.controller';

const router = Router();
const schemesController = new SchemesController();

router.get('/', (req, res) => schemesController.getAllSchemes(req, res));
router.get('/search', (req, res) => schemesController.getAllSchemes(req, res));
router.get('/category/:category', (req, res) => schemesController.getSchemesByCategory(req, res));
router.get('/:id', (req, res) => schemesController.getSchemeById(req, res));

export default router;
