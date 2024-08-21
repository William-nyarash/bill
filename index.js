const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const consumerKey = process.env.CONSUMER_KEY; // Use environment variables
const consumerSecret = process.env.CONSUMER_SECRET; // Use environment variables

const authString = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

let accessToken = ''; // Variable to store access token

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://sandbox.safaricom.co.ke/oauth/v1/generate', null, {
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    accessToken = response.data.access_token; // Store access token
    console.log('Access token obtained successfully:', accessToken);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      console.error('Error obtaining access token:', error.response.data.error);
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
};

// Call the function to get access token
getAccessToken();

const shortCode = process.env.SHORT_CODE; // Replace with actual short code
const initiator = 'testapi';
const securityCredential = process.env.SECURITY_CREDENTIAL; // Replace with actual security credential
const commandId = 'TransactionStatusQuery';
const transactionId = 'OEI2AK4Q16';
const partyA = '600996';
const identifierType = '4'; // Default value for party A is 4 (MSISDN)
const passKey = process.env.PASS_KEY; // Replace with actual pass key

app.get('/gen', async (req, res) => {
  if (!accessToken) {
    return res.status(500).json({ error: 'Access token not available' });
  }

  const queryParams = new URLSearchParams();
  queryParams.append('AccessToken', accessToken);
  queryParams.append('ShortCode', shortCode);
  queryParams.append('Initiator', initiator);
  queryParams.append('SecurityCredential', securityCredential);
  queryParams.append('CommandID', commandId);
  queryParams.append('TransactionID', transactionId);
  queryParams.append('PartyA', partyA);
  queryParams.append('IdentifierType', identifierType);
  queryParams.append('PassKey', passKey);

  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query?' + queryParams.toString());
    console.log('Transaction status query successful:', response.data);
    res.json(response.data); // Send response back to client
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      console.error('Error querying transaction status:', error.response.data.error);
      res.status(500).json({ error: error.response.data.error });
    } else {
      console.error('Unexpected error:', error.message);
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server is listening on port:', PORT);
});
