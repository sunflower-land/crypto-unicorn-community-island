"use strict";(()=>{var u={body:"Beige Farmer Potion",hat:"Unicorn Horn",hair:"Sun Spots",shirt:"Blue Farmer Shirt",pants:"Farmer Pants",tool:"Farmer Pitchfork"},m={body:"Goblin Potion",hat:"Unicorn Hat",hair:"Sun Spots",shirt:"Red Farmer Shirt",pants:"Farmer Pants",tool:"Pirate Scimitar"},a=[{name:"starlight",image:"https://sunflower-land.github.io/crypto-unicorn-community-island/starlight.png",coordinates:{x:405,y:453},introduction:"Welcome stranger to our beautiful island.",conclusion:"Thank you for satisfying my hungry children!",requirements:{items:{},label:""},promoRequirements:{items:{},label:""}},{name:"sparklehoof",image:"https://sunflower-land.github.io/crypto-unicorn-community-island/sparklehoof.png",coordinates:{x:541,y:293},requirements:{items:{Potato:200},label:"200 Potatoes"},promoRequirements:{items:{Potato:20},label:"20 Potatoes"},introduction:"Hey there! The name's Sparklehoof. To satisfy my hunger, I crave potatoes!",conclusion:"Ha-ha! You've cracked me up with your potatoes! Keep laughing and spreading joy!"},{name:"thunderdash",image:"https://sunflower-land.github.io/crypto-unicorn-community-island/thunderdash.png",coordinates:{x:399,y:110},requirements:{items:{Carrot:300},label:"300 Carrots"},promoRequirements:{items:{Carrot:30},label:"30 Carrots"},introduction:"Yo! Thunderdash here! I love racing through the fields, feeling the wind on my mane. A lightning-quick sugar carrot would be the ultimate fuel to keep my energy high!",conclusion:"Whoosh! The sugar carrot has electrified my energy! With thundering gratitude, I thank you for your swift gift. Let's embark on more adventures together!"},{name:"blossom",image:"https://sunflower-land.github.io/crypto-unicorn-community-island/blossom.png",coordinates:{x:156,y:142},requirements:{items:{Cauliflower:100},label:"100 Cauliflowers"},promoRequirements:{items:{Cauliflower:10},label:"10 Cauliflowers"},introduction:"Greetings! I'm Blossom. I spend most of my time tending to the flowers and plants of Sunflower Land. A collection of cauliflowers would satisfy me!",conclusion:"A garden of thanks to you, kind soul! Your gift of cauliflowers nourishes both body and spirit. May the flowers bloom in your path!"},{name:"moonbeam",image:"https://sunflower-land.github.io/crypto-unicorn-community-island/moonbeam.png",coordinates:{x:135,y:294},requirements:{items:{Sunflower:1e3},label:"1000 Sunflowers"},promoRequirements:{items:{Sunflower:100},label:"100 Sunflowers"},introduction:"Hello, kind stranger. I'm Moonbeam. I find solace in the moon's glow and seek knowledge from ancient tomes. However, I also need some sun in my life to survive. To satisfy my hunger, I desire Sunflowers.",conclusion:"Greetings, wise one! Your gift of radiant Sunflowers has filled me with celestial wisdom. May the moonlight guide you on your journey to enlightenment!"}],t=new window.CommunityAPI({id:"unicorn_island",apiKey:"79005d5f-8019-4d6a-bc57-6b3f0763ab73"}),s=class extends window.BaseScene{constructor(){super({name:"unicorn_island",map:{padding:[1,2],tilesetUrl:"https://sunflower-land.com/testnet-assets/world/map-extruded.png"},player:{spawn:{x:351,y:500}}});this.progress={unicornsFedAt:{}};this.feed=async e=>{if(window.openModal({type:"loading"}),this.progress.unicornsFedAt[e])throw new Error(`${e} already fed`);let i={...this.progress,unicornsFedAt:{...this.progress.unicornsFedAt??{},[e]:Date.now()}},r=a.find(n=>n.name===e)?.requirements.items;await t.burn({metadata:JSON.stringify(i),items:r}),this.progress=i,window.closeModal(),window.openModal({type:"speaking",messages:[{text:"Thank you!"}]})};this.mint=async()=>{if(window.openModal({type:"loading"}),this.progress?.hornMintedAt)throw new Error("Horn already minted");let e={...this.progress,hornMintedAt:Date.now()};await t.mint({metadata:JSON.stringify(e),wearables:{"Unicorn Horn":1}}),this.progress=e,window.closeModal(),window.openModal({type:"speaking",messages:[{text:"You can now equip your horn and become beautiful like me!"},{text:"Return anytime - A unicorn's hunger is not satisfied for long."}]})}}preload(){super.preload(),a.forEach(e=>{this.load.image(e.name,e.image)})}create(){super.create(),a.forEach(e=>{this.add.sprite(e.coordinates.x,e.coordinates.y,e.name).setInteractive({cursor:"pointer"}).on("pointerdown",()=>{if(e.name==="starlight"){let o=this.progress.unicornsFedAt??{};return!!o.blossom&&o.moonbeam&&o.sparklehoof&&o.thunderdash?this.progress.hornMintedAt?window.openModal({type:"speaking",messages:[{text:"You can now equip your horn and become beautiful like me!"},{text:"Return anytime - A unicorn's hunger is not satisfied for long."}]}):window.openModal({type:"speaking",messages:[{text:"I knew I could count on you!"},{text:"As promised, here is a Unicorn Horn.",actions:[{text:"Claim",cb:this.mint}]}]}):window.openModal({type:"speaking",messages:[{text:"Welcome to our beautiful island!"},{text:"How strange...you don't have a horn? You must be a Bumpkin!"},{text:"That's perfect - that must mean you have plenty of crops!"},{text:"My children are starving and can use your help. If you can feed all 4 of my children I will reward you with your very own Unicorn Horn."},{text:"You can find them scattered around this island. Good luck!"}]})}if(this.progress.unicornsFedAt[e.name]){window.openModal({type:"speaking",messages:[{text:e.conclusion}]});return}let r=t.user;console.log({user:r});let n=e.requirements;t.user?.promoCode==="UNICORN"&&(n=e.promoRequirements);let l=t.game.inventory,c=Object.keys(n.items).every(o=>!!l[o]&&l[o].gte(n.items[o])),d=e.introduction;c?window.openModal({type:"speaking",messages:[{text:d},{text:"It looks like you have what I need!",actions:[{text:`Feed (${e.requirements.label})`,cb:()=>{this.feed(e.name)}}]}]}):window.openModal({type:"speaking",messages:[{text:d},{text:`Oh no, you don't have what I need. (${e.requirements.label})`}]})})}),this.initialiseNPCs([{x:314,y:256,clothing:m,onClick:()=>{window.openModal({npc:{name:"Nelly",clothing:m},type:"speaking",messages:[{text:"Neighhhhhhhh! What a magical place! "}]})}},{x:301,y:464,npc:"Stardust",clothing:u,onClick:()=>{window.openModal({npc:{name:"Stardust",clothing:u},type:"speaking",messages:[{text:"Neighhhhhhhh, welcome to Unicorn Island!"},{text:"Sunflower Land has partnered with Crypto Unicorns to bring you this cross-over event."},{text:"For a limited time I'm giving Crypto Unicorn lootboxes to Unicorns."},...this.progress.hornMintedAt?[{text:"Wow, that is a beautiful horn you have. You must be a unicorn!!!",cb:()=>window.open("https://docs.sunflower-land.com/player-guides/special-events/crypto-unicorns-quest","_blank")},{text:"You might be eligible for the Lootbox giveaway!",actions:[{text:"View Giveaway Conditions",cb:()=>window.open("https://docs.sunflower-land.com/player-guides/special-events/crypto-unicorns-quest","_blank")}]}]:[{text:"Huh, that's strange. You don't look like a Unicorn.",actions:[{text:"View Giveaway Conditions",cb:()=>window.open("https://docs.sunflower-land.com/player-guides/special-events/crypto-unicorns-quest","_blank")}]}]]})}}]),this.initialise()}async initialise(){window.openModal({type:"loading"});let e=await t.loadIsland();e?.metadata?this.progress=JSON.parse(e.metadata):this.progress={unicornsFedAt:{}},window.closeModal()}update(){super.update()}};window.ExternalScene=s;})();
