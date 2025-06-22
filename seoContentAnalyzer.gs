function extractTitle(html) {
  var match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : '';
}

function extractHeaders(html, levels) {
  var result = {};
  var lvls = Array.isArray(levels) && levels.length ? levels : [1, 2, 3];
  lvls.forEach(function(level) {
    var tag = 'h' + level;
    var regex = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'gi');
    var matches = [], m;
    while ((m = regex.exec(html)) !== null) {
      matches.push(m[1].trim());
    }
    result[tag] = matches;
  });
  return result;
}

function extractMetaDescription(html) {
  var regex = /<meta\b[^>]*?(?:name=["']description["'][^>]*?content=["']([\s\S]*?)["']|content=["']([\s\S]*?)["'][^>]*?name=["']description["'])[^\>]*>/i;
  var match = html.match(regex);
  if (!match) return '';
  return (match[1] || match[2] || '').trim();
}

function normalizeText(html) {
  var text = html.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&[^\s;]+;/g, ' ');
  text = text.toLowerCase();
  text = text.replace(/[^a-z0-9\s]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function analyzeSEO(url, keyword, headerLevels) {
  var response;
  try {
    response = safeFetch(url, {muteHttpExceptions: true});
  } catch (e) {
    throw new Error('Fetch error: ' + e.message);
  }
  var code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('HTTP error: ' + code);
  }
  var html = response.getContentText();
  var title = extractTitle(html);
  var headers = extractHeaders(html, headerLevels);
  var metaDescription = extractMetaDescription(html);
  var normalized = normalizeText(html);
  var keywordDensity = analyticsutils.calculateKeywordDensity(normalized, keyword);
  return {
    title: title,
    headers: headers,
    metaDescription: metaDescription,
    keywordDensity: keywordDensity
  };
}