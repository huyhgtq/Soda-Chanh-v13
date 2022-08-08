const SodaClient = require("./soda");
const config = require("./config.json");
const domain = require("./config.js");

const Soda = new SodaClient(config);

const color = require("./data/colors");
Soda.color = color;

Soda.domain = domain.domain || `https://sodachan.tk/`;

const emoji = require("./data/emoji");
Soda.emoji = emoji;

let client = Soda
const jointocreate = require("./structures/jointocreate");
jointocreate(client);

Soda.react = new Map()
Soda.fetchforguild = new Map()

if(config.dashboard === "true"){
    const Dashboard = require("./dashboard/dashboard");
    Dashboard(client); 
}
        
Soda.start();