const path = require('path');

module.exports = {
	mode: 'production',
	entry: './js/index.js',
	output: {
		filename: 'bundle-optimized.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: [require('faster.js')]
				}
			}
		}]
	}
};
