let vehicles = [];
let favorites = []; // Liste des véhicules favoris

// Charger les données et afficher les véhicules
fetch('./contenu.json')
    .then(response => response.json())
    .then(data => {
        vehicles = data;
        displayVehicles(vehicles);

        // Marquer la grille comme chargée
        const vehicleGrid = document.getElementById('vehicle-grid');
        vehicleGrid.classList.add('loaded');
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));

// Fonction pour afficher les véhicules
function displayVehicles(filteredVehicles) {
    const grid = document.getElementById('vehicle-grid');
    grid.innerHTML = ''; // Effacer les véhicules existants

    filteredVehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-carousel';

        const images = Object.values(vehicle.image);
        images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = vehicle.name;
            img.className = index === 0 ? 'active' : '';
            imageContainer.appendChild(img);
        });

        card.appendChild(imageContainer);

        const title = document.createElement('h3');
        title.textContent = vehicle.name;
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = vehicle.description;
        card.appendChild(description);

        const type = document.createElement('p');
        type.textContent = `Type : ${vehicle.type}`;
        type.className = 'vehicle-type';
        card.appendChild(type);

        const tags = document.createElement('div');
        tags.className = 'vehicle-tags';
        vehicle.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tags.appendChild(tagElement);
        });
        card.appendChild(tags);

        // Ajouter le bouton Like
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
        if (favorites.includes(vehicle)) {
            likeButton.classList.add('active'); // Marquer comme favori si déjà dans la liste
        }
        likeButton.addEventListener('click', () => {
            if (favorites.includes(vehicle)) {
                favorites = favorites.filter(fav => fav !== vehicle);
                likeButton.classList.remove('active');
            } else {
                favorites.push(vehicle);
                likeButton.classList.add('active');
            }
            updateFavorites(); // Mettre à jour la section des favoris
        });
        card.appendChild(likeButton);

        grid.appendChild(card);
    });
}

// Fonction pour afficher les favoris
function updateFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = ''; // Effacer les favoris existants

    favorites.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-carousel';

        const images = Object.values(vehicle.image);
        images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = vehicle.name;
            img.className = index === 0 ? 'active' : '';
            imageContainer.appendChild(img);
        });

        card.appendChild(imageContainer);

        const title = document.createElement('h3');
        title.textContent = vehicle.name;
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = vehicle.description;
        card.appendChild(description);

        const type = document.createElement('p');
        type.textContent = `Type : ${vehicle.type}`;
        type.className = 'vehicle-type';
        card.appendChild(type);

        const tags = document.createElement('div');
        tags.className = 'vehicle-tags';
        vehicle.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tags.appendChild(tagElement);
        });
        card.appendChild(tags);

        // Ajouter le bouton Like
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button active'; // Toujours actif dans les favoris
        likeButton.innerHTML = '<i class="fa-solid fa-thumbs-up"></i>';
        likeButton.addEventListener('click', () => {
            favorites = favorites.filter(fav => fav !== vehicle);
            updateFavorites(); // Mettre à jour la section des favoris
            filterVehicles(); // Réappliquer les filtres actifs à la liste principale
        });
        card.appendChild(likeButton);

        favoritesGrid.appendChild(card);
    });
}

// Filtrer les véhicules
document.getElementById('search-bar').addEventListener('input', () => {
    filterVehicles();
    updateSuggestions();
});

document.getElementById('tag-filter').addEventListener('change', () => {
    filterVehicles();
});

document.getElementById('type-filter').addEventListener('change', () => {
    filterVehicles();
});

function filterVehicles() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const selectedTag = document.getElementById('tag-filter').value;
    const selectedType = document.getElementById('type-filter').value;

    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery);
        const matchesTag = selectedTag === '' || vehicle.tags.includes(selectedTag);
        const matchesType = selectedType === '' || vehicle.type === selectedType;

        return matchesSearch && matchesTag && matchesType;
    });

    displayVehicles(filteredVehicles);
}

// Mettre à jour les suggestions de recherche
function updateSuggestions() {
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // Effacer les suggestions existantes

    if (searchQuery) {
        const matchingVehicles = vehicles.filter(vehicle =>
            vehicle.name.toLowerCase().includes(searchQuery)
        );

        matchingVehicles.forEach(vehicle => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = vehicle.name;
            suggestionItem.addEventListener('click', () => {
                document.getElementById('search-bar').value = vehicle.name;
                filterVehicles();
                suggestions.innerHTML = ''; // Effacer les suggestions après sélection
            });
            suggestions.appendChild(suggestionItem);
        });
    }
}

// Gérer l'ouverture/fermeture du menu des favoris
document.getElementById('favorites-toggle').addEventListener('click', () => {
    const favoritesMenu = document.getElementById('favorites-menu');
    const isMenuOpen = favoritesMenu.style.display === 'block';

    if (isMenuOpen) {
        favoritesMenu.style.display = 'none'; // Masquer le menu des favoris
        filterVehicles(); // Réappliquer les filtres actifs à la liste principale
    } else {
        favoritesMenu.style.display = 'block'; // Afficher le menu des favoris
        favoritesMenu.classList.add('loaded'); // Marquer comme chargé
        updateFavorites(); // Mettre à jour la section des favoris
    }
});

// Gérer la fermeture du menu des favoris avec le bouton "X"
document.getElementById('favorites-close').addEventListener('click', () => {
    const favoritesMenu = document.getElementById('favorites-menu');
    favoritesMenu.style.display = 'none'; // Masquer le menu des favoris

    // Réappliquer les filtres actifs
    filterVehicles();
});