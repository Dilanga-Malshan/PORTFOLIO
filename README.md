# Dilanga Malshan — Portfolio

Personal portfolio for an AI & Software Engineering undergraduate and aspiring GenAI engineer.

## Features

- Responsive charcoal and lime interface, sticky navigation, and custom DM logo
- Animated project illustrations and filterable technology stack
- GitHub repository statistics and a contribution calendar with daily details
- Organization links for hiveminds-dev and nexora-neural
- LinkedIn link and an email contact form
- Reduced-motion support and keyboard-accessible controls

## Run locally

Requires Python 3; no package installation or build step is needed.

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Files

- `index.html`: page markup and CSS
- `app.js`: filters, GitHub statistics, and contribution calendar
- `portrait.jpg`: profile photograph
- `dm-logo.png`: transparent logo used by the navigation
- `thanks.html`: contact-form return page

## External services

Public repository statistics come from the GitHub REST API. Contributions come from the community-maintained GitHub Contributions API at github-contributions-api.jogruber.de, whose results can be cached for one hour. Counts reflect data returned by the service. API failures display an unavailable message.

Fonts and technology logos load from Google Fonts, Skill Icons, and Simple Icons. Internet access is required for these assets and statistics.

The contact form uses FormSubmit and routes messages to dilangamalshan15@gmail.com. The owner must click the activation email before delivery works. Activation was requested during setup; inbox delivery has not been independently verified.

## Hosting

Serve this directory with any static web host. When deploying to a different origin, update the contact form's `_next` value in `index.html` to that origin's `thanks.html` URL.

The existing hosted version is at https://dilanga-malshan-portfolio.dilangamalshan15.chatgpt.site (access depends on its sharing settings). This repository is a source export; pushing to GitHub does not automatically update that hosted site.

## Editing

Update profile text, links, and projects in `index.html`. Technology categories are in `groups` in `app.js`. GitHub API calls currently reference the `Dilanga-Malshan` username.
