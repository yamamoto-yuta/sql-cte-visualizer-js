function parseSQLQuery(queryScript) {
    // delete comment
    queryScript = queryScript.replace(/--.*\n|#.*\n|\/\*([^*]|\*[^\/])*\*\//g, '');

    // get CTEs
    const ctePattern = /(?:with|,)\s*(\w+)\s+as\s*\(([^()]|\((?:[^()]|\([^()]*\))*\))*\)/gi;
    let ctes = {};
    let match;
    while (match = ctePattern.exec(queryScript)) {
        // console.log(match);
        ctes[match[1]] = match[0];
    }

    // console.log("ctes");
    // console.log(ctes);

    // get main query
    const mainPattern = Object.keys(ctes).length > 0 ? /\)[;\s]*select/gi : /select/gi;
    const startMainMatch = mainPattern.exec(queryScript);
    const startMain = startMainMatch ? startMainMatch.index + 1 : -1;
    ctes['main'] = startMain !== -1 ? queryScript.slice(startMain).trim() : '';

    // find reference table or CTEs
    const refPattern = /(?:from|join)\s+([`.\-\w]+)/gi;
    let dependencies = {};
    for (let name in ctes) {
        let refs = [];
        let match;
        while (match = refPattern.exec(ctes[name])) {
            refs.push(match[1]);
        }
        dependencies[name] = refs;
    }

    return { ctes, dependencies };
}