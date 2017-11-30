var fs = require('fs');
// para sacar una foto y guardarla en ng-test.png
// esto es la cámara
function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}

describe('Delete dissertation', function() {
    it('should delete a dissertation', function() {
        browser.get("http://localhost:8080/#!/"); // instruccion a phantomjs para que cargue esta url en el navegador fantasma
        element(by.model("query")).clear().sendKeys('0000001TEST');
        element(by.buttonText('Search')).click().then(function() {
            element.all(by.repeater('dissertation in dissertations')).then(function(dissertations) {
                dissertations[0].element(by.buttonText("Delete")).click().then(function() {
                    browser.wait(element(by.css('[ng-click="deleteDissertation(dissertation.idDissertation)"]')).isDisplayed, 5000);
                }).then(function() {
                    element(by.css('[ng-click="deleteDissertation(dissertation.idDissertation)"]')).click()
                }).then(function() {
                    element(by.model("query")).clear().sendKeys('0000001TEST');
                    element(by.buttonText('Search')).click().then(function() {
                        element.all(by.repeater('dissertation in dissertations')).then(function(lDissertations){
                           expect(lDissertations.length).toBe(0); 
                        });
                    });
                });


            })

        });

    });
});
