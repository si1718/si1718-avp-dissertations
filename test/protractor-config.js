exports.config = {
    // selenium es un framework de automatizacion de pruebas en el frontend.
    // phantom ha heredado este nombre para esto. PhantomJS da la misma funcionalidad
    // que Selenium
    seleniumAddress: 'http://localhost:9515', //dónde estará el navegador fantasma
    specs: ['T01-LoadData.js', 'T02-AddDissertation.js', 'T03-DeleteDissertation.js'], // casos de prueba
    capabilities: {
        'browserName': 'phantomjs', //tipo de navegador
    }
}