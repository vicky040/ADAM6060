// const express = require('express');
// const Modbus = require('modbus-serial');
// const bodyParser = require('body-parser'); 
// const dotenv = require('dotenv')
// const app = express();


// dotenv.config({path:'./config/.env'})
// app.use(bodyParser.json()); 

// const client = new Modbus();

// async function connectModbusServer(serverIP, serverPort) {
//   return new Promise((resolve, reject) => {
//     client.connectTCP(serverIP, { port: serverPort }, (err) => {
//       if (err) {
//         console.error('Error connecting to Modbus TCP server:', err);
//         reject(err);
//       } else {
//         console.log('Connected to Modbus TCP server');
//         resolve();
//       }
//     });
//   });
// }

// async function readCoil(coil, unitId) {
//   try {
//     const data = await client.readCoils(coil, unitId);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }

// app.post('/read-coil', async (req, res) => {
//   const { serverIP, serverPort, unitId, coil } = req.body;

//   try {
//     await connectModbusServer(serverIP, serverPort);
//     const coilData = await readCoil(coil, unitId);
//     res.json({ connected: true, result: coilData });
//   } catch (err) {
//     res.status(500).json({ connected: false, error: err.message });
//   }
// });

// const port = process.env.PORT ||3000;
// app.listen(port, () => {
//   console.log(`API server is running on port ${port}`);
// });


const express = require('express');
const Modbus = require('modbus-serial');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './config/.env' });
app.use(bodyParser.json());

const client = new Modbus();

async function connectModbusServer(serverIP, serverPort) {
  return new Promise((resolve, reject) => {
    client.connectTCP(serverIP, { port: serverPort }, (err) => {
      if (err) {
        console.error('Error connecting to Modbus TCP server:', err);
        reject(err);
      } else {
        console.log('Connected to Modbus TCP server');
        resolve();
      }
    });
  });
}

async function readCoil(coil, unitId) {
  try {
    const data = await client.readCoils(coil, unitId);
    return data;
  } catch (err) {
    throw err;
  }
}

async function writeCoil(coil, unitId, value) {
  try {
    await client.writeCoil(coil, value, unitId);
    return 'Coil written successfully';
  } catch (err) {
    throw err;
  }
}

app.post('/read-coil', async (req, res) => {
  const { serverIP, serverPort, unitId, coil } = req.body;

  try {
    await connectModbusServer(serverIP, serverPort);
    const coilData = await readCoil(coil, unitId);
    res.json({ connected: true, result: coilData });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  } finally {
    client.close(() => {
      console.log('Modbus connection closed.');
    });
  }
});

app.post('/write-coil', async (req, res) => {
  const { serverIP, serverPort, unitId, coil, value } = req.body;

  try {
    await connectModbusServer(serverIP, serverPort);
    const writeResult = await writeCoil(coil, unitId, value);
    res.json({ connected: true, result: writeResult });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  } finally {
    client.close(() => {
      console.log('Modbus connection closed.');
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});


