const fs = require('fs');
const path = require('path');
const { isEnvLoaded, missingEnvVars } = require('./loadEnv');
const config = require('../config/config');

function validateDirectories() {
    const directories = [
        config.paths.data,
        config.paths.images,
        config.paths.processed,
        config.paths.logs,
        config.paths.tempImageInput
    ];

    const missingDirs = directories.filter(dir => !fs.existsSync(dir));
    
    if (missingDirs.length > 0) {
        console.log('Creating missing directories...');
        missingDirs.forEach(dir => {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        });
    }
}

function validatePermissions() {
    const directories = [
        config.paths.data,
        config.paths.images,
        config.paths.processed,
        config.paths.logs,
        config.paths.tempImageInput
    ];

    directories.forEach(dir => {
        try {
            const testFile = path.join(dir, '.test-write-access');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
        } catch (error) {
            console.error(`Error: No write permission in ${dir}`);
            process.exit(1);
        }
    });
}

function validateDependencies() {
    try {
        require('axios');
        require('dotenv');
        require('openai');
    } catch (error) {
        console.error('Error: Missing required dependencies. Run npm install first.');
        process.exit(1);
    }
}

function main() {
    console.log('Validating setup...');

    // Check environment variables
    if (!isEnvLoaded) {
        console.warn('Warning: .env file not found');
    }
    if (missingEnvVars.length > 0) {
        console.warn(`Warning: Missing environment variables: ${missingEnvVars.join(', ')}`);
    }

    // Validate directories
    validateDirectories();

    // Check write permissions
    validatePermissions();

    // Check dependencies
    validateDependencies();

    console.log('Setup validation complete!');
}

if (require.main === module) {
    main();
}

module.exports = {
    validateDirectories,
    validatePermissions,
    validateDependencies
};