(function() {
    angular
        .module('DissertationsApp')
        .controller('StatsController', StatsController);

    StatsController.$inject = ["$http", "Notification"];

    function StatsController($http, Notification) {
        var vm = this;

        // TwitterKeywords stats
        $http.get('/api/v1/stats/twitterKeywords')
            .then(function(response) {
                var data = response.data;

                // create a sorted array of all posible date values
                var dates = [];
                var datesSet = new Set(data.map(x => x.date));
                datesSet.forEach(x => {
                    var split = x.split('/');
                    var d = new Date(split[2], split[1] - 1, split[0]);
                    dates.push(d);
                });
                dates = dates.sort(function(d1, d2) { return (d1 > d2) ? 1 : (d1 < d2) ? -1 : 0 }).map(x => x.getDate() + "/" + x.getMonth() + 1 + "/" + x.getFullYear());

                var keywords = [];
                var keywordsSet = new Set(data.map(x => x.keyword));
                keywordsSet.forEach(x => keywords.push(x));

                var series = [];
                keywords.forEach(k => {
                    var s = { "name": k, data: [] }
                    dates.forEach(d => {
                        var total = data.filter(x => (x.keyword == k && x.date == d));
                        if (total.length > 0)
                            s.data.push(total[0].total);
                        else
                            s.data.push(null);
                    });
                    series.push(s);
                })

                loadSimpleLineChart('twitter-stats-chart', dates, series, 'Mentions in Twitter (logarithmic scale)', 'Keywords', true);
            }, function(error) {
                Notification.error({ message: "Couldn't load the dissertations per year graph.", positionY: 'bottom', positionX: 'right' })
            });

        // DissertationsPerYear
        $http.get('/api/v1/stats/dissertationsPerYear')
            .then(function(response) {
                var data = response.data;
                // sorts by year asc
                data.sort(function(a, b) { return (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0); });

                var years = data.map(x => x.year); // categories
                var values = data.map(x => x.count); // data

                loadSimpleLineChart('dissertations-year-chart', years, [{ "name": "Year", data: values }], 'Dissertations per year', 'Dissertations');
            }, function(error) {
                Notification.error({ message: "Couldn't load the dissertations per year graph.", positionY: 'bottom', positionX: 'right' })
            });

        // DissertationsPerTutor
        $http.get('/api/v1/stats/dissertationsPerTutor')
            .then(function(response) {
                var data = response.data;
                var series = [];
                // sorts by year asc
                data.sort(function(a, b) { return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0); });
                var categories = data.map(x => x.tutor);
                var si1718count = data.map(x => x.count);
                series.push({ name: "si1718", data: si1718count });

                loadSimpleBarChart('dissertations-tutors-chart', categories, series, 'Directed dissertations', 'Directed dissertations by: <b>{point.y:.1f}</b>', 'Dissertations')
            }, function(error) {
                Notification.error({ message: "Couldn't load the dissertations per tutor graph.", positionY: 'bottom', positionX: 'right' })
            });

        // MostFrequentKeywords
        $http.get('/api/v1/stats/mostFrequentKeywords')
            .then(function(response) {
                var data = response.data;
                // sorts by year asc
                data.sort(function(a, b) { return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0); });
                var categories = data.map(x => x.keyword);
                var si1718count = data.map(x => x.count);

                loadSimpleBarChart('most-frequent-keywords-chart', categories, [{ name: "Keywords", data: si1718count }], 'Number of dissertations with this keyword', 'Frequence of the keyword: <b>{point.y:.1f}</b>', 'Keywords')
            }, function(error) {
                Notification.error({ message: "Couldn't load the most frequent keywords graph.", positionY: 'bottom', positionX: 'right' })
            });

        // MostFrequentKeywords in elsevier
        $http.get('/api/v1/stats/mostFrequentKeywordsElsevier')
            .then(function(response) {
                var data = response.data;
                // sorts by year asc
                data.sort(function(a, b) { return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0); });
                var categories = data.map(x => x.keyword);
                var elsevier = data.map(x => x.count);

                loadSimpleBarChart('most-frequent-keywords-elsevier-chart', categories, [{ name: "Keywords", data: elsevier }], 'Documents found in Elsevier', 'Frequence of the keyword: <b>{point.y:.1f}</b>', 'Keywords')
            }, function(error) {
                Notification.error({ message: "Couldn't load the most frequent keywords elsevier graph.", positionY: 'bottom', positionX: 'right' })
            });

        // DissertationsPerGroup
        $http.get('/api/v1/stats/dissertationsPerGroup')
            .then(function(response) {
                var data = response.data;
                var series = [];
                // sorts by year asc
                data.sort(function(a, b) { return (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0); });
                var categories = data.map(x => x.group);
                var si1718count = data.map(x => x.count);
                series.push({ name: "si1718", data: si1718count });

                loadSimpleBarChart('dissertations-groups-chart', categories, series, 'Directed dissertations', 'Directed dissertations by: <b>{point.y:.1f}</b>', 'Dissertations')
            }, function(error) {
                Notification.error({ message: "Couldn't load the dissertations per group graph.", positionY: 'bottom', positionX: 'right' })
            });

        // Requests per day stats
        $http.get('/api/v1/stats/requestCount')
            .then(function(response) {
                var data = response.data;
                
                var requestCounts = [];

                data.forEach(x => {
                    var split = x.date.split('/');
                    var d = new Date(split[2], split[1] - 1, split[0]);
                    requestCounts.push({date: d, count: x.count});
                });
                
                requestCounts = requestCounts.sort(function(d1, d2) { return (d1.date > d2.date) ? 1 : (d1.date < d2.date) ? -1 : 0 }).map(x =>{return { date: x.date.getDate() + "/" + x.date.getMonth() + 1 + "/" + x.date.getFullYear(), count: x.count}});
                
                var dates = requestCounts.map(x => x.date);
                var counts = requestCounts.map(x => x.count);
                
                console.log(dates)
                console.log(counts)
                
                loadSimpleLineChart('requests-count-chart', dates, [{name: "Requests", data: counts}], 'Requests per day', 'Requests');
            }, function(error) {
                Notification.error({ message: "Couldn't load the dissertations per year graph.", positionY: 'bottom', positionX: 'right' })
            });

    }

    function loadSimpleLineChart(chartId, years, series, yLeyend, seriesName, logarithmic = false) {
        var config = {
            title: "",
            yAxis: {
                title: {
                    text: yLeyend
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                }
            },
            xAxis: {
                categories: years
            },
            series: series,
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        };

        if (logarithmic)
            config.yAxis.type = 'logarithmic';

        Highcharts.chart(chartId, config);
    }

    function loadSimpleBarChart(chartId, categories, series, yLeyend, pointFormat, seriesName) {
        Highcharts.chart(chartId, {
            title: "",
            chart: {
                type: 'column'
            },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                },
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: yLeyend
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: pointFormat
            },
            series: series
        });
    }

})();
