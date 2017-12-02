var flatMap = (f, xs) =>
    xs.map(f).reduce((x, y) => x.concat(y), [])

var countRepeated = function(elements) {
    var counts = {};
    elements.forEach(function(x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    return counts;
}

var sortDictionary = function(elements, criteria) {
    var tuples = Object.keys(elements).map(function(key) {
        return [key, elements[key]];
    });
    tuples.sort(function(first, second) {
        if(criteria == 'desc')
            return second[1] - first[1];
        else
            return first[1] - second[1];
    });
    return tuples;
}
