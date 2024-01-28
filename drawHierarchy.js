function _selectSVGElement() {
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.5;
    const svg = d3.select("svg").attr("width", width).attr("height", height);
    return {
        width: width,
        height: height,
        svg: svg
    };
}

function initHierarchy() {
    const { width, height, svg } = _selectSVGElement();
    // 既存の描画をクリア
    svg.selectAll("*").remove();
}

function drawHierarchy(data) {
    const { width, height, svg } = _selectSVGElement();
    const g = svg.append("g").attr("transform", "translate(40,0)");

    const tree = d3.tree()
        .size([height, width - 160]);

    const stratify = d3.stratify()
        .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    // var data = JSON.parse(document.getElementById('jsonInput').value);
    const root = d3.hierarchy(data);
    tree(root);

    const link = g.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });

    const node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    node.append("circle")
        .attr("r", 10);

    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function (d) { return d.children ? -13 : -13; })
        .style("text-anchor", function (d) {
            return d.children ? "end" : "end";
        })
        .text(function (d) { return d.data.name; });
}