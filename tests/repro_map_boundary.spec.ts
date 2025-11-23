import { describe, it, expect } from 'vitest';
import { Tilemap, TilemapData } from '../src/map/Tilemap';

describe('Tilemap Boundary Bug', () => {
  it('should treat out-of-bounds coordinates as obstacles, preventing wrapping', () => {
    const tileWidth = 16;
    const tileHeight = 16;
    const width = 3;
    const height = 3;

    // Map layout (indices):
    // 0 1 2  (y=0)
    // 3 4 5  (y=1)
    // 6 7 8  (y=2)

    // We set tile at (2, 0) [index 2] to be 0 (walkable).
    // We set tile at (0, 1) [index 3] to be 0 (walkable).
    // But we want (-1, 1) to be OBSTACLE.
    // Current logic: (-1, 1) -> index = 1 * 3 + (-1) = 2.
    // So it checks index 2. If index 2 is walkable, (-1, 1) is walkable.

    const mockData: TilemapData = {
      width,
      height,
      tileWidth,
      tileHeight,
      layers: [
        {
          name: 'collision',
          data: [
            1, 1, 0, // (2,0) is walkable
            0, 1, 1, // (0,1) is walkable
            1, 1, 1
          ]
        }
      ],
      tilesets: [
        {
          firstgid: 1,
          image: 'tileset.png',
          imageheight: 48,
          imagewidth: 48,
          margin: 0,
          spacing: 0,
          tilecount: 9,
          tileheight: 16,
          tilewidth: 16,
          columns: 3
        }
      ]
    };

    const tilemap = new Tilemap(mockData);

    // Verify (2, 0) is walkable (index 2)
    // x = 2*16 = 32, y = 0
    expect(tilemap.isObstacle(32, 0)).toBe(false);

    // Verify (0, 1) is walkable (index 3)
    // x = 0, y = 16
    expect(tilemap.isObstacle(0, 16)).toBe(false);

    // Check (-1, 16). tileX = -1, tileY = 1.
    // Should be OBSTACLE (true) because it's out of bounds.
    // Bug: It maps to index 2, which is 0 (false).
    expect(tilemap.isObstacle(-1, 16)).toBe(true);
  });
});
