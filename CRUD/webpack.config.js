import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    entry: './index.js', // Entry point
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        clean: true,
        chunkFormat: 'module', // Specify chunk format for ESM
    },
    optimization: {
        usedExports: true, //  tree shaking to eliminate dead code
    },
    experiments: {
        outputModule: true, //  output as an ES module
    },
    devtool: 'source-map', // Enable source maps for easier debugging
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', // Set mode based on environment variable
    target: 'node',
    resolve: {
        extensions: ['.js'], // Automatically resolve these extensions
        fallback: {
            path: false, // Disable fallback for Node.js modules if not used
            os: false,
            crypto: false,
            http: false,
            fs: false
        },
    },
};

export default config;
