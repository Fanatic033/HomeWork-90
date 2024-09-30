import express from "express";
import cors from "cors";
import expressWs from "express-ws";
import {WebSocket} from "ws";


const app = express();
expressWs(app);

const port = 8000;

app.use(express.json());
app.use(cors());

const router = express.Router();

let connectedClients: WebSocket[] = []
let pixels: WebSocket[] = [];

router.ws('/canvas', async (ws, req) => {
    connectedClients.push(ws)
    ws.send(JSON.stringify({type: 'INIT', pixels: pixels}));

    ws.on('message', (message) => {
        try {
            const decodedData = JSON.parse(message.toString());

            if (decodedData.type === 'DRAW') {
                pixels.push(...decodedData.pixels);

                connectedClients.forEach((clientWS) => {
                    clientWS.send(JSON.stringify({type: 'DRAW', pixels: decodedData.pixels}));
                })
            }


        } catch (err) {
            console.log(err);
        }
    })

    ws.on('close', (req, res) => {
        console.log('client disconnected');
        connectedClients.splice(connectedClients.indexOf(ws), 1);
    })

})

app.use(router);

app.listen(port, () => {
    console.log(`server started on port: ${port}`);
})



