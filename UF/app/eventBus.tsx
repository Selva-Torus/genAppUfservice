import mitt from 'mitt';

type Events = {
  triggerButton: string; // Event name and payload type
  closeModal: string;
};

export const eventBus = mitt<Events>();