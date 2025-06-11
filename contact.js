// Initialisation de Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour ouvrir WhatsApp avec confirmation
function openWhatsApp() {
    const message = encodeURIComponent("Bonjour Marie, je souhaite vous contacter à propos de votre blog.");
    const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${message}`;
    
    // Afficher une confirmation avant d'ouvrir WhatsApp
    if (confirm('Vous allez être redirigé vers WhatsApp. Voulez-vous continuer ?')) {
        try {
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            showNotification('Redirection vers WhatsApp...', 'info');
        } catch (error) {
            showNotification('Impossible d\'ouvrir WhatsApp. Veuillez vérifier que l\'application est installée.', 'error');
        }
    }
}

// Fonction pour ouvrir l'email avec confirmation
function openEmail() {
    const subject = encodeURIComponent("Contact depuis le blog");
    const body = encodeURIComponent("Bonjour Marie,\n\nJe souhaite vous contacter à propos de votre blog.");
    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${subject}&body=${body}`;
    
    // Afficher une confirmation avant d'ouvrir le client mail
    if (confirm('Vous allez être redirigé vers votre client mail. Voulez-vous continuer ?')) {
        try {
            // Créer un lien temporaire pour gérer l'ouverture du client mail
            const mailtoLink = document.createElement('a');
            mailtoLink.href = mailtoUrl;
            mailtoLink.style.display = 'none';
            document.body.appendChild(mailtoLink);
            mailtoLink.click();
            document.body.removeChild(mailtoLink);
            
            showNotification('Ouverture de votre client mail...', 'info');
        } catch (error) {
            showNotification('Impossible d\'ouvrir le client mail. Veuillez vérifier votre configuration.', 'error');
        }
    }
}

// Fonction pour ouvrir la modal de contact
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer la modal de contact
function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Fonction pour envoyer un message via Supabase
async function sendMessage(formData) {
    try {
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    created_at: new Date().toISOString(),
                    status: 'new'
                }
            ]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        return { success: false, error: error.message };
    }
}

// Fonction pour afficher une notification avec différents types
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    }[type] || 'bg-green-500';
    
    notification.className = `notification ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`;
    notification.textContent = message;
    
    // Ajouter une icône selon le type
    const icon = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    }[type] || '✓';
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Amélioration de la gestion des erreurs pour le formulaire
document.getElementById('modal-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        
        const formData = {
            name: document.getElementById('modal-name').value.trim(),
            email: document.getElementById('modal-email').value.trim(),
            message: document.getElementById('modal-message').value.trim()
        };

        // Validation basique
        if (!formData.name || !formData.email || !formData.message) {
            throw new Error('Veuillez remplir tous les champs du formulaire.');
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            throw new Error('Veuillez entrer une adresse email valide.');
        }

        const result = await sendMessage(formData);

        if (result.success) {
            showNotification('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
            e.target.reset();
            closeContactModal();
        } else {
            throw new Error(result.error || 'Une erreur est survenue lors de l\'envoi du message.');
        }
    } catch (error) {
        showNotification(error.message || 'Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});

// Fermer la modal en cliquant en dehors
document.getElementById('contact-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeContactModal();
    }
});

// Fermer la modal avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeContactModal();
    }
}); 