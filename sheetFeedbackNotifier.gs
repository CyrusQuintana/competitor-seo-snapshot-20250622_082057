var CONFIG = {
  MAIN_SHEET_NAME: 'Main',
  ERROR_LOG_SHEET_NAME: 'Error Log',
  COL_RESULT_START: 3,
  COL_ERROR: 9
};

var ss = SpreadsheetApp.getActiveSpreadsheet();
var mainSheet = ss.getSheetByName(CONFIG.MAIN_SHEET_NAME);
if (!mainSheet) {
  throw new Error('Sheet "' + CONFIG.MAIN_SHEET_NAME + '" not found.');
}
var errorLogSheet = ss.getSheetByName(CONFIG.ERROR_LOG_SHEET_NAME) || ss.insertSheet(CONFIG.ERROR_LOG_SHEET_NAME);

function writeRowResults(row, ownData, compData) {
  var values = [
    ownData.title || '',
    compData.title || '',
    ownData.headerCount || '',
    compData.headerCount || '',
    ownData.metaDescription || '',
    compData.metaDescription || ''
  ];
  mainSheet.getRange(row, CONFIG.COL_RESULT_START, 1, values.length).setValues([values]);
}

function logError(row, url, msg) {
  mainSheet.getRange(row, CONFIG.COL_ERROR).setValue('Error: ' + msg);
  errorLogSheet.appendRow([new Date(), row, url, msg]);
}

function showToast(msg, type) {
  ss.toast(msg, type, 5);
}