function parseSQL() {
    const parser = new NodeSQLParser.Parser()
    const ast = parser.astify(
        document.getElementById('sql').value,
        { database: 'bigquery' }
    );
    return ast;
}
