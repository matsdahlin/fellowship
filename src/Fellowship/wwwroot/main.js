// Application DOM elements
const appElement = document.getElementById('app');
const cardsContainerElement = document.getElementById('cards-container');
const filterLocationsElement = document.getElementById('filter-locations');

/**
 * A consultant / ninja
 * @typedef {Object} Consultant
 * @property {string} name - name of consultant
 * @property {string} slug - a unique slug for the consultant
 * @property {string} location - office location
 * @property {string} imageUrl - URL to image
 */

/**
 * App state
 * @typedef {Object} AppState
 * @property {Array.<Consultant>} consultants - array of consultant objects
 * @property {string} filter
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
  attachLocationFilterHandlers(state);

  return state;
}

/**
 * Application render function.
 * Filters consultants based on the current state of the application.
 * @param {AppState} state - application state to render
 */
function renderApplication(state) {
  const filteredConsultants = state.consultants.filter((consultant) => {
    return (
      keepConsultant(consultant, 'name', state.filters.name) &&
      keepConsultant(consultant, 'location', state.filters.location)
    );
  });

  renderConsultants(filteredConsultants, cardsContainerElement);
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
 * @param {AppState} state - application state
 */
function attachFilterInputHandlers(state) {
  const inputElement = document.getElementById('filter-input');
  inputElement.addEventListener('keyup', (e) => {
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
    element.addEventListener('click', () => {
      const allFilterButtons = document.querySelectorAll('.filter-location-button');
      allFilterButtons.forEach((filterButton) => filterButton.classList.remove('active'));
      element.classList.add('active');

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
