// Données des articles (simulées, dans un cas réel, elles viendraient d'une API)
const articles = [
    {
        id: 1,
        title: "L'avenir du journalisme à l'ère numérique",
        excerpt: "Une réflexion approfondie sur l'évolution du métier de journaliste face aux nouvelles technologies...",
        image: "images/image1.png",
        date: "15 Mars 2024",
        category: "Journalisme"
    },
    {
        id: 2,
        title: "Les enjeux de la culture contemporaine",
        excerpt: "Analyse des tendances culturelles actuelles et leur impact sur notre société...",
        image: "images/image2.png",
        date: "10 Mars 2024",
        category: "Culture"
    },
    {
        id: 3,
        title: "Entretien avec un artiste visionnaire",
        excerpt: "Rencontre exclusive avec un artiste qui repousse les limites de la création...",
        image: "images/image.png",
        date: "5 Mars 2024",
        category: "Art"
    }
];

// Fonction pour générer les articles
function generateArticles() {
    const container = document.getElementById('articles-container');
    
    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'article-card bg-white rounded-lg shadow-lg overflow-hidden';
        articleElement.innerHTML = `
            <img src="${article.image}" alt="${article.title}" class="article-image w-full">
            <div class="p-6">
                <span class="text-sm text-purple-600 font-semibold">${article.category}</span>
                <h3 class="text-xl font-bold mt-2 mb-2">${article.title}</h3>
                <p class="text-gray-600 mb-4">${article.excerpt}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">${article.date}</span>
                    <button class="text-purple-600 hover:text-purple-800 font-semibold" onclick="readArticle(${article.id})">
                        Lire la suite →
                    </button>
                </div>
            </div>
        `;
        container.appendChild(articleElement);
    });
}

// Fonction pour gérer le menu mobile
function initMobileMenu() {
    const button = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');

    button.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// Fonction pour gérer le formulaire de contact
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulation d'envoi (dans un cas réel, on enverrait les données à un serveur)
        showNotification('Message envoyé avec succès !');
        form.reset();
    });
}

// Fonction pour afficher les notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Afficher la notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Fonction pour lire un article (simulation)
function readArticle(id) {
    const article = articles.find(a => a.id === id);
    if (article) {
        showNotification(`Ouverture de l'article : ${article.title}`);
        // Dans un cas réel, on redirigerait vers la page de l'article
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    generateArticles();
    initMobileMenu();
    initContactForm();
    
    // Ajout de la classe nav-link à tous les liens de navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.add('nav-link');
    });
}); 