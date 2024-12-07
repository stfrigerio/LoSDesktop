const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
	{
		// Renderer process configuration
		mode: 'development', // or 'production' depending on your build
		entry: './src/renderer/index.tsx',
		output: {
			path: path.resolve(__dirname, 'dist/renderer'),
			filename: 'bundle.js',
		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		},
		module: {
			rules: [
				// Handle TypeScript and JavaScript files
				{
					test: /\.(ts|tsx|js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env', 
								'@babel/preset-react', 
								'@babel/preset-typescript'
							],
						},
					},
				},
				// Add this rule for CSS modules
				{
					test: /\.module\.css$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true, // Enable CSS modules
							},
						},
					],
				},
				// Modify the existing rule for global CSS
				{
					test: /\.css$/,
					exclude: /\.module\.css$/, // Exclude .module.css files
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './public/index.html', 
				filename: 'index.html',
			}),
		],
		devServer: {
			static: {
				directory: path.join(__dirname, 'dist/renderer'),
			},
			compress: true,
			port: 3000,
			hot: true,
			historyApiFallback: true,
			devMiddleware: {
				publicPath: '/'
			}
		},
	},
	{
		// Preload script configuration
		mode: 'development', // or 'production' depending on your build
		entry: './src/main/preload.ts',
		target: 'electron-preload',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'preload.ts',
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: ['ts-loader'],
				},
				{
					test: /\.module\.css$/,
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								modules: true,
							},
						},
					],
				},
			],
		},
	},
];
