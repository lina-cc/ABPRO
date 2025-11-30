const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/assets/women-planning-about-investment.json');

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lottieData = JSON.parse(rawData);

    let modified = false;

    // Function to filter layers
    const filterLayers = (layers) => {
        if (!layers) return layers;
        const initialLength = layers.length;
        const newLayers = layers.filter(layer => {
            const name = layer.nm ? layer.nm.toLowerCase() : '';
            // Remove layers named 'bg', 'background', or similar
            return !(name === 'bg' || name === 'background' || name === 'solid white' || name === 'bg solid');
        });
        if (newLayers.length !== initialLength) modified = true;
        return newLayers;
    };

    // Filter root layers
    if (lottieData.layers) {
        lottieData.layers = filterLayers(lottieData.layers);
    }

    // Filter layers in assets (pre-comps)
    if (lottieData.assets) {
        lottieData.assets.forEach(asset => {
            if (asset.layers) {
                asset.layers = filterLayers(asset.layers);
            }
        });
    }

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(lottieData)); // Minified
        console.log('Successfully removed background layer(s).');
    } else {
        console.log('No background layer found to remove.');
    }

} catch (error) {
    console.error('Error processing Lottie file:', error);
    process.exit(1);
}
