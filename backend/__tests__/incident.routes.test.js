import { calculateDistance } from '../routes/incident.routes.js';

describe('calculateDistance', () => {
    test('should calculate distance between two identical points as 0', () => {
        const distance = calculateDistance(48.8566, 2.3522, 48.8566, 2.3522);
        expect(distance).toBe(0);
    });

    test('should calculate distance between Paris and London', () => {
        // Paris: 48.8566° N, 2.3522° E
        // London: 51.5074° N, -0.1278° W
        const distance = calculateDistance(48.8566, 2.3522, 51.5074, -0.1278);
        // Expected distance is approximately 344 km
        expect(distance).toBeGreaterThan(340);
        expect(distance).toBeLessThan(350);
    });

    test('should calculate distance between New York and Los Angeles', () => {
        // New York: 40.7128° N, -74.0060° W
        // Los Angeles: 34.0522° N, -118.2437° W
        const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
        // Expected distance is approximately 3939 km
        expect(distance).toBeGreaterThan(3900);
        expect(distance).toBeLessThan(3950);
    });

    test('should handle negative coordinates', () => {
        const distance = calculateDistance(-33.8688, 151.2093, 1.3521, 103.8198);
        // Sydney to Singapore
        expect(distance).toBeGreaterThan(6300);
        expect(distance).toBeLessThan(6350);
    });

    test('should return correct data type', () => {
        const distance = calculateDistance(0, 0, 1, 1);
        expect(typeof distance).toBe('number');
        expect(distance).toBeCloseTo(157.2, 0); // Approximately 157 km, allowing 1 unit difference
    });

    test('should be symmetric', () => {
        const distance1 = calculateDistance(10, 20, 30, 40);
        const distance2 = calculateDistance(30, 40, 10, 20);
        expect(distance1).toBe(distance2);
    });
});