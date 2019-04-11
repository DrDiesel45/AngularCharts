import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3/dist/d3.min.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [],
})

export class AppComponent implements OnInit {

    ngOnInit() {
    }

    charts = ['Зарплата', 'Рабочие часы', 'График 3', 'График 4', 'График 5'];

    btnToggle(value) {
        // данные для графиков
        let urlSalary = 'http://localhost:4000/results';
        // let urlSalary = 'salary.json';
        let urlWorkingHours = 'http://localhost:4100/results';
        // let urlWorkingHours = 'workingHours.json';

        // нахождение индекса для элемента month
        let bisectDate = d3.bisector(function (d) {
            return d.month;
        }).left;

        // получение в переменную места отображения содержимого
        let chartDiv = document.getElementById("chart");
        let chartDiv2 = document.getElementById("chart2");

        // отображение графиков
        let margin = {top: 20, right: 10, bottom: 20, left: 50};

        // присвоение ширины и высоты отображающейся области, в зависимости от размеров окна пользователя
        let width = chartDiv.clientWidth - margin.right;
        let height = chartDiv.clientHeight - margin.bottom - margin.top;

        // присвоение ширины оси х
        let x = d3.scaleTime()
            .range([0, width - margin.left]);

        // присвоение высоты оси у
        let y = d3.scaleLinear()
            .rangeRound([height, 0]);

        // расположение и формат оси х
        let xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d3.format("~s"));

        // расположение и формат оси у
        let yAxis = d3.axisLeft()
            .scale(y)
            .tickFormat(d3.format("~s"));

        // определение типа данных для осей х и у
        let line = d3.line()
            .x(function (d) {
                return x(d.month);
            })
            .y(function (d) {
                return y(d.value);
            });

        function salaryChart() {
            let mySVG1 = d3.select(chartDiv)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            setInterval(function () {
                updateData(chartDiv, urlSalary);
            }, 3000);

            d3.json(urlSalary).then(function (data) {
                data.forEach(function (d) {
                    d.month = +d.month;
                    d.value = +d.value;
                });
                x.domain(d3.extent(data, function (d) {
                    return d.month;
                }));
                y.domain(d3.extent(data, function (d) {
                    return d.value;
                }));

                mySVG1.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                mySVG1.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)");

                mySVG1.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);
            });
        }

        function workHours() {
            let mySVG2 = d3.select(chartDiv2)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            setInterval(function () {
                updateData(chartDiv2, urlWorkingHours);
            }, 3000);

            d3.json(urlWorkingHours).then(function (data) {
                data.forEach(function (d) {
                    d.month = +d.month;
                    d.value = +d.value;
                });
                x.domain(d3.extent(data, function (d) {
                    return d.month;
                }));
                y.domain(d3.extent(data, function (d) {
                    return d.value;
                }));

                mySVG2.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                mySVG2.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)");

                mySVG2.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);
            });
        }

        function updateData(divChart, urlData) {
            d3.json(urlData).then(function (data) {
                data.forEach(function (d) {
                    d.month = +d.month;
                    d.value = +d.value;
                });

                x.domain(d3.extent(data, function (d) {
                    return d.month;
                }));
                y.domain(d3.extent(data, function (d) {
                    return d.value;
                }));

                let mySVG1 = d3.select(divChart).transition();

                mySVG1.select(".line")
                // .duration(750)
                    .attr("d", line(data));
                mySVG1.select(".x.axis")
                // .duration(750)
                    .call(xAxis);
                mySVG1.select(".y.axis")
                // .duration(750)
                    .call(yAxis);

            });
        }

        // перерисовка графиков при изменении размеров окна
        window.addEventListener('resize', function () {
            d3.select("svg").remove();
            d3.select("svg").remove();
            salaryChart();
            workHours();
        });

        switch (value) {
            case 'Зарплата' : {
                // d3.select("svg").remove();
                // d3.select("svg").remove();
                salaryChart();
                // this.tiles.push({text: 'salary chart', cols: 4, rows: 1, color: 'lightblue'});
                break;
            }
            case 'Рабочие часы' : {
                // d3.select("svg").remove();
                // d3.select("svg").remove();
                workHours();
                // this.tiles.push({text: 'working hours chart', cols: 4, rows: 1, color: 'lightgreen'});
                break;
            }
            case 'График 3' : {
                this.tiles.push({text: 'third chart', cols: 4, rows: 1, color: '#B7A0E8'});
                break;
            }
            case 'График 4' : {
                // this.tiles.push({text: 'forth chart', cols: 4, rows: 1, color: '#FF0000'});
                this.tiles.push({text: 'forth chart', cols: 4, rows: 1, color: 'lightgreen'});
                break;
            }
            case 'График 5' : {
                this.tiles.push({text: 'fifth chart', cols: 4, rows: 1, color: '#147E6E'});
                break;
            }
        }
    }

    oneCol() {
        this.tiles = this.tiles.filter(function (obj) {
            return obj.cols = 4;
        });
    }

    twoCol() {
        this.tiles = this.tiles.filter(function (obj) {
            return obj.cols = 2;
        });
    }

    clearScr() {
        this.tiles = [];
        d3.select("svg").remove();
        d3.select("svg").remove();
    }

    clearSalary() {
        this.tiles = this.tiles.filter(function (obj) {
            return obj.text !== 'salary chart';
        });
    }

    clearWorkHours() {
        this.tiles = this.tiles.filter(function (obj) {
            return obj.text !== 'working hours chart';
        });
    }

    activate: string;

    tiles = [
        // {text: 'One', cols: 2, rows: 1, color: '#147E6E'},
        // {text: 'Two', cols: 1, rows: 1, color: '#B7A0E8'},
        // {text: 'Three', cols: 1, rows: 2, color: '#FF0000'},
        // {text: 'Four', cols: 3, rows: 1, color: '#D9EDD9'},
    ];

}
