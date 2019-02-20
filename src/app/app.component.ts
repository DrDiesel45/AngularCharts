import {Component, OnInit} from '@angular/core';
import * as d3 from 'd3/dist/d3.min.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [],
})

export class AppComponent implements OnInit {

    public chartCount = [
        {"id": 0, "name": "Один"},
        {"id": 1, "name": "Два"},
        {"id": 2, "name": "Три"}
    ];
    public selectedDefault = this.chartCount[0].id;

    ngOnInit() {
        let urlSalary = 'http://localhost:4000/results';
        let urlData = 'http://localhost:4000/results';
        let urlWorkingHours = 'http://localhost:4100/results';

        let bisectDate = d3.bisector(function (d) {
            return d.month;
        }).left;

        let chartDiv = document.getElementById("chart");
        let chartSelect = document.getElementById("chartSelect");

        // отображение графика с перерисовкой при изменении размера окна браузера

        // function redraw(selector, urlData) {
        function redraw() {

            d3.select("svg").remove();

            let mySVG = d3.select(chartDiv).append("svg");

            let margin = {top: 20, right: 10, bottom: 50, left: 50};

            // Extract the width and height that was computed by CSS.
            let width = chartDiv.clientWidth;
            let height = (chartDiv.clientHeight - margin.bottom);

            // let width = this.svg.width;

            // Use the extracted size to set the size of an SVG element.

            mySVG
                .attr("width", width)
                .attr("height", height);

            let x = d3.scaleTime()
                .range([0, width - margin.left - margin.right]);

            let y = d3.scaleLinear()
                .rangeRound([height, 0]);

            let xAxis = d3.axisBottom()
                .scale(x)
                .tickFormat(d3.format("~s"));

            let yAxis = d3.axisLeft()
                .scale(y)
                .tickFormat(d3.format("~s"));

            let line = d3.line()
                .x(function (d) {
                    return x(d.month);
                })
                .y(function (d) {
                    return y(d.value);
                });

            let svg = d3.select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Value");

                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);

                let focus = svg.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                focus.append("circle")
                    .attr("r", 5);

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

                svg.append("rect")
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
                    focus.attr("transform", "translate(" + x(d.month) + "," + y(d.value) + ")");
                    focus.select(".tooltip-month").text(d.monthName);
                    focus.select(".tooltip-value").text(d.value);
                }
            });
        }

        redraw();
        // redraw('#chart1', urlSalary);
        // redraw('#chart2', urlWorkingHours);
        window.addEventListener("resize", redraw);

    }
}
