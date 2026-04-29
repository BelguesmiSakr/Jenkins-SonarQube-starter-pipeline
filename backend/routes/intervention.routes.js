import express from 'express';
import { Intervention, Technicien, Incident } from '../models.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        res.json(await Intervention.create(req.body));
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const data = await Intervention.findAll({ include: [Technicien, Incident] });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const data = await Intervention.findByPk(req.params.id, { include: [Technicien, Incident] });
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await Intervention.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Intervention updated' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Intervention.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Intervention deleted' });
    } catch (err) {
        next(err);
    }
});

export default router;
