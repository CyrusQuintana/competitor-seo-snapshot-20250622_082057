var MAX_RETRIES = 5;
var RETRY_BACKOFF_FACTOR = 2;
var RETRY_BASE_DELAY_MS = 1000;

/**
 * Performs an HTTP fetch with retry logic and exponential backoff.
 * Retries on exceptions or non-2xx HTTP status codes.
 * Returns an object containing content, statusCode, and headers.
 *
 * @param {string} url The URL to fetch.
 * @param {object} [fetchOptions] Optional UrlFetchApp.fetch parameters.
 * @return {object} { content: string, statusCode: number, headers: object }
 * @throws {Error} If all retry attempts fail or a non-2xx status persists.
 */
function safeFetch(url, fetchOptions) {
  fetchOptions = fetchOptions || {};
  var attempts = 0;
  var lastError = null;

  while (attempts < MAX_RETRIES) {
    try {
      var response = UrlFetchApp.fetch(url, fetchOptions);
      var status = response.getResponseCode();

      // If status is not in 200?299, treat as failure
      if (status < 200 || status >= 300) {
        throw new Error('safeFetch: HTTP status ' + status + ' for URL ' + url);
      }

      return {
        content: response.getContentText(),
        statusCode: status,
        headers: response.getAllHeaders()
      };
    } catch (e) {
      lastError = e;
      attempts++;

      // If we've reached max retries, throw
      if (attempts >= MAX_RETRIES) {
        throw new Error(
          'safeFetch: Failed after ' +
          MAX_RETRIES +
          ' attempts for URL ' +
          url +
          '. Last error: ' +
          e.message
        );
      }

      // Calculate exponential backoff delay: first retry waits base delay
      var delay = Math.pow(RETRY_BACKOFF_FACTOR, attempts - 1) * RETRY_BASE_DELAY_MS;
      Utilities.sleep(delay);
    }
  }

  // Should not reach here, but in case
  throw lastError;
}