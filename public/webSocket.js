const WebSocket = require('ws');
const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({
    port
});

wss.on('connection', (ws) => {
    console.log('User connected');

    ws.on('message', (message) => {
        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
