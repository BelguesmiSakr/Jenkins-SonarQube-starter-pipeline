import express from 'express';
import { Incident } from '../models.js';

const router = express.Router();

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100;
}

router.post('/', async (req, res, next) => {
    try {
        res.json(await Incident.create(req.body));
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        res.json(await Incident.findAll());
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        res.json(await Incident.findByPk(req.params.id));
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await Incident.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Incident updated' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Incident.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Incident deleted' });
    } catch (err) {
        next(err);
    }
});

router.get('/nearby/:lat/:lon/:radius', async (req, res, next) => {
    try {
        const { lat, lon, radius } = req.params;
        const centerLat = parseFloat(lat);
        const centerLon = parseFloat(lon);
        const searchRadius = parseFloat(radius);

        if (isNaN(centerLat) || isNaN(centerLon) || isNaN(searchRadius)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        const incidents = await Incident.findAll();
        const nearbyIncidents = incidents
            .filter(incident => calculateDistance(centerLat, centerLon, incident.latitude, incident.longitude) <= searchRadius)
            .map(incident => ({
                ...incident.toJSON(),
                distance: calculateDistance(centerLat, centerLon, incident.latitude, incident.longitude)
            }));

        res.json({ center: { lat: centerLat, lon: centerLon }, radius: searchRadius, count: nearbyIncidents.length, incidents: nearbyIncidents });
    } catch (err) {
        next(err);
    }
});

export default router;
