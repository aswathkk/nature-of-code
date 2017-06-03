const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('babel-loader')

const config = {
	entry: './src/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: 'babel-loader'
		}]
	},
	plugins: [new HtmlWebpackPlugin()],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 9000,
		open: true
	}
}

module.exports = config;
