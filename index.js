require('dotenv').config();
const express = require('express');
const path = require('path');

const logger = require('./middleware/logger');

const app = express();

// init middleware
// app.use(logger);

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// routing
const commentsRouter = require('./routes/comments');

app.use('/api/comments', commentsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
