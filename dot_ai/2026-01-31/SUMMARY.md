# Summary - 2026-01-31

## Completed Tasks

### Google Apps Script PTO Calendar Fix

**Project:** `/Users/jack/projects/gcal/script.js`

**Problems Fixed:**

1. **Timezone Handling Issues**
   - Removed brittle manual offsets (`+5h` for US, `+8h` for Europe) that caused inconsistent date display
   - Fixed bug where end time displayed before start time (e.g., "4:00 PM UTC to 3:00 PM UTC")
   - Implemented consistent UTC formatting for all dates/times
   - Properly handled multi-day all-day events (end time is exclusive midnight, so subtract 1 day)

2. **Presentation Improvements**
   - Grouped events by person (previously each event was a separate entry)
   - Merged consecutive days into date ranges (e.g., "Mon, Feb 2 - Fri, Feb 6")
   - Separated holidays into their own section at the top
   - Added new message format with emojis and better structure

**New Helper Functions:**
- `isHolidayEvent(title)` - Detects holidays by region prefix (US:, CA:, All:, etc.)
- `extractPersonName(title)` - Parses person name from event title
- `extractPtoType(title)` - Parses PTO type from parentheses
- `formatDateUTC(date)` / `formatTimeUTC(date)` - Consistent UTC formatting
- `groupEventsByPerson(events)` - Groups and classifies events
- `mergeDateRanges(dates)` - Consolidates consecutive all-day events

**New Output Format:**
```
📅 *PTOs This Week - Jan 31 - Feb 6*

🏛️ *Holidays*
• US: Martin Luther King Jr. Day - Mon, Jan 20

👤 *Out of Office*
• *Cory H.* - Vacation - US
  Fri, Feb 6
• *Miroslav J.* - Vacation - Europe
  Mon, Feb 2 - Fri, Feb 6
• *Nicole O.* - 5yr Vacation 2.0
  Fri, Feb 6
```

**Key Fix for Multi-Day Events:**
The original code treated each calendar event as a single date. Multi-day all-day events (like Miroslav's Feb 2-6 vacation) are actually ONE event spanning multiple days. Fixed by detecting `durationDays > 1` and storing as a range with `isMultiDay: true`.
