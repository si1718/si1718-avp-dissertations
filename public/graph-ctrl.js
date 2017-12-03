angular.module("DissertationsApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {

        function refresh() {
            $http
                .get("/api/v1/dissertations")
                .then(function(response) {
                    var dissertations = response.data;

                    var topTutors = sortDictionary(countRepeated(flatMap(x => x.tutors, dissertations)), 'desc').slice(0, 20);
                    loadTopTutorsChart(topTutors);

                    var dissertationsPerYear = sortDictionary(countRepeated(flatMap(x => x.year, dissertations)), 'desc', true)
                        .filter(x => parseInt(x[1]) >= 1995)
                        .reverse();
                    console.log(dissertationsPerYear)
                    loadDissertationsPerYearChart(dissertationsPerYear.map(x => x[0]));

                });
        }

        function loadTopTutorsChart(data) {
            Highcharts.chart('container-tutors-chart', {
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
                        },
                        formatter: function() {
                            return '<a href="/dissertations">' + this.value + '</a>';
                        },
                        useHTML: true
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Directed dissertations'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Directed dissertations by: <b>{point.y:.1f}</b>'
                },
                series: [{
                    name: 'Dissertations',
                    data: data,
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        }

        function loadDissertationsPerYearChart(data) {
            Highcharts.chart('container-year-chart', {
                title: "",
                yAxis: {
                    title: {
                        text: 'Number of dissertations'
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
                        },
                        pointStart: 1995
                    }
                },
                series: [{
                    name: 'Dissertations',
                    data: data
                }],
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

            });
        }


        refresh();

    }]);
