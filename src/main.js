import express from 'express';
import bodyParser from 'body-parser';
import {readFile} from 'fs/promises';
import {getRandomInt} from './utils/utils.js';

let requestCount = 0
let rand = getRandomInt(2, 10)

const config = JSON.parse(
    await readFile(
        new URL('../config/config.json', import.meta.url)
    )
);

const main = (cfg) => {
    const app = express();
    app.use(express.json())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // Read config values with hard-coded defaults
    const port = cfg.port || 3000;

    app.post("/postback", normalServer)
    app.post("/broken", brokenServer)
    app.post("/lazy", lazyServer)
    app.post("/unresponsive", unresponsiveServer)
    app.post("/rude", rudeServer)

    // Default route
    app.all("*", (req, res) => {
        console.log("Rejecting invalid route")
        res.status(404).send("PAGE NOT FOUND");
    });

    app.listen(port, () => {
        console.log(`Postback receiver listening at http://localhost:${port}/postback`)
    });
};

// A normal server acknowledges the postback with a 201 status
const normalServer = (req, res) => {
    console.log(`Postback endpoint contacted at ${new Date()}`)
    setTimeout(() => res.status(201).send("Postback acknowledged"), 500)
}

// A broken server responds with a 500 error code
const brokenServer = (req, res) => {
    console.log(`Broken endpoint contacted at ${new Date()}`)
    setTimeout(() => res.status(500).send("An internal error occurred"), 500)
}

// A lazy server accepts the first two responses, then decides it can't be bothered anymore
const lazyServer = (req, res) => {
    console.log(`Lazy endpoint contacted at ${new Date()}`)
    requestCount++

    if (requestCount > 2) {
        setTimeout(() => res.status(204).send("I've had enough now"), 500)
    } else {
            setTimeout(() => res.status(201).send("Postback acknowledged"), 500)
    }
}

// An unresponsive server keeps the connection open for 2 minutes, or until the client takes the hint
const unresponsiveServer = (req, res) => {
    console.log(`Postback endpoint contacted at ${new Date()}`)
    setTimeout(() => res.status(201).send("Postback acknowledged"), 120000)
}

// A rude server hangs up without replying
const rudeServer = (req, res) => {
    console.log(`Postback endpoint contacted at ${new Date()}`)
    setTimeout(() => req.socket.destroy(), 500)
}

main(config);
