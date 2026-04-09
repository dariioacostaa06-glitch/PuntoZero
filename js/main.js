document.addEventListener('DOMContentLoaded', () => {
    // ---- Menú Mobile Toggle ----
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('is-active');
        });
    }

    // ---- Dropdown Servicios ----
    const btnServicios = document.getElementById('btn-servicios');
    const dropdownServicios = document.getElementById('dropdown-servicios');

    if (btnServicios && dropdownServicios) {
        // Toggle dropdown en clic al botón
        btnServicios.addEventListener('click', (e) => {
            e.preventDefault(); // Evitamos scroll abrupto temporal al abrir menú
            dropdownServicios.classList.toggle('activo');
        });

        // Click exterior para cerrar el dropdown interactivamente
        document.addEventListener('click', (e) => {
            if (!btnServicios.contains(e.target) && !dropdownServicios.contains(e.target)) {
                dropdownServicios.classList.remove('activo');
            }
        });
    }
    
    // ---- A├▒o actual din├ímico para el Footer ----
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
