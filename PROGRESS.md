# Search SPA Requirements

Build a Single Page web app, using the same tech stack and Docker/NGINX deployment configurations 
as [stage0_mongodb_spa](https://github.com/agile-learning-institute/stage0_mongodb_spa).
Implement the same Dockerfile, docker-push, npm, and NGINX configurations. 
Start with a copy of the stage0_mongodb_spa /admin page - and the same /api/config endpoint for data on that page. 
We will be using the stage0_search_api - review the
 [openapi specifications](https://github.com/agile-learning-institute/stage0_search_api/blob/main/docs/openapi.yaml) 
 before starting

Page routes
- / the default route should forward to /search
- /search is a very simple, full width, search page. 
    - There is a search input field at the top for full text search.
    - Advance search is out of scope for now.
    - Will need a link to the admin page.
    - The list of index cards is displayed in the order provided by the API
    - Index card content will vary by collection_name but should be only key fields.
    - Index cards will have a details link to a different SPA based on collection_name.
    - Links will be based on /config CI *COLLECTION*_SPA_HOST values for each collection. 
- /admin page will add a button to sync, after sync API call, the UI forwards to /synced
- /admin page will also add a link to /synced
- /admin page will have a button/popup to set periodicity
- /admin page should create an SPA Config section styled like the CI, Enumerators, etc block's with the Built At and buttons
- /synced page will list sync history - with auto-scroll pagination

Style Guide

Follow the style used by the /admin page in stage0_mongodb_spa

API Calls

With the exception of the /admin use of /api/config data that is loaded at startup, each page will fetch data from the API when the page is loaded. 

Note that /search and /synced are paginated API endpoints - implement auto-scroll fetches.

# Code Generation Plan / Progress