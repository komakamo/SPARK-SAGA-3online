import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BattleScene } from '../src/scenes/BattleScene';
import { SceneManager } from '../src/managers/SceneManager';
import { InputManager } from '../src/input/InputManager';
import { UIManager } from '../src/ui/UIManager';
import { gameData } from '../src/data-loader';

// Mock DOM elements required by BattleScene
document.body.innerHTML = `
  <div id="battle-scene" hidden></div>
  <div id="battle-log-container"></div>
`;

describe('BattleScene', () => {
  let scene: BattleScene;
  let sceneManager: SceneManager;
  let inputManager: InputManager;
  let uiManager: UIManager;

  beforeEach(() => {
    inputManager = new InputManager();
    sceneManager = { changeScene: vi.fn() } as any;
    uiManager = {
      updateHelpDisplay: vi.fn(),
      updatePartyStatus: vi.fn(),
    } as any;

    scene = new BattleScene(sceneManager, inputManager, uiManager);
  });

  it('should be defined', () => {
    expect(scene).toBeDefined();
  });

  it('should show the battle scene element on enter', () => {
    scene.enter();
    const element = document.getElementById('battle-scene');
    expect(element?.hidden).toBe(false);
  });

  it('should initialize combatants', () => {
      // Access private properties via casting to any (for testing purposes)
      const s = scene as any;
      expect(s.player).toBeDefined();
      expect(s.enemy).toBeDefined();
  });
});
