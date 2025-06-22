function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('SEO Snapshot')
    .addItem('Open Sidebar', 'showSidebar')
    .addItem('Settings', 'showSettingsSidebar')
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('runKeywordsDashboard')
    .setTitle('SEO Snapshot')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

function showSettingsSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('settingsui')
    .setTitle('SEO Snapshot Settings')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}