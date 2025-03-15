# Arborously - Specification

Arborously is browser extension that automatically generates standardized git branch names from ticket information across various ticketing systems. Starting with Trello and GitHub Issues support then expanding to other platforms like Jira, Bugzilla and others. The extension will help developers maintain consistent branch naming conventions without manual effort.

## High-Level Description

The Git Branch Generator will detect when you're viewing a ticket in a supported ticketing system, extract relevant information, and generate a git branch name according to customizable templates. Users can configure their preferences including username, preferred branch prefixes, and naming patterns. The extension will appear as a small icon in the browser toolbar.

## Functional Requirements

### Core Features

1. **Ticket Integration**

   - Parse Trello card information (ID, title, labels)
   - Extract relevant metadata from the current card
   - Support for detecting when user is viewing a Trello card

2. **Branch Name Generation**

   - Provide configurable templating system for branch name patterns
   - Support variables like `${id}`, `${title}`, `${username}`, `${tag}`
   - Sanitize inputs (replace spaces with hyphens, remove special characters)
   - Enforce max length limits for git branch names

3. **User Configuration**

   - Store and retrieve username
   - Manage predefined tags (feat, fix, chore, docs, style, refactor, test, etc.)
   - Save multiple templates for different projects or workflows
   - Default template configuration

4. **User Interface**
   - Popup interface when clicking extension icon
   - Preview of generated branch name
   - One-click copy to clipboard functionality

## Non-Functional Requirements

1. **Technology Stack**

   - Use WXT (https://wxt.dev/) Web Extension Framework
   - TypeScript for all development
   - Modular architecture to support future ticketing systems

2. **Performance**

   - Extension should not noticeably impact page load times
   - Branch name generation should be instantaneous
   - Minimal memory footprint

3. **Security & Privacy**

   - Store user preferences in local browser storage only
   - Request minimal permissions required for functionality

4. **Portability**
   - Cross-browser compatibility (Chrome, Firefox, Edge)

## Domain Requirements

1. **Templating System**

   - Support for common git branch naming patterns:
     - `${tag}/${id}-${title}`
     - `${username}/${tag}/${title}`
     - `${tag}/issue-${id}`
   - Variables should be enclosed in `${}` syntax
   - Special functions like `lowercase()`, `truncate(n)` for formatting

2. **Tag Management**

   - Predefined list of common tags: feature, fix, chore, docs, style, refactor, test
   - Ability to add, remove, or customize tags
   - Option to set default tag for different ticket types

3. **String Transformation**

   - Convert spaces to hyphens or underscores (configurable)
   - Remove special characters not allowed in git branch names
   - Automatically truncate long titles to reasonable length
   - Convert to lowercase by default (configurable)

4. **Trello Integration**
   - Parse card ID from URL pattern
   - Extract card title, labels, and other metadata
   - Detect card type based on labels or lists to suggest appropriate tags

## Implementation Approach

This MVP will focus on providing a reliable, user-friendly experience for Trello and GitHub users while establishing a foundation that can be expanded to other ticketing systems in future releases.