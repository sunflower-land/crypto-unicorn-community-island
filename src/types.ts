import ExternalScene from "./Scene";

export interface Clothing {
  body: string;
  hat?: string;
  hair: string;
  shirt: string;
  pants: string;
  tool?: string;
}

declare global {
  interface Window {
    BaseScene: any;
    openModal: any;
    closeModal: any;
    ExternalScene: typeof ExternalScene;
  }
}
