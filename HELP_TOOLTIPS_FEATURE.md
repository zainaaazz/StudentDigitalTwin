# Help Tooltips Feature

## Overview
Added contextual help tooltips throughout the Student Interaction Dashboard to help users better understand each statistic and metric.

## New Component: Tooltip (`components/UI/Tooltip.js`)

### Features:
- **Hover & Click Interaction**: Shows on hover (desktop) and click (mobile)
- **Flexible Positioning**: Supports top, bottom, left, right positions
- **Responsive Design**: Max-width for readability, auto-wraps text
- **Visual Arrow**: Points to the element being described
- **InfoIcon Helper**: Pre-styled help circle icon component

### Usage:
```jsx
import { InfoIcon } from '../UI/Tooltip';

<InfoIcon tooltip="Your helpful description here" size="sm" />
```

## Tooltips Added to Student Interaction Dashboard

### Current Week Stats Section:
1. **Weekly Engagement**
   - "Percentage of active learning sessions this week compared to expected activity levels"

2. **Network Centrality**
   - "Measures how central you are in the class collaboration network. Higher values indicate more connections with peers"

3. **Participation Trend**
   - "Shows whether your participation is increasing, decreasing, or staying stable over recent weeks"

### Statistics Cards:
1. **Total Interactions**
   - "Total number of learning platform interactions including content views, forum posts, quiz attempts, and resource access"

2. **Avg Duration**
   - "Average time spent per learning session. Longer durations often indicate deeper engagement with course materials"

3. **Active Partners**
   - "Number of classmates you've actively collaborated with through discussions, group work, or peer interactions"

4. **Sessions This Week**
   - "Number of distinct learning sessions recorded this week. A session is a continuous period of platform activity"

### Risk Level Badge:
- **Risk Level**
  - "Academic risk assessment based on engagement patterns, participation levels, and performance indicators. Low=on track, Medium=needs attention, High=intervention recommended"

### Charts Section:
1. **Engagement Trends Over Time**
   - "Track your learning engagement, collaboration scores, risk levels, and session counts across recent weeks"

2. **Interaction Types**
   - "Distribution of different learning activities: content views, forum discussions, resource access, and quiz attempts"

3. **Top Interaction Partners**
   - "Classmates you interact with most frequently through collaborative activities, discussions, and group work"

4. **Weekly Session Activity**
   - "Number of learning sessions per week. Each bar represents total sessions for that week"

## Visual Design

### Tooltip Appearance:
- **Background**: Dark gray (#1F2937)
- **Text**: White, small size (text-sm)
- **Max Width**: 20rem (320px)
- **Padding**: 12px (px-3 py-2)
- **Border Radius**: rounded-lg
- **Shadow**: shadow-lg for depth
- **Arrow**: 8px rotated square matching background

### Info Icon:
- **Icon**: HelpCircle from lucide-react
- **Color**: Gray-400 (default), Gray-600 (hover)
- **Sizes**:
  - xs: 12px
  - sm: 16px (default)
  - md: 20px
- **Interaction**: Changes color on hover, cursor changes to help

## Benefits

1. **Improved User Understanding**: Clear explanations for all metrics
2. **Self-Service Help**: Users don't need external documentation
3. **Context-Aware**: Tooltips appear exactly where needed
4. **Non-Intrusive**: Doesn't clutter the UI, appears only on interaction
5. **Accessible**: Works with both mouse and touch interactions
6. **Educational**: Helps users learn about learning analytics concepts

## Technical Implementation

### State Management:
- Local useState for visibility control
- No external dependencies beyond React

### Event Handling:
- `onMouseEnter/onMouseLeave` for desktop
- `onClick` for mobile/touch devices
- Prevents propagation where needed

### Positioning Logic:
- Absolute positioning with transform for centering
- Conditional classes based on position prop
- Responsive to container boundaries

## Future Enhancements

Potential additions:
1. Add tooltips to the main Engagement Dashboard
2. Include "Learn More" links in complex tooltips
3. Add keyboard navigation support
4. Implement tooltip delay configuration
5. Add visual animations (fade in/out)
6. Create tooltip theme variants (info, warning, success)

## Accessibility Considerations

- Visual indicator (help icon) is clearly visible
- Tooltips work with both mouse and touch
- High contrast color scheme
- Readable text size
- Clear positioning