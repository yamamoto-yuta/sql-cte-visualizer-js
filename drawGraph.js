function drawGraph(dependencies) {
    let dot = 'digraph G {';
    dot += 'node [shape="polygon", fillcolor="green", style="filled"] ';

    for (const [name, refs] of Object.entries(dependencies)) {
        if (name === "main") {
            dot += 'main [fillcolor="yellow", style="filled"]';
        } else {
            dot += `${name} [fillcolor="lightblue", style="filled"]`;
        }
        refs.forEach(ref => {
            dot += `"${name}" -> "${ref}";`;
        });
    }
    dot += '}';
    // console.log(dot);

    d3.select("#graphContainer").graphviz()
        .fade(false)
        .renderDot(dot);
}
