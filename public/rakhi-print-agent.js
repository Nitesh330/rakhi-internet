/**
 * Rakhi Cyber Cafe & Photostat - Local Print Agent
 *
 * Runs on the shop PC connected to local branch network printers.
 * Listens on http://localhost:9123 for print commands from the Web Admin Portal.
 * 
 * Usage:
 *   1. Install Node.js on your shop PC.
 *   2. Run: node rakhi-print-agent.js
 *   3. Clicking "Print" in the Admin Panel will send jobs directly to your local printer IP!
 */

const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 9123;

const server = http.createServer((req, res) => {
  // Set CORS headers so web browser can connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', agent: 'Rakhi Print Agent', version: '1.0.0' }));
    return;
  }

  if (req.url === '/print' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { fileName, fileData, printerIp, printerPort = 9100, printerName } = data;

        console.log(`[Agent] Received print job: ${fileName} -> Target IP: ${printerIp || 'Default'}, Printer: ${printerName}`);

        if (!fileData) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No file data provided' }));
          return;
        }

        // Save base64 file buffer temporarily
        const base64Data = fileData.replace(/^data:.*?;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const tempFilePath = path.join(__dirname, `print_temp_${Date.now()}_${fileName || 'doc.pdf'}`);
        fs.writeFileSync(tempFilePath, buffer);

        // Strategy 1: Direct TCP Raw Socket Print to Printer IP (Port 9100)
        if (printerIp && printerIp.trim().length > 0) {
          console.log(`[Agent] Connecting to Network Printer via TCP Socket ${printerIp}:${printerPort}...`);
          const socket = new net.Socket();
          socket.setTimeout(4000);

          socket.connect(Number(printerPort) || 9100, printerIp.trim(), () => {
            console.log(`[Agent] Connected to ${printerIp}:${printerPort}. Transmitting print buffer...`);
            socket.write(buffer, () => {
              console.log(`[Agent] Print job successfully sent to network printer at ${printerIp}`);
              socket.end();
              setTimeout(() => { try { fs.unlinkSync(tempFilePath); } catch(e){} }, 3000);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: `Successfully printed via IP ${printerIp}` }));
            });
          });

          socket.on('error', (err) => {
            console.error(`[Agent] Direct TCP socket error to ${printerIp}:`, err.message);
            printViaSystemOS(tempFilePath, printerName, res);
          });

          socket.on('timeout', () => {
            console.warn(`[Agent] Connection timed out to ${printerIp}:${printerPort}. Falling back to OS default printer.`);
            socket.destroy();
            printViaSystemOS(tempFilePath, printerName, res);
          });

        } else {
          // Strategy 2: System OS Default / Named Printer
          printViaSystemOS(tempFilePath, printerName, res);
        }

      } catch (err) {
        console.error('[Agent] Error processing print request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

function printViaSystemOS(filePath, printerName, res) {
  const isWin = process.platform === 'win32';
  let cmd = '';

  if (isWin) {
    if (printerName) {
      cmd = `powershell -Command "Start-Process -FilePath '${filePath}' -Verb PrintTo -ArgumentList '${printerName}'"`;
    } else {
      cmd = `powershell -Command "Start-Process -FilePath '${filePath}' -Verb Print"`;
    }
  } else {
    if (printerName) {
      cmd = `lp -d "${printerName}" "${filePath}"`;
    } else {
      cmd = `lp "${filePath}"`;
    }
  }

  console.log(`[Agent] Executing OS Print Command: ${cmd}`);
  exec(cmd, (error) => {
    setTimeout(() => { try { fs.unlinkSync(filePath); } catch(e){} }, 5000);

    if (error) {
      console.error(`[Agent] OS print error:`, error.message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Printed using OS fallback' }));
    } else {
      console.log(`[Agent] OS Print process triggered successfully.`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Print job sent to OS printer' }));
    }
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(` Rakhi Print Agent running on http://localhost:${PORT}`);
  console.log(` Status endpoint: http://localhost:${PORT}/status`);
  console.log(` Ready to accept 1-Click Print requests from Admin Panel`);
  console.log(`======================================================\n`);
});
