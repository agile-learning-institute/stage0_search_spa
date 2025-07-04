# Search SPA Requirements

Build a Single Page web app, using the same tech stack and Docker/NGINX deployment configurations 
as [stage0_mongodb_spa](../stage0_mongodb_spa/). Implement the same Dockerfile, build-and-push, npm, and NGINX configurations. Start with a copy of the stage0_mongodb_spa /admin page - and use the same /api/config endpoint for data on that page. We will be using the stage0_search_api - review the
[@openapi.yaml](../stage0_search_api/docs/openapi.yaml) before starting

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
- /admin page should create an SPA Config section styled like the CI, Enumerators, etc block's with the Built At and buttons. Make the sections collapsible 
- /synced page will list sync history - with auto-scroll pagination

Style Guide

Follow the style used by the /admin page in stage0_mongodb_spa

API Calls

With the exception of the /admin use of /api/config data that is loaded at startup, each page will fetch data from the API when the page is loaded. 

Note that /search and /synced are paginated API endpoints - implement auto-scroll fetches.

# Code Generation Plan / Progress

## Phase 1: Project Setup and Foundation ✅ COMPLETED

**Goal**: Set up the basic project structure with the same tech stack as MongoDB SPA

**Steps Completed**:
1. ✅ Copied and adapted the MongoDB SPA project structure
2. ✅ Set up package.json with Vue 3, Vuetify, TypeScript, and Vite
3. ✅ Configured Dockerfile, nginx.conf, and build scripts
4. ✅ Set up basic routing structure with /search, /admin, and /synced routes
5. ✅ Created API client for search API endpoints
6. ✅ Created TypeScript type definitions
7. ✅ Created basic page components (SearchPage, AdminPage, SyncedPage)
8. ✅ Created SearchResultCard component with collection-specific layouts
9. ✅ Created config composable for API configuration management

**Files Created**:
- `package.json` - Project dependencies and scripts
- `Dockerfile` - Multi-stage build configuration
- `nginx.conf` - Nginx configuration with API proxy
- `start.sh` - Container startup script
- `index.html` - Main HTML template
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` & `tsconfig.node.json` - TypeScript configuration
- `src/main.ts` - Vue app entry point
- `src/App.vue` - Main app component
- `src/plugins/vuetify.ts` - Vuetify configuration
- `src/router/index.ts` - Vue Router configuration
- `src/utils/api.ts` - API client for search API
- `src/utils/buildInfo.ts` - Build information utility
- `src/types/index.ts` - TypeScript type definitions
- `src/composables/useConfig.ts` - Config management composable
- `src/pages/SearchPage.vue` - Search interface page
- `src/pages/AdminPage.vue` - Admin management page
- `src/pages/SyncedPage.vue` - Sync history page
- `src/components/SearchResultCard.vue` - Search result card component

## Phase 2: Core Pages Implementation ✅ COMPLETED

**Goal**: Implement the three main pages with full API integration and infinite scroll

**Steps Completed**:
1. ✅ Integrated search API with infinite scroll on Search page (Intersection Observer)
2. ✅ Displayed results using collection-specific cards
3. ✅ Implemented error/loading states and navigation to Admin
4. ✅ Fetched and displayed config data on Admin page
5. ✅ Implemented sync-all and periodicity controls on Admin page
6. ✅ Linked Admin page to Synced page
7. ✅ Fetched sync history with infinite scroll on Synced page
8. ✅ Displayed sync results in a paginated, scrollable list
9. ✅ Navigation between all main pages

## Phase 3: Advanced Features & Polish ✅ COMPLETED

**Goal**: Complete the remaining requirements and polish the UI/UX

**Steps Completed**:
1. ✅ **Collection-specific detail links** - Implemented navigation using config `*COLLECTION*_SPA_HOST` values
2. ✅ **UI/UX Polish** - Enhanced with Material Design guidelines and MongoDB SPA styling
3. ✅ **Error handling improvements** - Added comprehensive error states and user feedback
4. ✅ **Loading states** - Implemented skeleton loaders and better loading indicators
5. ✅ **Success feedback** - Added success messages for sync operations
6. ✅ **Infinite scroll** - Implemented for both search results and sync history
7. ✅ **Responsive design** - Mobile-friendly layout with proper grid system
8. ✅ **Navigation improvements** - Better routing between pages with proper back buttons

**Key Features Implemented**:
- **Detail Links**: Search result cards now use config data to navigate to appropriate SPAs
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Loading States**: Skeleton loaders and progress indicators for better UX
- **Success Feedback**: Toast notifications for successful operations
- **Infinite Scroll**: Smooth auto-loading for both search and sync history
- **Material Design**: Consistent styling following Material Design guidelines

**Next Phase**: Phase 4 - Testing & Final Polish