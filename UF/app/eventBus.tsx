import mitt from 'mitt';

type Events = {
  triggerButton: string; // Event name and payload type
};

export const eventBus = mitt<Events>();