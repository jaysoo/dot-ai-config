# Check Pending PTO Requests

This command checks for pending PTO requests in the Wagepoint calendar for the current week and next week, then saves them to a text file.

## Process

1. **Navigate to Calendar**
   - Go to https://people.wagepoint.com/nrwl/calendar
   - If redirected to login, click "Sign in with Google" button

2. **Enable Pending PTO Filter**
   - Click the "Pending PTO requests" button in the top bar (will change to "Filter" when active)
   - Click "Pending PTO requests" checkbox in the "Show" section of the filter menu
   - Press Escape or click outside the menu to close it

3. **Identify Pending Requests**
   - **Pending requests**: Light background with border (lighter teal/green with visible border)
   - **Approved requests**: Solid dark teal/green background (no border)
   - Visual identification is more reliable than clicking individual requests

4. **Check Current Week**
   - Note the week range displayed (e.g., "Jul 27 - Aug 2, 2025")
   - Visually identify all pending requests by their lighter background
   - Record employee name, date, and time range for each

5. **Check Next Week**
   - Click the right arrow (>) in the week navigation control
   - Wait for the calendar to load the new week
   - Repeat the identification process for the new week

6. **Save to File**
   - Update or create file named `pending_pto_YYYY_MM_DD.txt` with today's date
   - Format:
   ```
   Pending PTO Requests
   ====================

   Week of [Date Range]
   ---------------------------------
   1. [Employee Name]: [Date], [Year] ([Day of week]) - [Time range if partial day]
   2. ...

   Week of [Date Range]
   ----------------------------------
   1. [Employee Name]: [Date], [Year] ([Day of week]) - [Time range if partial day]
   2. ...

   Report generated on: YYYY-MM-DD
   ```

## Important Notes

- **Visual Identification**: Pending requests have a lighter background color with a visible border
- **Time Ranges**: Include specific time ranges for partial day requests (e.g., "11:00am-7:00pm")
- **Date Format**: Use "Month Day, Year (Day of Week)" format (e.g., "August 1, 2025 (Friday)")
- Screenshots can be helpful for visual verification of pending vs approved requests
- The filter button changes label from "Pending PTO requests" to "Filter" when active

## Playwright MCP Implementation
- Use `mcp__playwright__browser_navigate` for navigation
- Use `mcp__playwright__browser_click` for interactions
- Use `mcp__playwright__browser_take_screenshot` for visual verification
- Use `mcp__playwright__browser_snapshot` to get page structure

## Example Output

```
Pending PTO Requests
====================

Week of July 27 - August 2, 2025
---------------------------------
1. Jack Butler: August 1, 2025 (Friday) - 11:00am-7:00pm
2. Philip Fulcher: August 1, 2025 (Friday) - 11:00am-7:00pm
3. Steven Nance: August 1, 2025 (Friday) - 3:00am-11:00am

Week of August 3 - August 9, 2025
----------------------------------
1. Nicholas Cunningham: August 5, 2025 (Tuesday) - 11:00am-7:00pm
2. Louie Weng: August 5, 2025 (Tuesday) - 12:00pm-8:00pm
3. Rares Matei: August 7, 2025 (Thursday) - 4:00pm-12:00am (midnight)
4. Nicole Oliver: August 8, 2025 (Friday) - 12:00pm-8:00pm

Report generated on: 2025-08-01
```