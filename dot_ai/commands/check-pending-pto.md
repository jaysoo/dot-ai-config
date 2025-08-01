# Check Pending PTO Requests

This command checks for pending PTO requests in the Wagepoint calendar for the current week and next week, then saves them to a text file.

## Process

1. **Navigate to Calendar**
   - Go to https://people.wagepoint.com/nrwl/calendar
   - If redirected to login, sign in first

2. **Enable Pending PTO Filter**
   - Click the "Pending PTO requests" button in the top bar
   - Click "Pending PTO requests" checkbox in the "Show" section of the filter menu
   - Click outside the menu to close it

3. **Identify Pending Requests**
   - **Pending requests**: Light background with border (has `.is-pending` class)
   - **Approved requests**: Solid dark teal/green background
   - Click on individual requests to see details panel with exact dates

4. **Check Current Week**
   - Note the week range displayed (e.g., "Jul 27 - Aug 2, 2025")
   - Identify all pending requests
   - Record employee name and date range for each

5. **Check Next Week**
   - Click the right arrow (>) in the week navigation control
   - Repeat the identification process for the new week

6. **Save to File**
   - Create file named `pending_pto_YYYY_MM_DD.txt` with today's date
   - Format:
   ```
   Pending PTO Requests
   ====================

   Week of [Date Range]
   ---------------------------------
   1. [Employee Name]: [Date/Date Range] ([Day(s) of week])
   2. ...

   Week of [Date Range]
   ----------------------------------
   1. [Employee Name]: [Date/Date Range] ([Day(s) of week])
   2. ...

   Report generated on: YYYY-MM-DD
   ```

## Important Notes

- **CRITICAL**: Always provide the date range, not just times
- For partial day requests (e.g., "3:00-11:00am"), determine the date from the column position
- If details panel is blocking navigation, close it by clicking the X button
- Multi-day requests show as "X days [Date Range]"
- Single day requests need date determined from calendar position

## Playwright Selectors
- Filter button: Look for button with filter icon
- Pending checkbox: In menu under "Show" section
- Week navigation: Arrow links near date range display
- Close sidebar: X icon in details panel

## Example Output

```
Pending PTO Requests
====================

Week of July 27 - August 2, 2025
---------------------------------
1. James Henry: August 1, 2025 (Friday)
2. Joe Johnson: July 31 - August 1, 2025 (Thursday-Friday)
3. Leosvel Pérez Espinosa: July 31, 2025 (Thursday)
4. Juri Strumpflohner: August 1, 2025 (Friday)

Week of August 3 - August 9, 2025
----------------------------------
1. Miroslav Jonas: August 7, 2025 (Thursday)
2. Miroslav Jonas: August 8, 2025 (Friday)
3. Mark Lindsey: August 8, 2025 (Friday)

Report generated on: 2025-08-01
```