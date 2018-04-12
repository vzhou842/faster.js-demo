const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.use(express.static('dist'));
app.use(express.static('static'));

app.get('/', (req, res) => {
	res.render('compare');
});

app.get('/original', (req, res) => {
	res.render('index', { optimized: false });
});

app.get('/optimized', (req, res) => {
	res.render('index', { optimized: true });
});

app.use((req, res, next) => {
	res.status(404).render('404');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
