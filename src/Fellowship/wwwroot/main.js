// Application DOM elements
const appElement = document.getElementById('app');
const cardsContainerElement = document.getElementById('cards-container');
const filterLocationsElement = document.getElementById('filter-locations');
const filterClearButton = document.getElementById('filter-clear-button');
const filterInputElement = document.getElementById('filter-input');

/**
 * A consultant / ninja
 * @typedef {Object} Consultant
 * @property {string} name - name of consultant
 * @property {string} slug - a unique slug for the consultant
 * @property {string} location - office location
 * @property {string} imageUrl - URL to image
 */

/**
 * Filters
 * @typedef {Object} Filters
 * @property {string} name - name of consultant to filter
 * @property {string} location - location to filter
 */

/**
 * App state
 * @typedef {Object} AppState
 * @property {Array.<Consultant>} consultants - array of consultant objects
 * @property {Filters} filters
 */

/**
 * Function to bootstrap start of application
 */
async function startApp() {
  try {
    if (!appElement || !cardsContainerElement || !filterLocationsElement) {
      throw new Error('could not find app element');
    }

    const initialState = await initializeApp();
    renderApplication(initialState);
  } catch (error) {
    console.error(error);
    renderErrorMessage('Det gick inte att ladda applikationen', document.body);
  }
}

/**
 * Initialize the app by hooking up the event handlers to the application state.
 * @returns {Promise.<AppState>} - a promise that resolves to the initial state
 */
async function initializeApp() {
  /**
   * @type {Array.<Consultant>}
   */
  const consultants = await fetch('/consultants')
    .then((data) => data.json())
    .then((json) => json);

  /**
   * @type {AppState}
   */
  const state = {
    consultants: consultants,
    filters: {
      location: '',
      name: '',
    },
  };

  attachFilterInputHandlers(state);
  attachFilterClearHandler(state);
  attachLocationFilterHandlers(state);

  return state;
}

/**
 * Application render function.
 * Filters consultants based on the current state of the application.
 * @param {AppState} state - application state to render
 */
function renderApplication({ consultants, filters }) {
  const filteredConsultants = consultants.filter((consultant) => {
    return (
      keepConsultant(consultant, 'name', filters.name) &&
      keepConsultant(consultant, 'location', filters.location)
    );
  });

  filterInputElement.value = filters.name;
  renderFilterArea(filters, filterClearButton);
  renderConsultants(filteredConsultants, cardsContainerElement);
}

/**
 * @param {Filters} filters - filters to render
 * @param {HTMLElement} domElement - DOM element to render to
 */
function renderFilterArea(filters, domElement) {
  // should render if any filter prop is non-empty
  const shouldRenderClearButton = Object.keys(filters).some((key) => filters[key] !== '');

  if (shouldRenderClearButton) {
    domElement.classList.remove('hidden');
  } else {
    domElement.classList.add('hidden');
  }

  // match location filter buttons to filter state
  const allFilterButtons = Array.from(document.querySelectorAll('.filter-location-button'));
  allFilterButtons.forEach((filterButton) => {
    if (filterButton.textContent.toLowerCase() === filters.location) {
      filterButton.classList.add('active');
    } else {
      filterButton.classList.remove('active');
    }
  });
}

/**
 * Helper function to determine if a consultant should be kept based on the filter
 * @param {Consultant} consultant - consultant to check
 * @param {string} propertyName - name of the property on the consultant to check
 * @param {string} value - value to match
 *
 * @returns {boolean} - true if the consultant should be kept, false otherwise
 */
function keepConsultant(consultant, propertyname, value) {
  return consultant[propertyname]?.toLowerCase().includes(value?.toLowerCase());
}

/**
 * Attach a handler to clear filter state
 * @param {AppState} state - application state
 */
function attachFilterClearHandler(state) {
  filterClearButton.addEventListener('click', () => {
    state.filters.name = '';
    state.filters.location = '';
    renderApplication(state);
  });
}

/**
 * @param {AppState} state - application state
 */
function attachFilterInputHandlers(state) {
  filterInputElement.addEventListener('keyup', (e) => {
    state.filters.name = e.currentTarget.value;
    renderApplication(state);
  });
}

/**
 * @param {AppState} state - application state
 */
function attachLocationFilterHandlers(state) {
  const uniqueLocations = getUniqueLocations(state.consultants);

  uniqueLocations.forEach((location) => {
    const element = document.createElement('button');
    element.textContent = location;
    element.classList.add('filter-location-button');
    element.classList.add('button');
    element.addEventListener('click', () => {
      state.filters.location = location;
      renderApplication(state);
    });
    filterLocationsElement.appendChild(element);
  });
}

/**
 * Helper function to get unique locations from a list of consultant objects
 * @param {Array.<Consultant>} consultants - array of consultant objects
 *
 * @returns {Array.<string>} - array of unique locations
 */
function getUniqueLocations(consultants) {
  const locations = consultants.map((consultant) => {
    const locationTrimmed = consultant.location
      .substring(consultant.location.lastIndexOf(' ') + 1)
      .toLowerCase();
    return locationTrimmed;
  });
  const uniqueLocations = new Set(locations);
  return uniqueLocations;
}

/**
 * render a list of consultants to a specified DOM element
 * @param {Array.<Consultant>} consultants - array of consultant objects
 * @param {HTMLElement} domElement - DOM element to render to
 */
function renderConsultants(consultants, domElement) {
  if (consultants.length === 0) {
    renderErrorMessage('Inga träffar :(', domElement);
    return;
  }

  let consultantsHTML = '';

  consultants.forEach((consultant) => {
    consultantsHTML =
      consultantsHTML +
      `
    <article class="ninja-card">
      <a href="https://tretton37.com/${consultant.slug}" class="ninja-image-container">
        <img class="ninja-image" loading="lazy" src="${consultant.imageUrl}" alt="${consultant.name}" />
      </a>
      <div class="ninja-info">
        <span data-cy="ninja-name">${consultant.name}</span>
        <span>Office: ${consultant.location}</span>
      </div>
    </article>
  `;
  });

  domElement.innerHTML = consultantsHTML;
}

/**
 * render an error message to a specified DOM element
 * @param {string} message - message to render
 * @param {HTMLElement} domElement - DOM element to render to
 */
function renderErrorMessage(message = 'Oops! Något gick något fel.', domElement) {
  domElement.innerHTML = `
    <h2 data-cy="error-message">${message}</h2> 
  `;
}

startApp();
