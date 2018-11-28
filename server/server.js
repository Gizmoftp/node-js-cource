const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000
let publicPath = path.join(__dirname, '../public');


app.use(express.static(publicPath));

app.listen(port, () => { console.log(`Start listening port ${port}`);});
