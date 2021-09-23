import express from 'express';
import bodyParser from 'body-parser';
import {readFile} from 'fs/promises';
import {getRandomInt} from './utils/utils.js';

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
    const ep = cfg.endpoint || 'postback';
    const minTimeout = cfg.minTimeout - 0;
    const maxTimeout = cfg.maxTimeout - 0;

    const rand = getRandomInt(minTimeout, maxTimeout);

    app.post(ep, (req, res) => {
        const body = req.body;

        console.log(`Postback received at ${new Date()}`);
        console.log(`    URL = ${body.data.content.url}`)
        console.log(`    UUID = ${body.uuid}`)

        // Emulate a slow network
        //setTimeout(() => res.status(200).send("Postback acknowledged"), rand());
        setTimeout(() => res.status(201).send("Postback acknowledged"), 2000);
    })

    // Default route
    app.all("*", (req, res) => {
        console.log("Rejecting invalid route")
        res.status(404).send("PAGE NOT FOUND");
    });

    app.listen(port, () => {
        console.log(`Postback receiver listening at http://localhost:${port}${ep}`)
    });
};

main(config);
