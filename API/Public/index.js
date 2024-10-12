function toggleFavorite(icon) {
    if (icon.classList.contains('active')) {
        icon.classList.remove('active');
        icon.innerHTML = '&#9734;'; // Estrella vacía
    } else {
        icon.classList.add('active');
        icon.innerHTML = '&#9733;'; // Estrella llena
    }
}
