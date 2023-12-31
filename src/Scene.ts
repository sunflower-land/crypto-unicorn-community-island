import { Clothing } from "./types";
import Phaser from "phaser";

export const StardustNPC: Clothing = {
  body: "Beige Farmer Potion",
  hat: "Unicorn Horn",
  hair: "Sun Spots",
  shirt: "Blue Farmer Shirt",
  pants: "Farmer Pants",
  tool: "Farmer Pitchfork",
};

export const GoblinNPC: Clothing = {
  body: "Goblin Potion",
  hat: "Unicorn Hat",
  hair: "Sun Spots",
  shirt: "Red Farmer Shirt",
  pants: "Farmer Pants",
  tool: "Pirate Scimitar",
};

// Random names
type UnicornName =
  | "starlight"
  | "sparklehoof"
  | "blossom"
  | "thunderdash"
  | "moonbeam";

type Progress = {
  unicornsFedAt: Partial<Record<UnicornName, number>>;

  hornMintedAt?: number;
};

type Unicorn = {
  name: UnicornName;
  image: string;
  coordinates: { x: number; y: number };
  requirements: {
    items: Record<string, number>;
    label: string;
  };
  // Unicorn players get head start
  promoRequirements: {
    items: Record<string, number>;
    label: string;
  };
  introduction: string;
  conclusion: string;
};
const UNICORNS: Unicorn[] = [
  {
    name: "starlight",
    image:
      "https://sunflower-land.github.io/crypto-unicorn-community-island/starlight.png",
    coordinates: { x: 405, y: 453 },
    introduction: "Welcome stranger to our beautiful island.",
    conclusion: "Thank you for satisfying my hungry children!",

    // UNUSED
    requirements: {
      items: {},
      label: "",
    },
    promoRequirements: {
      items: {},
      label: "",
    },
  },
  {
    name: "sparklehoof",
    image:
      "https://sunflower-land.github.io/crypto-unicorn-community-island/sparklehoof.png",
    coordinates: { x: 541, y: 293 },
    requirements: {
      items: { Potato: 200 },
      label: "200 Potatoes",
    },
    promoRequirements: {
      items: { Potato: 20 },
      label: "20 Potatoes",
    },
    introduction:
      "Hey there! The name's Sparklehoof. To satisfy my hunger, I crave potatoes!",
    conclusion:
      "Ha-ha! You've cracked me up with your potatoes! Keep laughing and spreading joy!",
  },
  {
    name: "thunderdash",
    image:
      "https://sunflower-land.github.io/crypto-unicorn-community-island/thunderdash.png",
    coordinates: { x: 399, y: 110 },
    requirements: { items: { Carrot: 300 }, label: "300 Carrots" },
    promoRequirements: { items: { Carrot: 30 }, label: "30 Carrots" },
    introduction:
      "Yo! Thunderdash here! I love racing through the fields, feeling the wind on my mane. A lightning-quick sugar carrot would be the ultimate fuel to keep my energy high!",
    conclusion:
      "Whoosh! The sugar carrot has electrified my energy! With thundering gratitude, I thank you for your swift gift. Let's embark on more adventures together!",
  },
  {
    name: "blossom",
    image:
      "https://sunflower-land.github.io/crypto-unicorn-community-island/blossom.png",
    coordinates: { x: 156, y: 142 },
    requirements: { items: { Cauliflower: 100 }, label: "100 Cauliflowers" },
    promoRequirements: { items: { Cauliflower: 10 }, label: "10 Cauliflowers" },
    introduction:
      "Greetings! I'm Blossom. I spend most of my time tending to the flowers and plants of Sunflower Land. A collection of cauliflowers would satisfy me!",
    conclusion:
      "A garden of thanks to you, kind soul! Your gift of cauliflowers nourishes both body and spirit. May the flowers bloom in your path!",
  },
  {
    name: "moonbeam",
    image:
      "https://sunflower-land.github.io/crypto-unicorn-community-island/moonbeam.png",
    coordinates: { x: 135, y: 294 },
    requirements: { items: { Sunflower: 1000 }, label: "1000 Sunflowers" },
    promoRequirements: { items: { Sunflower: 100 }, label: "100 Sunflowers" },
    introduction:
      "Hello, kind stranger. I'm Moonbeam. I find solace in the moon's glow and seek knowledge from ancient tomes. However, I also need some sun in my life to survive. To satisfy my hunger, I desire Sunflowers.",
    conclusion:
      "Greetings, wise one! Your gift of radiant Sunflowers has filled me with celestial wisdom. May the moonlight guide you on your journey to enlightenment!",
  },
];

const api = new (window as any).CommunityAPI({
  id: "unicorn_island",
  apiKey: "79005d5f-8019-4d6a-bc57-6b3f0763ab73", // Non sensitive data (client side key)
});

export default class ExternalScene extends window.BaseScene {
  private progress: Progress = {
    unicornsFedAt: {},
  };

  constructor() {
    super({
      name: "unicorn_island",
      map: {
        padding: [1, 2],
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
          // Starlight mother custom dialogue
          if (unicorn.name === "starlight") {
            const fed = this.progress.unicornsFedAt ?? {};
            const allFed =
              !!fed.blossom &&
              fed.moonbeam &&
              fed.sparklehoof &&
              fed.thunderdash;

            if (allFed) {
              if (!this.progress.hornMintedAt) {
                return window.openModal({
                  type: "speaking",
                  messages: [
                    {
                      text: "I knew I could count on you!",
                    },
                    {
                      text: "As promised, here is a Unicorn Horn.",

                      actions: [
                        {
                          text: "Claim",
                          cb: this.mint,
                        },
                      ],
                    },
                  ],
                });
              } else {
                return window.openModal({
                  type: "speaking",
                  messages: [
                    {
                      text: "You can now equip your horn and become beautiful like me!",
                    },
                    {
                      text: "Return anytime - A unicorn's hunger is not satisfied for long.",
                    },
                  ],
                });
              }
            } else {
              return window.openModal({
                type: "speaking",
                messages: [
                  {
                    text: "Welcome to our beautiful island!",
                  },
                  {
                    text: "How strange...you don't have a horn? You must be a Bumpkin!",
                  },
                  {
                    text: "That's perfect - that must mean you have plenty of crops!",
                  },
                  {
                    text: "My children are starving and can use your help. If you can feed all 4 of my children I will reward you with your very own Unicorn Horn.",
                  },
                  {
                    text: "You can find them scattered around this island. Good luck!",
                  },
                ],
              });
            }
          }

          if (!!this.progress.unicornsFedAt[unicorn.name]) {
            window.openModal({
              type: "speaking",
              messages: [{ text: unicorn.conclusion }],
            });

            return;
          }

          const user = api.user;
          console.log({ user });

          // TEMP
          let requirements = unicorn.promoRequirements;
          // if (api.user?.promoCode === "UNICORN") {
          //   requirements = unicorn.promoRequirements;
          // }

          const inventory = api.game.inventory;
          const hasIngredients = Object.keys(requirements.items).every(
            (name) => {
              return (
                !!inventory[name] &&
                inventory[name].gte(requirements.items[name])
              );
            }
          );

          let introduction = unicorn.introduction;

          if (hasIngredients) {
            window.openModal({
              type: "speaking",
              messages: [
                {
                  text: introduction,
                },
                {
                  text: "It looks like you have what I need!",
                  actions: [
                    {
                      text: `Feed (${unicorn.requirements.label})`,
                      cb: () => {
                        this.feed(unicorn.name);
                      },
                    },
                  ],
                },
              ],
            });
          } else {
            window.openModal({
              type: "speaking",
              messages: [
                {
                  text: introduction,
                },
                {
                  text: `Oh no, you don't have what I need. (${unicorn.requirements.label})`,
                },
              ],
            });
          }
        });
    });

    this.initialiseNPCs([
      {
        x: 314,
        y: 256,
        clothing: GoblinNPC,
        onClick: () => {
          window.openModal({
            npc: {
              name: "Nelly",
              clothing: GoblinNPC,
            },
            type: "speaking",
            messages: [
              {
                text: "Neighhhhhhhh! What a magical place! ",
              },
            ],
          });
        },
      },
      {
        x: 301,
        y: 464,
        npc: "Stardust",
        clothing: StardustNPC,
        onClick: () => {
          window.openModal({
            npc: {
              name: "Stardust",
              clothing: StardustNPC,
            },
            type: "speaking",
            messages: [
              {
                text: "Neighhhhhhhh, welcome to Unicorn Island!",
              },
              {
                text: "Sunflower Land has partnered with Crypto Unicorns to bring you this cross-over event.",
              },
              {
                text: "For a limited time I'm giving Crypto Unicorn lootboxes to Unicorns.",
              },
              ...(this.progress.hornMintedAt
                ? [
                    {
                      text: "Wow, that is a beautiful horn you have. You must be a unicorn!!!",
                      cb: () =>
                        window.open(
                          "https://docs.sunflower-land.com/player-guides/special-events/crypto-unicorns-quest",
                          "_blank"
                        ),
                    },
                    {
                      text: "You might be eligible for the Lootbox giveaway!",
                      actions: [
                        {
                          text: "View Giveaway Conditions",
                          cb: () =>
                            window.open(
                              "https://docs.sunflower-land.com/player-guides/special-events/crypto-unicorns-quest",
                              "_blank"
                            ),
                        },
                      ],
                    },
                  ]
                : [
                    {
                      text: "Huh, that's strange. You don't look like a Unicorn.",
                      actions: [
                        {
                          text: "View Giveaway Conditions",
                          cb: () =>
                            window.open(
                              "https://docs.sunflower-land.com/player-guides/special-events/crypto-unicorns-quest",
                              "_blank"
                            ),
                        },
                      ],
                    },
                  ]),
            ],
          });
        },
      },
    ]);

    this.initialise();

    // For local testing, allow Scene refresh with spacebar
    // this.events.on("shutdown", () => {
    //   this.cache.tilemap.remove("unicorn_island");
    //   this.scene.remove("unicorn_island");
    // });
    // const spaceBar = this.input.keyboard.addKey("SPACE");
    // spaceBar.on("down", () => {
    //   this.scene.start("default");
    // });
    // const reset = this.input.keyboard.addKey("r");
    // reset.on("down", async () => {
    //   await api.reset();
    //   this.scene.start("default");
    // });
  }

  async initialise() {
    window.openModal({
      type: "loading",
    });

    const island = await api.loadIsland();

    if (island?.metadata) {
      this.progress = JSON.parse(island.metadata);
    } else {
      this.progress = { unicornsFedAt: {} };
    }

    window.closeModal();
  }

  feed = async (name: UnicornName) => {
    window.openModal({
      type: "loading",
    });

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

    const requirements = UNICORNS.find((u) => u.name === name)?.requirements
      .items;
    await api.burn({
      metadata: JSON.stringify(progress),
      items: requirements,
    });

    this.progress = progress;

    window.closeModal();

    window.openModal({
      type: "speaking",
      messages: [
        {
          text: "Thank you!",
        },
      ],
    });
  };

  mint = async () => {
    window.openModal({
      type: "loading",
    });

    if (!!this.progress?.hornMintedAt) {
      throw new Error(`Horn already minted`);
    }

    const progress: Progress = {
      ...this.progress,
      hornMintedAt: Date.now(),
    };

    await api.mint({
      metadata: JSON.stringify(progress),
      wearables: {
        "Unicorn Horn": 1,
      },
    });

    this.progress = progress;

    window.closeModal();

    window.openModal({
      type: "speaking",
      messages: [
        {
          text: "You can now equip your horn and become beautiful like me!",
        },
        {
          text: "Return anytime - A unicorn's hunger is not satisfied for long.",
        },
      ],
    });
  };

  update() {
    super.update();
  }
}

window.ExternalScene = ExternalScene;
