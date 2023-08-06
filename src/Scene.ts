import { Clothing, DefaultNPC } from "./types";
import Phaser from "phaser";

export default class ExternalScene extends window.BaseScene {
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

    // TODO - deployed URLS
    this.load.image(
      "white_unicorn",
      "https://localhost:3003/white_unicorn.png"
    );
  }

  create() {
    super.create();

    const whiteUnicorn = this.add.sprite(106, 352, "white_unicorn");
    whiteUnicorn.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      console.log("Open Unicorn");
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
