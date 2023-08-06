import { Clothing, DefaultNPC } from "./types";
import Phaser from "phaser";

type UnicornName = "dazzle" | "razzle" | "bazzle" | "cazze" | "fazzle";

type Progress = {
  unicornsFedAt: Partial<Record<UnicornName, number>>;

  hornMintedAt?: number;
};

type Unicorn = {
  name: UnicornName;
  image: string;
  coordinates: { x: number; y: number };
  requirements: Record<string, number>;
  introduction: string;
  conclusion: string;
};
const UNICORNS: Unicorn[] = [
  {
    name: "bazzle",
    image: "http://localhost:3003/white_unicorn.png",
    coordinates: { x: 352, y: 500 },
    requirements: { Carrot: 1 },
    introduction: "Yo Yo",
    conclusion: "Conclusion",
  },
];

const api = new (window as any).CommunityAPI({
  id: "unicorn_island",
  apiKey: "?", // Non sensitive data (client side key)
});

export default class ExternalScene extends window.BaseScene {
  private progress: Progress = {
    unicornsFedAt: {},
  };

  constructor() {
    super({
      name: "local",
      map: {
        tilesetUrl:
          "https://sunflower-land.com/testnet-assets/world/map-extruded.png",
      },
      player: {
        spawn: {
          x: 351,
          y: 500,
        },
      },
      /* mmo: {
        enabled: true,
        url: "ws://localhost:2567/",
        roomId: "local", 
      }, */
    });
  }

  preload() {
    super.preload();

    this.load.bitmapFont(
      "Small 5x3",
      "world/small_3x5.png",
      "world/small_3x5.xml"
    );
    this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");
    this.load.bitmapFont(
      "Teeny Tiny Pixls",
      "world/Teeny Tiny Pixls5.png",
      "world/Teeny Tiny Pixls5.xml"
    );

    UNICORNS.forEach((unicorn) => {
      this.load.image(unicorn.name, unicorn.image);
    });
  }

  create() {
    super.create();

    UNICORNS.forEach((unicorn) => {
      const unicornImage = this.add.sprite(
        unicorn.coordinates.x,
        unicorn.coordinates.y,
        unicorn.name
      );

      unicornImage
        .setInteractive({ cursor: "pointer" })
        .on("pointerdown", () => {
          if (!!this.progress.unicornsFedAt[unicorn.name]) {
            window.openModal({
              jsx: unicorn.conclusion,
            });

            return;
          }

          const inventory = api.game.inventory;
          const hasIngredients = Object.keys(unicorn.requirements).every(
            (name) => {
              return (
                !!inventory[name] &&
                inventory[name].gte(unicorn.requirements[name])
              );
            }
          );

          console.log({ inventory });

          let introduction = unicorn.introduction;

          if (hasIngredients) {
            introduction = `${introduction} It looks like you have what I need!`;
          } else {
            introduction = `${introduction} Oh no, you don't have what I need.`;
          }

          window.openModal({
            jsx: introduction,
            buttons: hasIngredients
              ? [
                  {
                    text: "Feed",
                    closeModal: true,
                    // TODO - implement
                    cb: () => {
                      this.feed(unicorn.name);
                    },
                  },
                ]
              : [],
          });
        });
    });

    this.initialiseNPCs([
      {
        x: 150,
        y: 130,
        npc: "Just a NPC",
        clothing: DefaultNPC,
        onClick: () => {
          if (this.CheckPlayerDistance(150, 130)) return;

          window.openModal({
            npc: {
              name: "Just a NPC",
              clothing: DefaultNPC,
            },
            jsx: "Howdy farmer, welcome on Crypto Unicorn's Island!",
          });
        },
      },
    ]);

    // For local testing, allow Scene refresh with spacebar
    this.events.on("shutdown", () => {
      this.cache.tilemap.remove("local");
      this.scene.remove("local");
    });
    const spaceBar = this.input.keyboard.addKey("SPACE");
    spaceBar.on("down", () => {
      this.scene.start("default");
    });
  }

  async initialise() {
    // Show loader??

    const island = api.loadIsland();

    if (island?.metadata) {
      this.progress = JSON.parse(island.metadata);
    }

    // Remove loader??
  }

  async feed(name: UnicornName) {
    if (!!this.progress.unicornsFedAt[name]) {
      throw new Error(`${name} already fed`);
    }

    const progress: Progress = {
      ...this.progress,
      unicornsFedAt: {
        ...(this.progress.unicornsFedAt ?? {}),
        [name]: Date.now(),
      },
    };

    const requirements = UNICORNS.find((u) => u.name === name)?.requirements;
    await api.burn({
      metadata: JSON.stringify(progress),
      items: requirements,
    });

    this.progress = progress;
  }

  update() {
    super.update();
    /* 
          display player position for debugging
      */
    //console.log(this.currentPlayer.x, this.currentPlayer.y);
  }

  CheckPlayerDistance(x: number, y: number) {
    let player_distance = Phaser.Math.Distance.Between(
      this.currentPlayer.x,
      this.currentPlayer.y,
      x,
      y
    );
    return player_distance > 40;
  }
}

window.ExternalScene = ExternalScene;
