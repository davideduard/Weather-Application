const express = require('express');
const path = require('path');

const app = express();

// Serve the files in the 'public' directory
app.use(express.static(path.join(__dirname, 'files')));

// Start the server
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});