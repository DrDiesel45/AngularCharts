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
        // let urlSalary = 'http://localhost:4000/results';
        // let urlSalary = 'http://10.145.13.178:4000/results';
        let urlSalary = 'salary.json';
        // let urlWorkingHours = 'http://localhost:4100/results';
        // let urlWorkingHours = 'http://10.145.13.178:4100/results';
        let urlWorkingHours = 'workingHours.json';

        // нахождение индекса для элемента month
        let bisectDate = d3.bisector(function (d) {
            return d.month;
        }).left;

        // получение в переменную места отображения содержимого
        let chartDiv = document.getElementById("chart");
        let chartDiv2 = document.getElementById("chart2");

        // отображение графиков

        function redraw() {
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

            // @ts-ignore
            function salaryChart() {
                let mySVG1 = d3.select(chartDiv)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                let inter = setInterval(function () {
                    updateData();
                }, 3000);

                function updateData() {
                    // Get the data again
                    d3.json(urlSalary).then(function (data) {
                        data.forEach(function (d) {
                            d.month = +d.month;
                            d.value = +d.value;
                        });

                        // Scale the range of the data again
                        x.domain(d3.extent(data, function (d) {
                            return d.month;
                        }));
                        y.domain(d3.extent(data, function (d) {
                            return d.value;
                        }));

                        // Select the section we want to apply our changes to
                        let mySVG1 = d3.select(chartDiv).transition();

                        // Make the changes
                        mySVG1.select(".line")   // change the line
                            // .duration(750)
                            .attr("d", line(data));
                        mySVG1.select(".x.axis") // change the x axis
                            // .duration(750)
                            .call(xAxis);
                        mySVG1.select(".y.axis") // change the y axis
                            // .duration(750)
                            .call(yAxis);

                        let focus = mySVG1.append("g")
                            .attr("class", "focus")
                            .style("display", "none");

                        focus.append("rect")
                            .attr("class", "tooltip")
                            .attr("width", 85)
                            .attr("height", 40)
                            .attr("x", -40)
                            .attr("y", 8)
                            .attr("rx", 4)
                            .attr("ry", 4);

                        focus.append("text")
                            .attr("class", "tooltip-month")
                            .attr("x", -35)
                            .attr("y", 25);

                        focus.append("text")
                            .attr("x", -35)
                            .attr("y", 40)
                            .text("Value:");

                        focus.append("text")
                            .attr("class", "tooltip-value")
                            .attr("x", 3)
                            .attr("y", 40);

                        mySVG1.append("rect")
                            .attr("class", "overlay")
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function () {
                                focus.style("display", null);
                            })
                            .on("mouseout", function () {
                                focus.style("display", "none");
                            })
                            .on("mousemove", mousemove);

                        function mousemove() {
                            let x0 = x.invert(d3.mouse(this)[0]);
                            let i = bisectDate(data, x0, 1);
                            let d0 = data[i - 1];
                            let d1 = data[i];
                            let d = x0 - d0.month > d1.month - x0 ? d1 : d0;
                            focus.attr("transform", "translate(" + x(d.month) + ")");
                            focus.select(".tooltip-month").text(d.monthName);
                            focus.select(".tooltip-value").text(d.value);
                        }
                    });
                }

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

                    let focus = mySVG1.append("g")
                        .attr("class", "focus")
                        .style("display", "none");

                    focus.append("rect")
                        .attr("class", "tooltip")
                        .attr("width", 85)
                        .attr("height", 40)
                        .attr("x", -40)
                        .attr("y", 8)
                        .attr("rx", 4)
                        .attr("ry", 4);

                    focus.append("text")
                        .attr("class", "tooltip-month")
                        .attr("x", -35)
                        .attr("y", 25);

                    focus.append("text")
                        .attr("x", -35)
                        .attr("y", 40)
                        .text("Value:");

                    focus.append("text")
                        .attr("class", "tooltip-value")
                        .attr("x", 3)
                        .attr("y", 40);

                    mySVG1.append("rect")
                        .attr("class", "overlay")
                        .attr("width", width)
                        .attr("height", height)
                        .on("mouseover", function () {
                            focus.style("display", null);
                        })
                        .on("mouseout", function () {
                            focus.style("display", "none");
                        })
                        .on("mousemove", mousemove);

                    function mousemove() {
                        let x0 = x.invert(d3.mouse(this)[0]);
                        let i = bisectDate(data, x0, 1);
                        let d0 = data[i - 1];
                        let d1 = data[i];
                        let d = x0 - d0.month > d1.month - x0 ? d1 : d0;
                        focus.attr("transform", "translate(" + x(d.month) + ")");
                        focus.select(".tooltip-month").text(d.monthName);
                        focus.select(".tooltip-value").text(d.value);
                    }
                });

            }

            salaryChart();

        }

        function redraw2() {
            let margin = {top: 20, right: 10, bottom: 20, left: 50};

            // присвоение ширины и высоты отображающейся области, в зависимости от размеров окна пользователя
            let width = chartDiv2.clientWidth - margin.right;
            let height = chartDiv2.clientHeight - margin.bottom - margin.top;

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

            // @ts-ignore
            function workHours() {
                let mySVG2 = d3.select(chartDiv2)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                let inter = setInterval(function () {
                    updateData();
                }, 3000);

                function updateData() {
                    // Get the data again
                    d3.json(urlWorkingHours).then(function (data) {
                        data.forEach(function (d) {
                            d.month = +d.month;
                            d.value = +d.value;
                        });

                        // Scale the range of the data again
                        x.domain(d3.extent(data, function (d) {
                            return d.month;
                        }));
                        y.domain(d3.extent(data, function (d) {
                            return d.value;
                        }));

                        // Select the section we want to apply our changes to
                        let mySVG2 = d3.select(chartDiv2).transition();

                        // Make the changes
                        mySVG2.select(".line")   // change the line
                            // .duration(750)
                            .attr("d", line(data));
                        mySVG2.select(".x.axis") // change the x axis
                            // .duration(750)
                            .call(xAxis);
                        mySVG2.select(".y.axis") // change the y axis
                            // .duration(750)
                            .call(yAxis);

                        let focus = mySVG2.append("g")
                            .attr("class", "focus")
                            .style("display", "none");

                        focus.append("rect")
                            .attr("class", "tooltip")
                            .attr("width", 85)
                            .attr("height", 40)
                            .attr("x", -40)
                            .attr("y", 8)
                            .attr("rx", 4)
                            .attr("ry", 4);

                        focus.append("text")
                            .attr("class", "tooltip-month")
                            .attr("x", -35)
                            .attr("y", 25);

                        focus.append("text")
                            .attr("x", -35)
                            .attr("y", 40)
                            .text("Value:");

                        focus.append("text")
                            .attr("class", "tooltip-value")
                            .attr("x", 3)
                            .attr("y", 40);

                        mySVG2.append("rect")
                            .attr("class", "overlay")
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function () {
                                focus.style("display", null);
                            })
                            .on("mouseout", function () {
                                focus.style("display", "none");
                            })
                            .on("mousemove", mousemove);

                        function mousemove() {
                            let x0 = x.invert(d3.mouse(this)[0]);
                            let i = bisectDate(data, x0, 1);
                            let d0 = data[i - 1];
                            let d1 = data[i];
                            let d = x0 - d0.month > d1.month - x0 ? d1 : d0;
                            focus.attr("transform", "translate(" + x(d.month) + ")");
                            focus.select(".tooltip-month").text(d.monthName);
                            focus.select(".tooltip-value").text(d.value);
                        }
                    });
                }

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

                    let focus = mySVG2.append("g")
                        .attr("class", "focus")
                        .style("display", "none");

                    focus.append("rect")
                        .attr("class", "tooltip")
                        .attr("width", 85)
                        .attr("height", 40)
                        .attr("x", -40)
                        .attr("y", 8)
                        .attr("rx", 4)
                        .attr("ry", 4);

                    focus.append("text")
                        .attr("class", "tooltip-month")
                        .attr("x", -35)
                        .attr("y", 25);

                    focus.append("text")
                        .attr("x", -35)
                        .attr("y", 40)
                        .text("Value:");

                    focus.append("text")
                        .attr("class", "tooltip-value")
                        .attr("x", 3)
                        .attr("y", 40);

                    mySVG2.append("rect")
                        .attr("class", "overlay")
                        .attr("width", width)
                        .attr("height", height)
                        .on("mouseover", function () {
                            focus.style("display", null);
                        })
                        .on("mouseout", function () {
                            focus.style("display", "none");
                        })
                        .on("mousemove", mousemove);

                    function mousemove() {
                        let x0 = x.invert(d3.mouse(this)[0]);
                        let i = bisectDate(data, x0, 1);
                        let d0 = data[i - 1];
                        let d1 = data[i];
                        let d = x0 - d0.month > d1.month - x0 ? d1 : d0;
                        focus.attr("transform", "translate(" + x(d.month) + ")");
                        focus.select(".tooltip-month").text(d.monthName);
                        focus.select(".tooltip-value").text(d.value);
                    }
                });
            }
            workHours();
        }

        // перерисовка графиков при изменении размеров окна
        window.addEventListener('resize', function () {
            d3.select("svg").remove();
            d3.select("svg").remove();
            redraw();
            redraw2();
        });

        switch (value) {
            case 'Зарплата' : {
                // d3.select("svg").remove();
                // d3.select("svg").remove();
                redraw();
                // this.tiles.push({text: 'salary chart', cols: 4, rows: 1, color: 'lightblue'});
                break;
            }
            case 'Рабочие часы' : {
                // d3.select("svg").remove();
                // d3.select("svg").remove();
                redraw2();
                // this.tiles.push({text: 'working hours chart', cols: 4, rows: 1, color: 'lightgreen'});
                break;
            }
            case 'График 3' : {
                this.tiles.push({text: 'third chart', cols: 4, rows: 1, color: '#B7A0E8'});
                break;
            }
            case 'График 4' : {
                this.tiles.push({text: 'forth chart', cols: 4, rows: 1, color: '#FF0000'});
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
