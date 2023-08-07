import ExternalScene from "./Scene";

export interface Clothing {
  body: string;
  hat?: string;
  hair: string;
  shirt: string;
  pants: string;
  tool?: string;
}

export const DefaultNPC: Clothing = {
  body: "Goblin Potion",
  hat: "Sleeping Otter",
  hair: "Buzz Cut",
  shirt: "SFL T-Shirt",
  pants: "Farmer Pants",
  tool: "Pirate Scimitar",
};

declare global {
  interface Window {
    BaseScene: any;
    openModal: any;
    closeModal: any;
    ExternalScene: typeof ExternalScene;
  }
}
