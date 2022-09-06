const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 5000;
const members = require('./Members')


const logger = require('./middleware/logger');
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


//handlebars middleware
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Homepage route
app.get('/', (req, res) => res.render('index', {
    title: 'Sign Up Form',
    members
    }
));


//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// init middleware
// app.use(logger);

//set static folder
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/members', require('./routes/api/members'))



