import express from 'express';
import { Incident } from '../models.js';

const router = express.Router();

// Fonction utilitaire pour calculer la distance entre deux points (en km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Arrondi à 2 décimales
}

router.post('/', async (req, res) => {
    res.json(await Incident.create(req.body));
});

router.get('/', async (req, res) => {
    res.json(await Incident.findAll());
});

router.get('/:id', async (req, res) => {
    res.json(await Incident.findByPk(req.params.id));
});

router.put('/:id', async (req, res) => {
    await Incident.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Incident updated' });
});

router.delete('/:id', async (req, res) => {
    await Incident.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Incident deleted' });
});

// Route pour trouver les incidents dans un rayon donné
router.get('/nearby/:lat/:lon/:radius', async (req, res) => {
    try {
        const { lat, lon, radius } = req.params;
        const centerLat = parseFloat(lat);
        const centerLon = parseFloat(lon);
        const searchRadius = parseFloat(radius);

        if (isNaN(centerLat) || isNaN(centerLon) || isNaN(searchRadius)) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        const incidents = await Incident.findAll();
        const nearbyIncidents = incidents.filter(incident => {
            const distance = calculateDistance(
                centerLat,
                centerLon,
                incident.latitude,
                incident.longitude
            );
            return distance <= searchRadius;
        }).map(incident => ({
            ...incident.toJSON(),
            distance: calculateDistance(
                centerLat,
                centerLon,
                incident.latitude,
                incident.longitude
            )
        }));

        res.json({
            center: { lat: centerLat, lon: centerLon },
            radius: searchRadius,
            count: nearbyIncidents.length,
            incidents: nearbyIncidents
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;