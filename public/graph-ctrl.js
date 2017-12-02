angular.module("DissertationsApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {

        function refresh() {
            $http
                .get("/api/v1/dissertations")
                .then(function(response) {
                    var dissertations = response.data;

                    var topTuples = sortDictionary(countRepeated(flatMap(x => x.tutors, dissertations)), 'desc').slice(0, 5);
                    var data = topTuples.map(x => { return { name: x[0], y: x[1] } });
                    loadChart(data);


                });
        }


        function loadChart(data) {
            Highcharts.chart('container', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Browser market shares January, 2015 to May, 2015'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: data
                }]
            });
        }


        refresh();

    }]);
