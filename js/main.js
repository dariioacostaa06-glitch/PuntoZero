document.addEventListener('DOMContentLoaded', () => {
    // ---- Efecto 3D Interactivo del Logo ----
    const heroSection = document.getElementById('hero');
    const logo3D = document.getElementById('logo-3d');
    
    if (heroSection && logo3D) {
        heroSection.addEventListener('mousemove', (e) => {
            // Dimensiones y posici├│n de la secci├│n Hero
            const rect = heroSection.getBoundingClientRect();
            
            // Calcular cu├íl es el centro de la secci├│n interactiva
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Posici├│n relativa del rat├│n respecto al centro
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // C├ílculo de la rotaci├│n (-20 a 20 grados m├íximo)
            const rotateX = -((mouseY - centerY) / centerY) * 20; 
            const rotateY = ((mouseX - centerX) / centerX) * 20;
            
            // Aplicar transformaci├│n 3D
            logo3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset al salir el rat├│n
        heroSection.addEventListener('mouseleave', () => {
            logo3D.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // ---- Men├║ Mobile Toggle ----
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-active');
        });
    }
    
    // ---- A├▒o actual din├ímico para el Footer ----
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
