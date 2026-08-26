
# Profile & Settings

---

# Screen Overview

The Profile & Settings module allows users to manage their personal account information, security settings, notification preferences, and application preferences.

This screen is user-specific and does not require administrative privileges.

The interface should be clean, intuitive, and aligned with the overall MQMS design language.

---

# Primary Users

- Quality Engineer
- Quality Manager
- Plant Manager
- Auditor
- Administrator
- Super Administrator

---

# Screen Goals

- View personal information
- Update profile details
- Change password
- Configure notification preferences
- Manage security settings
- Customize application preferences

---

# Navigation

Profile & Settings

---

# Page Header

## Title

Profile & Settings

## Subtitle

Manage your account, security, and application preferences.

---

# Layout

Two-column layout.

## Left Navigation

- My Profile
- Security
- Notifications
- Preferences
- Activity Log

## Right Panel

Selected settings content.

Default selection

My Profile

---

# Module 1

## My Profile

Display user information.

---

### Profile Card

Display

- Profile Photo
- Full Name
- Employee ID
- Role
- Plant
- Department
- Reporting Manager

---

### Personal Information

Fields

- Full Name
- Email Address
- Mobile Number
- Employee ID (Read Only)
- Designation
- Department
- Plant
- Region

Buttons

- Cancel
- Save Changes

---

# Module 2

## Security

Purpose

Allow users to manage account security.

---

### Change Password

Fields

- Current Password
- New Password
- Confirm Password

Password Policy

- Minimum 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

Button

Update Password

---

### Multi-Factor Authentication

Status

Enabled / Disabled

Button

Enable MFA

---

### Active Sessions

Display

- Device
- Browser
- Login Time
- IP Address
- Location

Actions

- Logout Current Session
- Logout All Devices

---

# Module 3

## Notifications

Purpose

Configure personal notification preferences.

---

### Notification Channels

- Email
- In-App Notifications

Future (Disabled)

- SMS
- Microsoft Teams
- Slack

---

### Notification Events

Toggle switches

- Audit Assigned
- Audit Updated
- Investigation Started
- Investigation Completed
- Audit Closed
- Daily Summary
- Weekly Report
- System Announcements

Buttons

Save Preferences

---

# Module 4

## Preferences

Purpose

Customize application experience.

---

### Language

Dropdown

- English

Future

- Hindi
- Tamil
- Kannada
- Telugu

---

### Date Format

Dropdown

Examples

- DD/MM/YYYY
- MM/DD/YYYY
- YYYY-MM-DD

---

### Time Format

Dropdown

- 12 Hour
- 24 Hour

---

### Time Zone

Dropdown

Default

Asia/Kolkata

---

### Theme

Radio Buttons

- Light
- Dark
- System Default

---

### Dashboard Landing Page

Dropdown

- Dashboard
- Audit List
- Reports

---

Button

Save Preferences

---

# Module 5

## Activity Log

Purpose

Display recent account activity.

---

### Activity Timeline

Columns

- Date
- Activity
- Device
- IP Address

Examples

- Logged In
- Password Changed
- Profile Updated
- Notification Preferences Updated
- Logged Out

---

# Search

Not Required

---

# Empty State

Illustration

Profile Illustration

Title

No activity available.

Message

Your recent account activity will appear here.

---

# Loading State

Display skeleton loaders.

---

# Error State

Title

Unable to load profile.

Message

Please try again later.

Button

Retry

---

# Confirmation Dialogs

## Change Password

Title

Update Password?

Buttons

- Cancel
- Update

---

## Logout All Devices

Title

Logout from all devices?

Message

You will be required to sign in again on every device.

Buttons

- Cancel
- Logout

---

# Validation

Required Fields

- Full Name
- Email
- Mobile Number

Password Validation

- Must follow password policy
- New password cannot match current password

---

# Responsive Behavior

Desktop

- Two-column layout
- Fixed left navigation
- Scrollable content area

iPad Browser

- Left navigation collapses into a drawer
- Forms stack vertically

---

# Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Visible focus states
- Accessible form controls
- Minimum 44px touch targets

---

# Visual Design Guidelines

Maintain consistency with all approved MQMS screens.

Design Style

- Enterprise SaaS
- Minimal interface
- Rounded cards
- Soft shadows
- High information density
- Blue primary buttons
- Semantic status indicators
- Tailwind CSS friendly
- shadcn/ui inspired

Do not redesign the application shell.

---

# Future Enhancements

- Profile Photo Upload
- Digital Signature
- Biometric Login
- Face ID / Fingerprint Support
- Microsoft Entra ID Integration
- Google SSO
- API Token Management
- Personal Dashboard Customization
- Notification Quiet Hours
- Preferred Landing Workspace