const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the out directory under the base path
app.use('/biblioteca-canticorum', express.static(path.join(__dirname, 'out')));

// Redirect root to the base path
app.get('/', (req, res) => {
  res.redirect('/biblioteca-canticorum');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Visit http://localhost:${port}/biblioteca-canticorum to see your site`);
}); 