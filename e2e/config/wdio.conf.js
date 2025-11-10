// ...existing code...
const path = require('path');

exports.config = {
    // Puerto donde corre Appium
    port: 4723,
    
    // Configuración para tu celular/emulador Android
    capabilities: [{
        platformName: 'Android',

        'appium:deviceName': 'emulator-5554',
        'appium:udid': 'emulator-5554',
        'appium:platformVersion': '7.0',
        // usar path.resolve para obtener ruta absoluta sin duplicados
        'appium:app': path.resolve(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk'),
        'appium:automationName': 'UiAutomator2',
        'appium:newCommandTimeout': 240,
        'appium:noReset': true, 
    }],

    // Dónde están tus tests
    specs: [
        '../specs/**/*.spec.js'
    ],

    framework: 'mocha',
    mochaOpts: { timeout: 60000 },

    reporters: ['spec'],
    logLevel: 'info',
};
// ...existing code...

// debug: imprimir la ruta que WDIO va a pasar a Appium
console.log('wdio.conf.js -> app capability:', exports.config.capabilities[0]['appium:app']);