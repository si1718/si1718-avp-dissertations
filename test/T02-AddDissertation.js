var fs = require('fs');
// para sacar una foto y guardarla en ng-test.png
// esto es la cámara
function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}

describe('Add dissertation', function() {
    it('should add a contact', function() {
        browser.get("http://localhost:8080/#!/dissertations/create"); // instruccion a phantomjs para que cargue esta url en el navegador fantasma
        element(by.id('tutorsInput')).clear().sendKeys("0000001");
        element(by.buttonText('Add tutor')).click().then(function() {
            element(by.model('dissertation.title')).clear().sendKeys('0000001TEST');
            element(by.model('dissertation.author')).clear().sendKeys('0000001AUTHOR');
            element(by.model('dissertation.year')).clear().sendKeys(2017);

            element(by.buttonText('Save')).click().then(function() {
                expect(browser.getCurrentUrl()).toEqual("http://localhost:8080/#!/");
                element(by.model("query")).clear().sendKeys('0000001TEST');
                element(by.buttonText('Search')).click().then(function() {
                    var dissertations = element.all(by.repeater('dissertation in dissertations'));
                    expect(dissertations.count()).toEqual(1);
                });
            });
        });
    });
});
