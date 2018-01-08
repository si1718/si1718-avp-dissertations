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

var normalize = function(str) {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};
    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);

    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
            ret.push(mapping[c]);
        else
            ret.push(c);
    }
    return ret.join('');
}

/*
 The following two methods calculate the similarity between two strings
 by using the Levenshtein distance (https://en.wikipedia.org/wiki/Levenshtein_distance)

Source: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
*/
var editDistance = function(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

var similarity = function(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
