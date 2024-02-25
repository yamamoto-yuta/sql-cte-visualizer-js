function drawGraph(dependencies) {
    let dot = 'digraph G {';
    for (const [name, refs] of Object.entries(dependencies)) {
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
