import express from 'express';
import { Technicien } from '../models.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const technicien = await Technicien.create(req.body);
        res.json(technicien);
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const techniciens = await Technicien.findAll();
        res.json(techniciens);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const technicien = await Technicien.findByPk(req.params.id);
        res.json(technicien);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await Technicien.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Technicien updated' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Technicien.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Technicien deleted' });
    } catch (err) {
        next(err);
    }
});

export default router;
