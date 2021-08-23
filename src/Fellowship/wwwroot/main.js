async function startApp() {
  try {
    const consultantsState = await fetch('/consultants')
      .then((data) => data.json())
      .then((json) => json);

    const appDomElement = initializeApp(consultantsState);
    renderConsultants(consultantsState, appDomElement);
  } catch {
    renderErrorMessage(document.getElementById('cards-container'));
  }
}

function initializeApp(state = []) {
  const appElement = document.getElementById('cards-container');
  const inputElement = document.getElementById('filter-input');
  const filterButton = document.getElementById('filter-button');

  const updateConsultants = debounce(renderConsultants);
  function filterConsultants(filterQuery) {
    return state.filter((consultant) => {
      return consultant.name.toLowerCase().includes(filterQuery.toLowerCase());
    });
  }

  // Typing handler
  inputElement.addEventListener('keyup', (e) => {
    const filtered = filterConsultants(e.currentTarget.value);
    updateConsultants(filtered, appElement);
  });

  // Filter button handler
  filterButton.addEventListener('click', () => {
    const filterQuery = document.getElementById('filter-input').value;
    const filtered = filterConsultants(filterQuery);
    renderConsultants(filtered, appElement);
  });

  return appElement;
}

function renderConsultants(consultants, domElement) {
  if (consultants.length === 0) {
    domElement.innerHTML = '<h2 data-cy="error-message">Inga träffar :(</h2>';
    return;
  }

  domElement.innerHTML = '';
  consultants.forEach((consultant, index) => {
    const htmlTemplate = `
      <div class="ninja-image-container">
        <img class="ninja-image" loading="lazy" src="${consultant.imageUrl}" alt="${consultant.name}" />
      </div>
      <article class="ninja-info">
        <span data-cy="ninja-name">${consultant.name}</span>
        <span>Office: ${consultant.location}</span>
      </article>
  `;

    const consultantNode = document.createElement('article');
    consultantNode.classList.add('ninja-card');
    consultantNode.setAttribute('tabindex', 0);
    consultantNode.innerHTML = htmlTemplate;

    domElement.appendChild(consultantNode);
  });
}

function renderErrorMessage(domElement) {
  domElement.innerHTML = `
    <h2 data-cy="error-message">Tyvärr, något gick fel</h2> 
  `;
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

startApp();
