function convertJson(originalJson) {
    // originalJsonを配列として扱う
    if (!Array.isArray(originalJson)) {
        originalJson = [originalJson];
    }

    let cteMap = new Map();

    // 'with'節の処理（もし存在する場合）
    if (originalJson[0].with) {
        originalJson[0].with.forEach(cte => {
            cteMap.set(cte.name.value, {
                "name": cte.name.value,
                "children": [],
                "processed": false
            });
        });

        // 再帰的にCTEの依存関係を解析
        function processCte(cteName) {
            let cte = cteMap.get(cteName);
            if (cte.processed) {
                return cte;
            }

            cte.processed = true;
            originalJson[0].with.forEach(w => {
                if (w.name.value === cteName) {
                    if (w.stmt.ast.from) {
                        w.stmt.ast.from.forEach(fromTable => {
                            if (cteMap.has(fromTable.table)) {
                                cte.children.push(processCte(fromTable.table));
                            } else {
                                cte.children.push({
                                    "name": fromTable.table
                                });
                            }
                        });
                    }
                }
            });

            return cte;
        }

        cteMap.forEach((_, cteName) => processCte(cteName));
    }

    // 新しいJSONオブジェクトの初期化
    let convertedJson = {
        "name": "root",
        "children": []
    };

    // 各テーブルを処理
    originalJson[0].from.forEach(table => {
        if (cteMap.has(table.table)) {
            convertedJson.children.push(cteMap.get(table.table));
        } else {
            convertedJson.children.push({
                "name": table.table
            });
        }
    });

    return convertedJson;
}
