angular.module("DissertationsApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {

        function refresh() {
            $http
                .get("/api/v1/dissertations")
                .then(function(response) {
                    var dissertations = response.data;
                    var tutors = flatMap(x => x.tutors, dissertations).map(x => x.name);
                    var topTutors = sortDictionary(countRepeated(tutors), 'desc').slice(0, 20);
                    loadTopTutorsChart(topTutors);
                    console.log(topTutors);

                    var dissertationsPerYear = sortDictionary(countRepeated(flatMap(x => x.year, dissertations)), 'desc', true)
                        .filter(x => parseInt(x[1]) >= 1995)
                        .reverse();
                    console.log(dissertationsPerYear)
                    loadDissertationsPerYearChart(dissertationsPerYear.map(x => x[0]));

                    $http
                        .get("https://si1718-rgg-groups.herokuapp.com/api/v1/groups")
                        .then(function(response) {
                            var groups = response.data.map(x => { return { group: x.name, leader: normalize(x.leader), components: x.components.map(c => normalize(c)) } });

                            var dissertationsToGroups = tutors.map(x => {
                                var xmin = normalize(x);
                                var filtered = groups.filter(g => g.leader === xmin || g.components.includes(xmin))[0];
                                if (filtered)
                                    return filtered.group;
                                else
                                    return "no-group";
                            }).filter(x => x != "no-group");

                            var topGroups = sortDictionary(countRepeated(dissertationsToGroups), "desc").slice(0, 20);

                            loadTopGroupsChart(topGroups);
                        });
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
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Directed dissertations' //yLeyend
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: 'Directed dissertations by: <b>{point.y:.1f}</b>' //pointFormat
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

        function loadTopGroupsChart(data) {
            Highcharts.chart('container-groups-chart', {
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
                    pointFormat: 'Directed dissertations by: <b>{point.y:.1f}</b> group'
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

        refresh();
    }]);
