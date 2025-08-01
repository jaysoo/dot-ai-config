# PTO Summarize

This command analyzes PTO (Paid Time Off) data from a Google Calendar and generates comprehensive reports for engineering team members.

## What this command does

This command uses Playwright MCP to:
1. Navigate to a Google Calendar embed URL
2. Traverse through multiple months to collect PTO event data
3. Filter the data to only include engineering team members
4. Generate detailed analysis reports with monthly breakdowns
5. Create summary insights and recommendations

## Prerequisites

- Playwright MCP must be installed and configured
- Access to the Google Calendar URL
- A list of engineering team members for filtering

## Usage

When asked to analyze PTO data from a calendar, follow these steps:

### 1. Initial Setup

Navigate to the Google Calendar URL provided by the user. The URL typically looks like:
```
https://calendar.google.com/calendar/embed?src=CALENDAR_ID&ctz=TIMEZONE
```

### 2. Data Collection Process

1. **Start with the current view** and take a snapshot to see the calendar layout
2. **Navigate backwards** month by month using the "Previous month" button
3. **Collect PTO events** from each month, including:
   - Person's name
   - Date ranges (for multi-day events)
   - Single dates (for single-day events)
   - Type of leave (if specified: Vacation, Sick, Parental, Bereavement, etc.)

### 3. Engineering Team Filtering

Filter the collected data to only include engineering team members. The engineering team list should be provided or confirmed with the user. Example:

```javascript
const engineeringTeam = [
  'Altan', 'Benjamin', 'Caleb', 'Chau', 'Colum', 'Craigory', 
  'Emily', 'Jack', 'James', 'Jason', 'Jonathan', 'Leo', 
  'Leosvel', 'Louie', 'Mark', 'Max', 'Nicholas', 'Nicole', 
  'Patrick', 'Rares', 'Steve', 'Victor'
];
```

### 4. Analysis Script Structure

Create an analysis script (`analyze-pto-[timeframe].mjs`) that:

1. **Defines the PTO data structure** organized by month
2. **Implements filtering** to only count engineering team members
3. **Calculates unique PTO days** per person (avoiding double-counting)
4. **Generates monthly breakdowns** showing distribution across months
5. **Outputs results** in both console and JSON format

Example structure:
```javascript
const ptoData = {
  january: {
    events: [
      { person: "Name", dates: ["2025-01-02", "2025-01-03"] },
      // ... more events
    ]
  },
  // ... more months
};
```

### 5. Output Formats

Generate multiple output files:

1. **JSON Results File** (`pto-analysis-results.json`):
   - Monthly totals
   - Per-person breakdowns with dates
   - Timestamp of generation

2. **Summary Markdown** (`pto-summary-YYYY.md`):
   - Executive summary with key metrics
   - Monthly trends and patterns
   - Top PTO users
   - Insights and recommendations
   - Coverage considerations

### 6. Key Metrics to Track

- **Total PTO days** across the period
- **Monthly distribution** (which months have highest/lowest usage)
- **Per-person totals** with monthly breakdown
- **Average PTO per person**
- **Leave type distribution** (vacation, sick, parental, etc.)
- **Peak usage periods** for planning purposes

## Example Output Format

When presenting results, show:

```
PTO Analysis for [Time Period] (Engineering Team Only)
=====================================================

Monthly PTO Day Totals (person-days):
January: X PTO days
February: Y PTO days
...

Total: Z PTO days

PTO Days by Person (with monthly breakdown):
===========================================
Person A: 18 days (2 Jan, 16 Jul)
Person B: 15 days (5 Mar, 10 Jun)
...
```

## Additional Considerations

1. **Half-day Events**: Note events that show specific times (not "All day")
2. **Multi-day Events**: Properly expand date ranges into individual dates
3. **Duplicate Handling**: Use Sets to avoid counting the same person-day twice
4. **Non-working Days**: Consider whether weekends should be included
5. **Data Validation**: Verify collected data looks reasonable (no extremely high counts)

## Error Handling

- If the calendar doesn't load, check the URL and permissions
- If navigation fails, try waiting for page elements to load
- If data seems incomplete, verify you've collected all visible events
- For months with "X more events" buttons, ensure all events are visible

## Tips for Accurate Analysis

1. **Use TodoWrite** to track progress through months
2. **Take snapshots** before collecting data from each month
3. **Verify engineering list** is complete and up-to-date
4. **Check for edge cases** like events spanning month boundaries
5. **Validate totals** by spot-checking a few individuals

This command is particularly useful for:
- Capacity planning
- Understanding PTO patterns
- Identifying peak vacation periods
- Ensuring adequate team coverage
- HR reporting and analytics