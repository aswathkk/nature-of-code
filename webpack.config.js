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
			use: {
				loader: 'babel-loader',
				options: {
					"presets": [
						["es2015"]
					]
				}
			}
		}, {
			test: /\.scss$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader'
			}, {
				loader: 'sass-loader'
			}]
		}]
	},
	plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 9000,
		open: true
	}
}

module.exports = config;
