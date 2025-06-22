# competitor-seo-snapshot-20250622_082057

## Project Description  
A Google Sheets add-on built with Google Apps Script that performs side-by-side on-page SEO metric comparisons (title, headers, meta description, keyword density) between your URLs and competitors? URLs.  
Full spec:  
https://docs.google.com/document/d/1lSlaBhV1BqxniN1K-Ni7sB6vBPCORpJGXoPlvVl3Qy8/

---

## Overview

**Competitor SEO Snapshot** allows you to:

- Register a custom **SEO Snapshot** menu in Google Sheets  
- Configure batch size, retry/back-off logic, and scheduled triggers via a Settings sidebar  
- Fetch HTML for target and competitor URLs with retry logic  
- Extract `<title>`, H1?H3 headings, `<meta name="description">`  
- Compute keyword density against a user-provided keyword  
- Write side-by-side results into your sheet  
- Log errors to a dedicated sheet or column  
- Display progress in an HTMLService sidebar and via Spreadsheet toasts  
- Schedule automated scans with time-driven triggers  

---

## Installation

1. Open your Google Sheet.  
2. Go to **Extensions > Apps Script**.  
3. In the Apps Script editor, create the following files with the given names and copy in the corresponding code:
   - `.gs` scripts:  
     - `onOpenMenuRegistration.gs`  
     - `showSidebar.gs`  
     - `settingsController.gs`  
     - `runScraperController.gs`  
     - `parserUtils.gs`  
     - `analyticsUtils.gs`  
     - `urlValidationUtils.gs`  
     - `sheetIOUtilities.gs`  
     - `errorHandlerUtils.gs`  
     - `triggerUtils.gs`  
     - `configConstants.gs`  
   - HTML templates & CSS:  
     - `sidebarUI.html`  
     - `settingsUI.html`  
     - `style.css`  
4. Save all files and **Refresh** your spreadsheet.  
5. Authorize the script when prompted (required scopes: Sheets, UrlFetch, Properties).  
6. A new **SEO Snapshot** menu will appear.

---

## Usage

1. In your Google Sheet, click **SEO Snapshot > Settings**.  
2. Configure:
   - Batch size for simultaneous URL fetches  
   - Retry count and back-off multiplier  
   - Scheduling options (daily, hourly, etc.)  
3. Click **Save** and close the sidebar.  
4. Back in the sheet, click **SEO Snapshot > Open Sidebar**.  
5. In the sidebar:
   - Enter your **target keyword**.  
   - Provide two columns or ranges: your URLs and competitor URLs.  
   - Click **Run Scraper**.  
6. Watch the progress bar in the sidebar; you will also see toast notifications.  
7. Upon completion, view titles, headings, meta descriptions, and keyword density metrics side-by-side in your sheet.

### Example: Running from the Script Console

```js
// Manually trigger the scraper for debugging:
function debugRun() {
  var targetKeyword = 'best running shoes';
  runScraperController.runScraper(targetKeyword);
}
```

---

## Components

Below is a summary of each module, its purpose, and status:

- **registerSidebarMenu** (.gs) ? Pass  
  Registers the ?SEO Snapshot? custom menu on spreadsheet open.  
- **sidebarHtmlRenderer** (.gs) ? Pass  
  Renders and displays the main scraping sidebar (`sidebarUI.html`).  
- **runKeywordsDashboard** (.html) ? Pass  
  HTML/CSS/JS UI for keyword input and progress; interacts with `runScraperController`.  
- **batchOperationsOrchestrator** (.gs) ? Fail  
  Orchestrates batch fetching, parsing, and writing. Entry point: `runScraperController.runScraper()`.  
- **seoContentAnalyzer** (.gs) ? Pass  
  Extracts title, headers, meta description; computes keyword density.  
- **sheetFeedbackNotifier** (.gs) ? Pass  
  Writes results back to sheet; logs errors; shows toasts.  
- **safeFetchRetryHandler** (.gs) ? Pass  
  Implements `safeFetch(url)` with exponential back-off.  
- **applicationConstants** (.gs) ? Pass  
  Defines batch sizes, retry limits, column indices.  
- **urlValidationSanitizer** (.gs) ? Reviewing  
  Validates and normalizes input URLs.  
- **settingsController** (.gs) ? Pending  
  Saves and loads user settings via `PropertiesService`.  
- **settingsUI** (.html) ? Pending  
  UI for configuring batch, retry, and schedule options.  
- **triggerUtils** (.gs) ? Pending  
  Creates and deletes Apps Script time-driven triggers.  
- **analyticsUtils** (.gs) ? Pending  
  Additional analytics beyond keyword density (placeholder).  
- **style** (.css) ? Pending  
  Shared CSS for both sidebars (placeholder).

---

## Dependencies

- Google Apps Script V8 runtime  
- Services:
  - `SpreadsheetApp`
  - `UrlFetchApp`
  - `HtmlService`
  - `PropertiesService`
  - `XmlService` (for fallback HTML parsing)  
- No external libraries or APIs  

---

## Project Structure

```
??? onOpenMenuRegistration.gs
??? showSidebar.gs
??? settingsController.gs
??? runScraperController.gs
??? parserUtils.gs
??? analyticsUtils.gs
??? urlValidationUtils.gs
??? sheetIOUtilities.gs
??? errorHandlerUtils.gs
??? triggerUtils.gs
??? configConstants.gs
??? sidebarUI.html
??? settingsUI.html
??? style.css
```

---

## To-Do & Known Issues

- [ ] Verify ARIA attributes and keyboard focus management in both sidebars.  
- [ ] Ensure `style.css` is loaded correctly and does not conflict with native Sheets UI.  
- [ ] Write unit tests or mock functions for `parserUtils` and `analyticsUtils`.  
- [ ] Optimize batch size and retry back-off based on real usage and Apps Script quotas.  
- [ ] Complete pending modules: `settingsController`, `settingsUI`, `triggerUtils`, `analyticsUtils`.

---

## Contributing

1. Fork the project in your Apps Script environment.  
2. Improve or add missing features.  
3. Test thoroughly with different URL sets and schedules.  
4. Suggest enhancements via GitHub issues or pull requests (if hosted).

---

## License

This project is released under the MIT License.