// spark-saga-repo-starter/tests/conversation.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationManager } from '../src/managers/ConversationManager';
import { gameData } from '../src/data-loader';

describe('ConversationManager', () => {
  let conversationManager: ConversationManager;

  beforeEach(() => {
    conversationManager = new ConversationManager();
  });

  it('should load events', () => {
    expect((conversationManager as any).events.size).toBe(gameData.event.all.length);
  });

  it('should start a conversation', () => {
    const startNode = conversationManager.startConversation('sample_event');
    expect(startNode?.type).toBe('dialog');
  });

  it('should handle choices', () => {
    conversationManager.startConversation('sample_event');
    conversationManager.next(); // progress to choice node
    conversationManager.handleChoice(0);
    const currentNode = conversationManager.currentNode;
    // The node after choice is reward, which then automatically progresses to the next one
    expect(currentNode?.id).toBe('end');
  });

  it('E2E: should update quest state after a choice', () => {
    const gameState = {
      region: 'tutorial',
      er: 1,
      party: ['hero'],
      inventory: { 'potion': 1 },
      quests: new Map<string, string>(),
    };
    conversationManager = new ConversationManager(gameState);

    conversationManager.startConversation('sample_event');
    conversationManager.next(); // progress to choice node
    conversationManager.handleChoice(1); // Choose to start the quest

    expect(gameState.quests.get('sample_quest')).toBe('started');
  });
});
