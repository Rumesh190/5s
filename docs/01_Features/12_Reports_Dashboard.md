
# Reports Dashboard

---

## Screen Overview

The Reports Dashboard provides Quality Managers, Plant Managers, and Senior Management with a consolidated view of manufacturing quality performance across all plants, departments, and audits.

This screen focuses on business intelligence and decision-making rather than operational tasks.

Users should be able to understand the overall health of manufacturing quality within 30 seconds.

---

# Primary Users

- Plant Manager
- Quality Manager
- Operations Manager
- Factory Head
- Senior Management

---

# Screen Goals

- Monitor audit performance
- Track investigation progress
- Identify recurring root causes
- Compare plant performance
- Measure SLA compliance
- Monitor overdue audits
- Export reports

---

# Navigation

Reports

---

# Page Header

## Title

Reports Dashboard

## Subtitle

Manufacturing Quality Performance & Audit Analytics

---

# Header Actions

Primary

- Export PDF
- Export Excel

Secondary

- Schedule Report

---

# Global Filters

Located directly below the page header.

Filters should refresh the dashboard dynamically.

## Date Range

Type:
Date Picker

Examples

- Today
- Last 7 Days
- Last 30 Days
- This Month
- Last Quarter
- Custom Range

---

## Region

Dropdown

Example

- All Regions
- South India
- North India
- East India
- West India

---

## Plant

Dropdown

Example

- All Plants
- Chennai Plant
- Hosur Plant
- Bengaluru Plant
- Hyderabad Plant
- Coimbatore Plant
- Mysuru Plant
- Sriperumbudur Plant

---

## Department

Dropdown

Examples

- Assembly
- Quality
- Welding
- Paint Shop
- Warehouse
- Maintenance

---

## Audit Type

Dropdown

Examples

- Process Audit
- Product Audit
- Safety Audit
- Supplier Audit
- Quality Audit

---

## Status

Dropdown

- Open
- In Progress
- Pending Review
- Closed

---

# KPI Cards

Display six KPI cards in a single row.

---

## Card 1

Title

Open Audits

Value

24

Trend

+4 from last week

Color

Blue

---

## Card 2

Title

Completed Audits

Value

182

Trend

+18 this month

Color

Green

---

## Card 3

Title

Overdue Audits

Value

8

Trend

-2 from last week

Color

Red

---

## Card 4

Title

Average Investigation Time

Value

2.8 Days

Trend

Improved by 0.4 Days

Color

Orange

---

## Card 5

Title

Critical Issues

Value

5

Trend

No Change

Color

Red

---

## Card 6

Title

Audit Closure Rate

Value

94%

Trend

+3%

Color

Green

---

# Section 1

## Audit Trend

Purpose

Show audit creation and completion trends.

Visualization

Line Chart

Metrics

- Audits Created
- Audits Closed

Timeline

Monthly

Example

Jan

Feb

Mar

Apr

May

Jun

Jul

Aug

---

# Section 2

## Root Cause Distribution

Purpose

Display the most common root causes identified from completed Five Why investigations.

Visualization

Horizontal Bar Chart

Example Categories

- Improper Training
- Machine Failure
- Material Defect
- Human Error
- Incorrect Process
- Calibration Issue
- Poor Maintenance
- Supplier Issue

---

# Section 3

## Plant Performance

Purpose

Compare quality performance across manufacturing plants.

Visualization

Comparison Cards

Each card displays

- Plant Name
- Quality Score
- Total Audits
- Open Audits
- Closed Audits

Example

Chennai Plant

Quality Score

98%

Open Audits

4

Completed

58

---

# Section 4

## Department Performance

Visualization

Table

Columns

- Department
- Total Audits
- Open
- Closed
- Avg Resolution Time
- Quality Score

Example

Assembly

42

3

39

2.1 Days

97%

---

# Section 5

## Investigation SLA

Purpose

Measure investigation completion performance.

Visualization

Donut Chart

Metrics

Completed Within SLA

88%

Missed SLA

12%

---

# Section 6

## Audit Status Distribution

Visualization

Pie Chart

Categories

Open

In Progress

Pending Review

Closed

---

# Section 7

## Severity Distribution

Visualization

Bar Chart

Categories

Critical

High

Medium

Low

---

# Section 8

## Recent Critical Audits

Visualization

Enterprise Data Table

Columns

- Audit ID
- Audit Title
- Plant
- Department
- Severity
- Owner
- Status
- Due Date

Each row should be clickable.

---

# Section 9

## Top Recurring Root Causes

Display Top 10 recurring causes.

Columns

- Root Cause
- Frequency
- Last Reported
- Affected Plant

---

# Section 10

## Recent Investigation Activity

Timeline

Examples

- Investigation Completed
- Root Cause Identified
- Audit Closed
- Corrective Action Submitted
- Verification Pending

---

# Empty State

Illustration

Analytics Illustration

Message

No reports available.

Adjust filters or create new audits.

---

# Loading State

Show skeleton loaders for

- KPI Cards
- Charts
- Tables

---

# Error State

Title

Unable to load reports

Message

Please try again later.

Button

Retry

---

# Export Options

Export as

- PDF
- Excel
- CSV

Support scheduled reports.

Examples

Daily

Weekly

Monthly

---

# Responsive Behavior

Desktop

Multi-column analytics layout.

iPad Browser

Charts stack vertically.

Filters collapse into two rows.

Tables become horizontally scrollable.

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Accessible chart labels
- High contrast charts
- Focus indicators
- Large click targets

---

# Visual Design Guidelines

Follow the existing MQMS design language.

- Enterprise SaaS
- Clean layout
- High information density
- Minimal visual noise
- Consistent spacing
- Rounded cards
- Soft shadows
- Clear typography
- Professional analytics dashboard

Maintain consistency with:

- Dashboard
- Audit List
- Create Audit
- Audit Details
- Investigation

Do not redesign the application shell.

---

# Future Enhancements

- AI-powered quality insights
- Predictive defect trends
- Plant benchmarking
- Supplier performance dashboard
- Cost of Poor Quality (COPQ)
- Pareto analysis
- Drill-down analytics
- Custom dashboards
- Saved report views
- Email report subscriptions