var flatMap = (f, xs) =>
    xs.map(f).reduce((x, y) => x.concat(y), [])

var countRepeated = function(elements) {
    var counts = {};
    elements.forEach(function(x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
}

var sortDictionary = function(elements, criteria, sortKeys = false) {
    var tuples = Object.keys(elements).map(function(key) {
        if (sortKeys)
            return [elements[key], key];
        else
            return [key, elements[key]];
    });
    tuples.sort(function(first, second) {
        if (criteria == 'desc')
            return second[1] - first[1];
        else
            return first[1] - second[1];
    });
    return tuples;
}

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

var isIdResearcher = function(str) {
    var orcidPattern = new RegExp("^([\\w0-9]{4}-){3}[\\w0-9]{4}$", "i");
    var numIdPattern = new RegExp("^(0|[1-9][0-9]*)$", "i");
    if (orcidPattern.test(str) || numIdPattern.test(str))
        return true;
    else
        return false;
}
