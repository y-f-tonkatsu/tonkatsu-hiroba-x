import { Point } from './Point';

describe('Point.downRight', () => {
    test('returns vector (1,1)', () => {
        const p = Point.downRight();
        expect(p.x).toBe(1);
        expect(p.y).toBe(1);
    });
});
