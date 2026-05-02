# Clipboard Master

A local network tool to share clipboard text and files between devices on the same Wi-Fi network. Run it on one machine and access it from any device with a browser — no installation required on the other devices.

## Requirements

- Node.js 18+
- npm
- Angular CLI (`npm install -g @angular/cli`)

## Project Structure

```
clipboard-master/
├── src/                  # Angular frontend
└── server/               # Express backend
```

## Setup

Run **npm install** in the root and then in the **server** folder:

```bash
npm install
cd server
npm install
```

## Running

Run this command within the server folder:

```bash
node index.js
```

Run this command in the root directory:

```bash
ng serve --host 0.0.0.0
```

- The backend runs on port `3000` and is available to all devices on the network.

- The `--host 0.0.0.0` flag makes the frontend accessible to other devices on the network. By default it runs on port `4200`.


## Accessing from Other Devices

Find your machine's local IP address:

- Windows: `ipconfig` and look for IPv4 Address
- Linux/Mac: `ip addr` or `ifconfig`

Then open `http://YOUR_IP:4200` on any device connected to the same network.

## Features

### Clipboard

- **Send from Clipboard**: reads the system clipboard and sends it to the server. Only available when the browser supports the Clipboard API (localhost or HTTPS).
- **Send Text**: type or paste text manually into the text area and send it to the server. Works on all devices including mobile.
- **Copy Clipboard**: retrieves the text stored on the server and writes it to the system clipboard.
- The server text box shows the current text stored on the server and updates automatically when any device sends new content.

### Files

- **Paste File**: opens a file picker, uploads the selected file to the server (stored in memory, not on disk).
- **Copy File**: downloads the file currently stored on the server.
- The file name box shows the name of the current file on the server if one exists.

## Notes

- Clipboard and file data are stored in memory only. Everything is lost when the server is restarted.
- The Clipboard API (`Send from Clipboard`) requires a secure context. It works on `localhost` but not on `http://` from other devices. Use the text area as an alternative on mobile.
- The frontend detects whether the device supports the Clipboard API and hides the button if it does not.
- The page listens for server updates using SSE (Server-Sent Events) so it refreshes automatically without polling.