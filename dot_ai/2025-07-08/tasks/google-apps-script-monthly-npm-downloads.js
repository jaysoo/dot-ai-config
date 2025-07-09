/**
 * Google Apps Script for NPM & GitHub Stats Tracking
 * 
 * This script fetches NPM download statistics and GitHub star data for Nx packages
 * and updates a Google Spreadsheet with the data.
 * 
 * Setup Instructions:
 * 1. Open your Google Spreadsheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this entire script
 * 4. Update the CONFIG values below
 * 5. Save the project
 */

// ========================
// CONFIGURATION
// ========================
const CONFIG = {
  SHEET_ID: '1zsSsq2Z3KwjsCgoOAbqX90xY5o9iu30U0TEcCa4jYgU',
  MONTHLY_DOWNLOADS_SHEET: 'Monthly Downloads',
  WEEKLY_DOWNLOADS_SHEET: 'Weekly Downloads',
  GITHUB_STARS_SHEET: 'GitHub Stars',
  LAST_UPDATED_SHEET_NAME: 'Last Updated',
  TOTAL_NPM_DOWNLOADS: 'Total NPM Downloads',
  NPM_MAINTAINER: 'nrwlowner',
  GITHUB_REPOS: [
    { owner: 'nrwl', repo: 'nx' },
    { owner: 'lerna', repo: 'lerna' }
  ],
  GITHUB_PAT: '', // Add your GitHub Personal Access Token here
  DEBUG: true
};

// ========================
// MAIN EXECUTION FUNCTIONS
// ========================
function updateAllStats() {
  try {
    updateMonthlyNpmDownloads();
  } catch (error) {
    _log(`ERROR in monthly downloads: ${error.message}`);
  }
  
  try {
    updateWeeklyNpmDownloads();
  } catch (error) {
    _log(`ERROR in weekly downloads: ${error.message}`);
  }
  
  try {
    updateGitHubStars();
  } catch (error) {
    _log(`ERROR in GitHub stars: ${error.message}`);
  }
}

function updateMonthlyNpmDownloads() {
  try {
    _log('Starting monthly NPM downloads update...');
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG.MONTHLY_DOWNLOADS_SHEET);
    
    if (!sheet) {
      throw new Error(`Sheet "${CONFIG.MONTHLY_DOWNLOADS_SHEET}" not found. Please create it first.`);
    }
    
    // Get existing package names from headers
    const existingPackageNames = _getSheetHeaders(sheet);
    
    // Fetch all Nx packages from NPM
    const allPackages = _getAllNxPackages();
    const allPackageNames = allPackages
      .map(pkg => pkg.name)
      .concat(CONFIG.TOTAL_NPM_DOWNLOADS);
    
    // Find new packages to add
    const packageNamesToAdd = allPackageNames.filter(
      packageName => !existingPackageNames.includes(packageName)
    );
    
    // Maintain column order: existing packages first, then new ones
    const packageNamesInColumnOrder = existingPackageNames.concat(packageNamesToAdd);
    
    // Get months to report
    const lastMonthReported = _getLastMonthReported(sheet);
    const monthsToReport = _getCompleteMonthsSinceDate(lastMonthReported);
    
    if (monthsToReport.length === 0) {
      _log('No new complete months to report');
      return;
    }
    
    _log(`Found ${monthsToReport.length} months to report`);
    
    // Fetch download data for each month
    const monthReports = _getMonthReports(monthsToReport, packageNamesInColumnOrder);
    
    // Prepare rows for spreadsheet
    const rows = monthReports.map(monthReport => {
      const row = [_formatMonth(monthReport.startDate)];
      
      packageNamesInColumnOrder.forEach(packageName => {
        row.push(monthReport.packages[packageName] || 0);
      });
      
      return row;
    });
    
    // Update spreadsheet
    if (packageNamesToAdd.length > 0) {
      _appendPackageHeaders(sheet, packageNamesToAdd);
    }
    
    _appendDataRows(sheet, rows);
    _updateLastUpdatedDate(spreadsheet);
    
    _log('Monthly downloads update completed successfully!');
    
  } catch (error) {
    console.error('Error updating monthly NPM downloads:', error);
    throw error;
  }
}

function updateWeeklyNpmDownloads() {
  try {
    _log('Starting weekly NPM downloads update...');
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.WEEKLY_DOWNLOADS_SHEET);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.WEEKLY_DOWNLOADS_SHEET);
      sheet.getRange(1, 1).setValue('Week');
    }
    
    // Get existing package names from headers
    const existingPackageNames = _getSheetHeaders(sheet);
    
    // Fetch all Nx packages from NPM
    const allPackages = _getAllNxPackages();
    const allPackageNames = allPackages
      .map(pkg => pkg.name)
      .concat(CONFIG.TOTAL_NPM_DOWNLOADS);
    
    // Find new packages to add
    const packageNamesToAdd = allPackageNames.filter(
      packageName => !existingPackageNames.includes(packageName)
    );
    
    // Maintain column order
    const packageNamesInColumnOrder = existingPackageNames.concat(packageNamesToAdd);
    
    // Get weeks to report
    const lastWeekReported = _getLastWeekReported(sheet);
    const weeksToReport = _getCompleteWeeksSinceDate(lastWeekReported);
    
    if (weeksToReport.length === 0) {
      _log('No new complete weeks to report');
      return;
    }
    
    _log(`Found ${weeksToReport.length} weeks to report`);
    
    // Fetch download data for each week
    const weekReports = _getWeekReports(weeksToReport, packageNamesInColumnOrder);
    
    // Prepare rows for spreadsheet
    const rows = weekReports.map(weekReport => {
      const row = [_formatWeek(weekReport.startDate)];
      
      packageNamesInColumnOrder.forEach(packageName => {
        row.push(weekReport.packages[packageName] || 0);
      });
      
      return row;
    });
    
    // Update spreadsheet
    if (packageNamesToAdd.length > 0) {
      _appendPackageHeaders(sheet, packageNamesToAdd);
    }
    
    _appendDataRows(sheet, rows);
    _updateLastUpdatedDate(spreadsheet);
    
    _log('Weekly downloads update completed successfully!');
    
  } catch (error) {
    console.error('Error updating weekly NPM downloads:', error);
    throw error;
  }
}

function updateGitHubStars() {
  try {
    _log('Starting GitHub stars update...');
    
    if (!CONFIG.GITHUB_PAT) {
      _log('WARNING: GitHub PAT not configured. Skipping GitHub stars update.');
      return;
    }
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.GITHUB_STARS_SHEET);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.GITHUB_STARS_SHEET);
      sheet.getRange(1, 1).setValue('Month');
    }
    
    // Add repo headers if needed
    const reposInColumnOrder = _addRepoHeadersIfNotExist(sheet, CONFIG.GITHUB_REPOS);
    
    // Get months to report
    const lastMonthReported = _getLastMonthReported(sheet);
    const monthsToReport = _getCompleteMonthsSinceDate(lastMonthReported);
    
    if (monthsToReport.length === 0) {
      _log('No new complete months to report for GitHub stars');
      return;
    }
    
    _log(`Found ${monthsToReport.length} months to report for GitHub stars`);
    
    // Fetch star data for each repo
    const reports = {};
    let hasValidData = false;
    
    for (const repo of CONFIG.GITHUB_REPOS) {
      const repoLabel = `${repo.owner}/${repo.repo}`;
      _log(`Fetching star history for ${repoLabel}...`);
      
      try {
        const repoData = _getMonthlyStarsForRepo(repo.owner, repo.repo, monthsToReport);
        if (repoData && Object.keys(repoData).length > 0) {
          reports[repoLabel] = repoData;
          hasValidData = true;
        } else {
          _log(`WARNING: No data received for ${repoLabel}`);
          reports[repoLabel] = {};
        }
      } catch (error) {
        _log(`WARNING: Failed to fetch data for ${repoLabel}: ${error.message}`);
        reports[repoLabel] = {};
      }
    }
    
    if (!hasValidData) {
      _log('WARNING: No valid GitHub data received. Skipping update.');
      return;
    }
    
    // Prepare rows for spreadsheet
    const rows = monthsToReport.map(month => {
      const monthLabel = _formatMonth(month.start);
      const row = [monthLabel];
      
      reposInColumnOrder.forEach(repo => {
        const repoLabel = `${repo.owner}/${repo.repo}`;
        const monthData = reports[repoLabel][monthLabel] || { newStars: 0, runningTotal: 0 };
        row.push(monthData.newStars);
        row.push(monthData.runningTotal);
      });
      
      return row;
    });
    
    // Update spreadsheet
    _appendDataRows(sheet, rows);
    _updateLastUpdatedDate(spreadsheet);
    
    _log('GitHub stars update completed successfully!');
    
  } catch (error) {
    _log(`WARNING: GitHub stars update failed: ${error.message}. Skipping.`);
    // Don't throw - just log and continue
  }
}

// ========================
// NPM API FUNCTIONS
// ========================
function _getAllNxPackages() {
  const url = `https://registry.npmjs.org/-/v1/search?text=maintainer:${CONFIG.NPM_MAINTAINER}&size=250`;
  
  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return data.objects
      .map(obj => obj.package)
      .filter(pkg => {
        const publishDate = new Date(pkg.date);
        return publishDate > oneYearAgo;
      });
      
  } catch (error) {
    console.error('Error fetching packages from NPM:', error);
    throw error;
  }
}

function _getMonthReports(months, packageNames) {
  const reports = [];
  
  // Process months sequentially to avoid rate limiting
  months.forEach((month, index) => {
    _log(`Fetching data for ${_formatMonth(month.start)} (${index + 1}/${months.length})...`);
    
    const report = {
      startDate: month.start,
      endDate: month.end,
      packages: {}
    };
    
    // Fetch download data for each package
    packageNames.forEach(packageName => {
      const downloads = _getPackageDownloads(packageName, month);
      report.packages[packageName] = downloads;
      
      // Small delay to avoid rate limiting
      Utilities.sleep(100);
    });
    
    reports.push(report);
  });
  
  return reports;
}

function _getWeekReports(weeks, packageNames) {
  const reports = [];
  
  // Process weeks sequentially to avoid rate limiting
  weeks.forEach((week, index) => {
    _log(`Fetching data for week ${_formatWeek(week.start)} (${index + 1}/${weeks.length})...`);
    
    const report = {
      startDate: week.start,
      endDate: week.end,
      packages: {}
    };
    
    // Fetch download data for each package
    packageNames.forEach(packageName => {
      const downloads = _getPackageDownloads(packageName, week);
      report.packages[packageName] = downloads;
      
      // Small delay to avoid rate limiting
      Utilities.sleep(100);
    });
    
    reports.push(report);
  });
  
  return reports;
}

function _getPackageDownloads(packageName, period) {
  const startStr = _formatDate(period.start);
  const endStr = _formatDate(period.end);
  
  let url = `https://api.npmjs.org/downloads/point/${startStr}:${endStr}`;
  
  if (packageName !== CONFIG.TOTAL_NPM_DOWNLOADS) {
    url += `/${encodeURIComponent(packageName)}`;
  }
  
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    
    if (response.getResponseCode() !== 200) {
      console.warn(`Failed to fetch downloads for ${packageName}: ${response.getResponseCode()}`);
      return 0;
    }
    
    const data = JSON.parse(response.getContentText());
    return data.downloads || 0;
    
  } catch (error) {
    console.error(`Error fetching downloads for ${packageName}:`, error);
    return 0;
  }
}

// ========================
// GITHUB API FUNCTIONS
// ========================
function _getMonthlyStarsForRepo(owner, repo, months) {
  const query = `
    query Stargazers($owner: String!, $repo: String!, $after: String) {
      repository(followRenames: true, owner: $owner, name: $repo) {
        stargazers(
          first: 100
          after: $after
          orderBy: { field: STARRED_AT, direction: DESC }
        ) {
          edges {
            starredAt
          }
          totalCount
          pageInfo {
            endCursor
          }
        }
      }
    }
  `;
  
  const monthlyData = {};
  months.forEach(month => {
    const monthLabel = _formatMonth(month.start);
    monthlyData[monthLabel] = { newStars: 0, runningTotal: 0 };
  });
  
  try {
    // Fetch first page
    let hasNextPage = true;
    let cursor = null;
    let allStars = [];
    
    while (hasNextPage) {
      const response = UrlFetchApp.fetch('https://api.github.com/graphql', {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${CONFIG.GITHUB_PAT}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          query: query,
          variables: { owner, repo, after: cursor }
        }),
        muteHttpExceptions: true
      });
      
      if (response.getResponseCode() !== 200) {
        const errorMessage = `GitHub API error: ${response.getResponseCode()}`;
        _log(errorMessage);
        
        // Check for common error codes
        if (response.getResponseCode() === 401) {
          throw new Error('GitHub PAT is invalid or expired');
        } else if (response.getResponseCode() === 404) {
          throw new Error(`Repository ${owner}/${repo} not found or PAT lacks access`);
        } else {
          throw new Error(errorMessage);
        }
      }
      
      const responseText = response.getContentText();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from GitHub API');
      }
      
      // Check for GraphQL errors
      if (data.errors) {
        throw new Error(`GitHub API error: ${data.errors[0].message}`);
      }
      
      if (!data.data || !data.data.repository || !data.data.repository.stargazers) {
        throw new Error(`No stargazer data found for ${owner}/${repo}`);
      }
      
      const stargazers = data.data.repository.stargazers;
      
      stargazers.edges.forEach(edge => {
        if (edge.starredAt) {
          allStars.push(new Date(edge.starredAt));
        }
      });
      
      hasNextPage = stargazers.edges.length === 100;
      cursor = stargazers.pageInfo.endCursor;
      
      // Check if we've gone past our date range
      if (stargazers.edges.length > 0) {
        const lastEdgeWithDate = stargazers.edges.filter(e => e.starredAt).pop();
        if (lastEdgeWithDate) {
          const lastStarDate = new Date(lastEdgeWithDate.starredAt);
          if (lastStarDate < months[0].start) {
            hasNextPage = false;
          }
        }
      }
      
      // Rate limit protection
      Utilities.sleep(500);
    }
    
    // Count stars by month
    let runningTotal = allStars.length;
    
    // Process months from newest to oldest
    const sortedMonths = [...months].sort((a, b) => b.start - a.start);
    
    sortedMonths.forEach(month => {
      const monthLabel = _formatMonth(month.start);
      const monthStart = month.start;
      const monthEnd = month.end;
      
      // Count stars in this month
      const starsInMonth = allStars.filter(starDate => 
        starDate >= monthStart && starDate <= monthEnd
      ).length;
      
      monthlyData[monthLabel] = {
        newStars: starsInMonth,
        runningTotal: runningTotal
      };
      
      runningTotal -= starsInMonth;
    });
    
  } catch (error) {
    _log(`Error fetching stars for ${owner}/${repo}: ${error.message}`);
    throw error; // Re-throw to be caught by updateGitHubStars
  }
  
  return monthlyData;
}

// ========================
// SPREADSHEET FUNCTIONS
// ========================
function _getSheetHeaders(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < 2) return [];
  
  const headers = sheet.getRange(1, 2, 1, lastColumn - 1).getValues()[0];
  return headers.filter(header => header !== '');
}

function _appendPackageHeaders(sheet, packageNames) {
  const lastColumn = sheet.getLastColumn();
  const startColumn = lastColumn + 1;
  
  const range = sheet.getRange(1, startColumn, 1, packageNames.length);
  range.setValues([packageNames]);
  
  _log(`Added ${packageNames.length} new package columns`);
}

function _addRepoHeadersIfNotExist(sheet, repos) {
  const headers = _getSheetHeaders(sheet);
  const existingRepoHeaders = new Set();
  
  // Extract repo names from existing headers
  headers.forEach(header => {
    const repoName = header.split(' - ')[0];
    if (repoName) {
      existingRepoHeaders.add(repoName);
    }
  });
  
  const reposToAdd = [];
  const headersToAdd = [];
  
  repos.forEach(repo => {
    const repoLabel = `${repo.owner}/${repo.repo}`;
    if (!existingRepoHeaders.has(repoLabel)) {
      reposToAdd.push(repo);
      headersToAdd.push(`${repoLabel} - New Stars`);
      headersToAdd.push(`${repoLabel} - Running Total`);
    }
  });
  
  if (headersToAdd.length > 0) {
    const lastColumn = sheet.getLastColumn();
    const startColumn = lastColumn + 1;
    const range = sheet.getRange(1, startColumn, 1, headersToAdd.length);
    range.setValues([headersToAdd]);
    _log(`Added ${reposToAdd.length} new repository columns`);
  }
  
  // Return repos in column order
  const reposInOrder = [];
  existingRepoHeaders.forEach(repoLabel => {
    const parts = repoLabel.split('/');
    if (parts.length === 2) {
      reposInOrder.push({ owner: parts[0], repo: parts[1] });
    }
  });
  reposToAdd.forEach(repo => reposInOrder.push(repo));
  
  return reposInOrder;
}

function _appendDataRows(sheet, rows) {
  if (rows.length === 0) return;
  
  const lastRow = sheet.getLastRow();
  const startRow = lastRow + 1;
  const numColumns = rows[0].length;
  
  const range = sheet.getRange(startRow, 1, rows.length, numColumns);
  range.setValues(rows);
  
  _log(`Added ${rows.length} new data rows`);
}

function _getLastMonthReported(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    // No data yet, start from one year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setMonth(11); // December
    oneYearAgo.setDate(31);
    return oneYearAgo;
  }
  
  const lastMonthStr = sheet.getRange(lastRow, 1).getValue();
  return _parseMonthYear(lastMonthStr);
}

function _getLastWeekReported(sheet) {
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    // No data yet, start from 12 weeks ago
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 weeks
    return twelveWeeksAgo;
  }
  
  const lastWeekStr = sheet.getRange(lastRow, 1).getValue();
  return _parseWeekString(lastWeekStr);
}

function _updateLastUpdatedDate(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(CONFIG.LAST_UPDATED_SHEET_NAME);
  
  if (!sheet) {
    // Create the sheet if it doesn't exist
    sheet = spreadsheet.insertSheet(CONFIG.LAST_UPDATED_SHEET_NAME);
    sheet.getRange(1, 1).setValue('Last Updated');
  }
  
  const now = new Date();
  sheet.getRange(1, 2).setValue(now);
  
  _log(`Updated last updated date to ${now}`);
}

// ========================
// DATE UTILITY FUNCTIONS
// ========================
function _getCompleteMonthsSinceDate(startDate) {
  const months = [];
  const now = new Date();
  
  // Start from the next month after startDate
  const current = new Date(startDate);
  current.setMonth(current.getMonth() + 1);
  current.setDate(1);
  current.setHours(0, 0, 0, 0);
  
  while (current < now) {
    const monthStart = new Date(current);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    
    // Only include complete months (where end date is in the past)
    if (monthEnd < now) {
      months.push({
        start: monthStart,
        end: monthEnd
      });
    }
    
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
}

function _getCompleteWeeksSinceDate(startDate) {
  const weeks = [];
  const now = new Date();
  
  // Start from the next Sunday after startDate
  const current = new Date(startDate);
  const daysUntilSunday = 7 - current.getDay();
  current.setDate(current.getDate() + daysUntilSunday);
  current.setHours(0, 0, 0, 0);
  
  while (current < now) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);
    weekEnd.setDate(weekEnd.getDate() + 6); // Saturday
    
    // Only include complete weeks (where end date is in the past)
    if (weekEnd < now) {
      weeks.push({
        start: weekStart,
        end: weekEnd
      });
    }
    
    current.setDate(current.getDate() + 7);
  }
  
  return weeks;
}

function _formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function _formatMonth(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function _formatWeek(date) {
  // Format as "Week of MM/DD/YYYY"
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `Week of ${month}/${day}/${year}`;
}

function _parseMonthYear(monthYearStr) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const parts = monthYearStr.split(' ');
  const monthIndex = months.indexOf(parts[0]);
  const year = parseInt(parts[1]);
  
  // Return the last day of that month
  return new Date(year, monthIndex + 1, 0);
}

function _parseWeekString(weekStr) {
  // Parse "Week of MM/DD/YYYY" format
  const match = weekStr.match(/Week of (\d{2})\/(\d{2})\/(\d{4})/);
  if (match) {
    const month = parseInt(match[1]) - 1;
    const day = parseInt(match[2]);
    const year = parseInt(match[3]);
    return new Date(year, month, day);
  }
  
  // Fallback to 12 weeks ago
  const fallback = new Date();
  fallback.setDate(fallback.getDate() - 84);
  return fallback;
}

function _log(message) {
  if (CONFIG.DEBUG) {
    console.log(`[NPM Stats] ${message}`);
  }
}