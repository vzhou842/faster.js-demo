const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.use(express.static('dist'));
app.use(express.static('static'));

app.get('/', (req, res) => {
	const optimized = !!req.query.optimized;
	res.render('index', { optimized });
});

app.get('/compare', (req, res) => {
	res.render('compare');
});

app.use((req, res, next) => {
	res.render('404');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
