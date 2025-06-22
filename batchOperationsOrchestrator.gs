var BATCH_SIZE = 5;

function runScraper(targetKeyword) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var urlPairs = readUrlPairs(sheet);
  if (!urlPairs.length) {
    sheetFeedbackNotifier.notifyToast('No URL pairs found', 'Info', 5);
    return;
  }
  var batches = batchUrls(urlPairs, BATCH_SIZE);
  batches.forEach(function(batch) {
    var batchResults = [];
    batch.forEach(function(pair) {
      var ownResp = safeFetchRetryHandler.safeFetch(pair.own);
      var compResp = safeFetchRetryHandler.safeFetch(pair.comp);
      var ownHtml = ownResp && ownResp.content ? ownResp.content : '';
      var compHtml = compResp && compResp.content ? compResp.content : '';
      var ownData = parseAll(ownHtml, targetKeyword);
      var compData = parseAll(compHtml, targetKeyword);
      var rowValues = [
        ownData.title,
        ownData.metaDescription,
        ownData.h1,
        ownData.keywordDensity,
        compData.title,
        compData.metaDescription,
        compData.h1,
        compData.keywordDensity
      ];
      batchResults.push({ row: pair.row, values: rowValues });
    });
    writeBatchResults(sheet, batchResults);
    SpreadsheetApp.flush();
  });
  sheetFeedbackNotifier.notifyToast('Scrape complete', 'Success', 5);
}

function readUrlPairs(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  var pairs = [];
  data.forEach(function(row, i) {
    var own = (row[0] || '').toString().trim();
    var comp = (row[1] || '').toString().trim();
    if (own || comp) {
      pairs.push({ own: own, comp: comp, row: i + 2 });
    }
  });
  return pairs;
}

function batchUrls(items, size) {
  var batches = [];
  for (var i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

function parseAll(html, keyword) {
  html = html || '';
  return {
    title: parseTag(html, 'title'),
    metaDescription: parseMeta(html),
    h1: parseTag(html, 'h1'),
    keywordDensity: analyticsutils.calculateKeywordDensity(html, keyword)
  };
}

function parseTag(html, tag) {
  var re = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i');
  var m = html.match(re);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function parseMeta(html) {
  var re = /<meta\b[^>]*\bname\s*=\s*(['"])description\1[^>]*\bcontent\s*=\s*(['"])([\s\S]*?)\2[^>]*>/i;
  var m = html.match(re);
  return m ? m[3].replace(/\s+/g, ' ').trim() : '';
}

function writeBatchResults(sheet, results) {
  if (!results.length) return;
  var rows = results.map(function(r) { return r.row; });
  var startRow = Math.min.apply(null, rows);
  var endRow = Math.max.apply(null, rows);
  var numRows = endRow - startRow + 1;
  var numCols = results[0].values.length;
  var valuesGrid = [];
  for (var i = 0; i < numRows; i++) {
    var emptyRow = [];
    for (var j = 0; j < numCols; j++) emptyRow.push('');
    valuesGrid.push(emptyRow);
  }
  results.forEach(function(r) {
    var idx = r.row - startRow;
    valuesGrid[idx] = r.values;
  });
  sheet.getRange(startRow, 3, numRows, numCols).setValues(valuesGrid);
}