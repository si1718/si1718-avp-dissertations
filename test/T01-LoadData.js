var fs = require('fs');
// para sacar una foto y guardarla en ng-test.png
// esto es la cámara
function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}

describe('Data is loaded', function() {
    it('Should show a list of more than two dissertations', function() {
        browser.get("http://localhost:8080"); // instruccion a phantomjs para que cargue esta url en el navegador fantasma
        var contacts = element.all(by.repeater('dissertation in dissertations'));
        
        // esto saca la foto
        browser.takeScreenshot().then(function(png) {
            writeScreenShot(png, 'ng-test.png');
        });

        expect(contacts.count()).toBeGreaterThan(2);
    });
});
