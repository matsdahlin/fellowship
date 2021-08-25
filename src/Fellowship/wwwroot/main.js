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
 */

/**
 * function to bootstrap start of application
 */
async function startApp() {
  try {
    /**
     * @type {AppState}
     */
    const initialState = {
      consultants: [],
    };

    const consultants = await fetch('/consultants')
      .then((data) => data.json())
      .then((json) => json);

    initialState.consultants = consultants;
    const appDomElement = initializeApp(initialState);
    renderConsultants(initialState.consultants, appDomElement);
  } catch {
    renderErrorMessage(document.getElementById('cards-container'));
  }
}

/**
 * initialize the app
 * @param {Array.<Consultant>} state - consultant state
 * @return {HTMLElement} app DOM element
 */
function initializeApp(state = { consultants: [] }) {
  const appElement = document.getElementById('cards-container');

  function filterConsultants(propertyName, filterQuery) {
    return state.consultants.filter((consultant) => {
      return consultant[propertyName].toLowerCase().includes(filterQuery.toLowerCase());
    });
  }

  // Filter names
  const inputElement = document.getElementById('filter-input');
  inputElement.addEventListener('keyup', (e) => {
    const filtered = filterConsultants('name', e.currentTarget.value);
    updateConsultants(filtered, appElement);
  });

  // Filter locations
  const filterLocationsElement = document.getElementById('filter-locations');
  const locations = state.consultants.map((consultant) => {
    const locationTrimmed = consultant.location
      .substring(consultant.location.lastIndexOf(' ') + 1)
      .toLowerCase();
    return locationTrimmed;
  });
  const uniqueLocations = new Set(locations);

  uniqueLocations.forEach((location) => {
    const element = document.createElement('button');
    element.textContent = location;
    element.classList.add('filter-location-button');
    element.addEventListener('click', (e) => {
      const allFilterButtons = document.querySelectorAll('.filter-location-button');
      allFilterButtons.forEach((filterButton) => filterButton.classList.remove('active'));
      element.classList.add('active');

      console.log('c', state.consultants);
      const filteredConsultants = filterConsultants('location', location);
      updateConsultants(filteredConsultants, appElement);
    });
    filterLocationsElement.appendChild(element);
  });

  return appElement;
}

/**
 * render a list of consultants to a specified DOM element
 * @param {Array.<Consultant>} consultants - array of consultant objects
 * @param {HTMLElement} domElement - DOM element to render to
 */
function renderConsultants(consultants, domElement) {
  if (consultants.length === 0) {
    renderErrorMessage(domElement, 'Inga träffar :(');
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

const updateConsultants = debounce(renderConsultants);

/**
 * render an error message to a specified DOM element
 * @param {HTMLElement} domElement - DOM element to render to
 * @param {string} message - message to render
 */
function renderErrorMessage(domElement, message = 'Oops! Något gick något fel.') {
  domElement.innerHTML = `
    <h2 data-cy="error-message">${message}</h2> 
  `;
}

/**
 * delay a function
 */
function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

startApp();
