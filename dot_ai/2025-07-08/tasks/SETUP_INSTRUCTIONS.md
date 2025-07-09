# Google Apps Script Setup Instructions for Monthly NPM Downloads Tracker

This guide will help you set up the Google Apps Script to automatically track monthly NPM download statistics for Nx packages.

## Prerequisites

1. A Google account with access to Google Sheets
2. A Google Spreadsheet where you want to track the data

## Step-by-Step Setup

### 1. Prepare Your Spreadsheet

1. Open your Google Spreadsheet (or create a new one)
2. Create a sheet tab named exactly: `Monthly NPM Download Stats`
3. In cell A1, type `Month`
4. Save the spreadsheet

### 2. Open Apps Script Editor

1. In your spreadsheet, go to **Extensions > Apps Script**
2. A new tab will open with the Apps Script editor
3. Delete any default code in the editor

### 3. Copy the Script

1. Copy the entire contents of `google-apps-script-monthly-npm-downloads.js`
2. Paste it into the Apps Script editor
3. Click the **Save** button (or press Ctrl+S / Cmd+S)
4. Name your project (e.g., "NPM Stats Tracker")

### 4. Configure the Script (Optional)

The script comes with default configuration that should work out of the box. However, you can modify the `CONFIG` object at the top of the script if needed:

```javascript
const CONFIG = {
  SPREADSHEET_ID: '',                         // Leave empty for bound scripts
  SHEET_NAME: 'Monthly NPM Download Stats',  // Name of your data sheet
  LAST_UPDATED_SHEET_NAME: 'Last Updated',   // Name of the tracking sheet
  TOTAL_NPM_DOWNLOADS: 'Total NPM Downloads', // Label for total downloads
  NPM_MAINTAINER: 'nrwlowner',                // NPM maintainer to search
  DEBUG: true                                 // Enable/disable logging
};
```

**Important**: If you're running the script as a standalone project (not from within a spreadsheet), you must add your spreadsheet ID to `SPREADSHEET_ID`. You can find this ID in your spreadsheet URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### 5. Initial Test Run

1. In the Apps Script editor, select `manualRun` from the function dropdown
2. Click the **Run** button
3. You'll be prompted to authorize the script:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** then **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
4. Check the execution log (View > Logs) to see if it ran successfully
5. Go back to your spreadsheet - you should see data being populated!

### 6. Set Up Automatic Weekly Execution

1. In the Apps Script editor, select `setupTrigger` from the function dropdown
2. Click the **Run** button
3. This will set up the script to run automatically every Monday at 9 AM

### 7. Verify the Trigger

1. In the Apps Script editor, go to the **Triggers** page (clock icon on the left)
2. You should see a trigger for `updateMonthlyNpmDownloads`
3. It should be set to run "Week timer" on "Every Monday" at "9am-10am"

## What the Script Does

The script performs these actions when it runs:

1. **Fetches Package List**: Gets all NPM packages maintained by "nrwlowner" that were published in the last year
2. **Checks for New Months**: Determines which complete months haven't been reported yet
3. **Downloads Statistics**: For each new month, fetches download counts for:
   - Each individual Nx package
   - Total NPM downloads (all packages combined)
4. **Updates Spreadsheet**: 
   - Adds new columns for any new packages
   - Adds rows for each new month with download data
   - Updates a "Last Updated" timestamp

## Spreadsheet Structure

After running, your spreadsheet will have:

- **Column A**: Month names (e.g., "June 2025")
- **Column B onwards**: Package names with their monthly download counts
- **Last column**: Total NPM Downloads

A separate "Last Updated" sheet tracks when the script last ran.

## Troubleshooting

### Common Issues

1. **"Sheet not found" error**
   - Make sure your sheet is named exactly `Monthly NPM Download Stats`
   - Check for extra spaces in the sheet name

2. **Rate limiting errors**
   - The script includes delays to avoid rate limiting
   - If you still get errors, try increasing the sleep time in `getMonthReports()`

3. **No data appearing**
   - Check the execution log (View > Logs) for errors
   - Verify that NPM API is accessible from your location
   - Ensure you have edit permissions on the spreadsheet

### Manual Functions for Testing

The script includes several test functions:

- `testGetPackages()` - Tests fetching packages from NPM
- `testGetDownloads()` - Tests fetching download stats for a single package
- `manualRun()` - Manually triggers the full update process

## Maintenance

- The script will automatically run weekly if you set up the trigger
- No external dependencies or API keys are required
- The script uses your Google account permissions to access the spreadsheet
- NPM API is public and doesn't require authentication

## Customization

You can modify the script to:

- Change the reporting frequency (edit `setupTrigger()`)
- Track different NPM maintainers (change `NPM_MAINTAINER` in CONFIG)
- Add additional data columns (modify `getMonthReports()`)
- Change date formats (modify `formatMonth()`)

## Support

If you encounter issues:

1. Check the execution log in Apps Script (View > Logs)
2. Verify your spreadsheet structure matches the requirements
3. Ensure the NPM API endpoints are accessible
4. Try running the test functions to isolate the problem