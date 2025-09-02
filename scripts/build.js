const fs = require('fs');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Function to minify JavaScript
async function minifyJS() {
    try {
        const js = fs.readFileSync('scripts/main.js', 'utf8');
        const result = await minify(js, {
            mangle: true,
            compress: true
        });
        
        fs.writeFileSync('scripts/main.min.js', result.code);
        console.log('JavaScript minified successfully!');
    } catch (error) {
        console.error('Error minifying JavaScript:', error);
    }
}

// Function to minify CSS
function minifyCSS() {
    try {
        const css = fs.readFileSync('styles/base.css', 'utf8');
        const result = new CleanCSS().minify(css);
        
        fs.writeFileSync('styles/base.min.css', result.styles);
        console.log('CSS minified successfully!');
    } catch (error) {
        console.error('Error minifying CSS:', error);
    }
}

// Running both minification functions
async function build() {
    console.log('Starting build process...');
    await minifyJS();
    minifyCSS();
    console.log('Build completed!');
}

build();
