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
        
        // --- INICIALIZACIÓN MEGA MENÚ THREE.JS ---
        if (typeof THREE !== 'undefined') {
            const scenes = [];
            
            function initCardScene(containerId, setupGeometries) {
                const container = document.getElementById(containerId);
                if (!container) return;
                
                const scene = new THREE.Scene();
                // Fondo claro acorde a .mega-menu-visual (#f7f7f7)
                scene.background = new THREE.Color(0xf7f7f7);
                
                const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
                camera.position.z = 5;
                
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                renderer.setPixelRatio(window.devicePixelRatio);
                container.appendChild(renderer.domElement);
                
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                scene.add(ambientLight);
                
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
                directionalLight.position.set(2, 5, 3);
                scene.add(directionalLight);
                
                const objects = setupGeometries(scene);
                
                scenes.push({ scene, camera, renderer, objects, container });
            }
            
            const matDark = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
            const matGray = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.5 });
            
            // Visual 1: Web Modeling (Composición geométrica básica)
            initCardScene('canvas-serv-1', (scene) => {
                const group = new THREE.Group();
                const box1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.2), matDark);
                box1.position.set(0, 0.8, 0);
                const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1, 0.2), matGray);
                box2.position.set(-0.4, 0, 0);
                const box3 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1, 0.2), matGray);
                box3.position.set(0.4, 0, 0);
                group.add(box1, box2, box3);
                scene.add(group);
                return group;
            });
            
            // Visual 2: Web Development (Estructura en capas/nodos)
            initCardScene('canvas-serv-2', (scene) => {
                const group = new THREE.Group();
                const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.1, 16, 50), matDark);
                ring1.rotation.x = Math.PI / 2;
                const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 16, 50), matGray);
                ring2.rotation.x = Math.PI / 2;
                const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), matDark);
                group.add(ring1, ring2, sphere);
                scene.add(group);
                return group;
            });
            
            // Visual 3: 3D Printing (Objeto modelado en base circular)
            initCardScene('canvas-serv-3', (scene) => {
                const group = new THREE.Group();
                const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.1, 32), matGray);
                base.position.y = -0.5;
                const core = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), matDark);
                core.position.y = 0;
                group.add(base, core);
                scene.add(group);
                return group;
            });
            
            // Animación continua y controlada
            function animateMenu() {
                requestAnimationFrame(animateMenu);
                scenes.forEach(({ scene, camera, renderer, objects }) => {
                    if (objects) {
                        objects.rotation.y += 0.01;
                        objects.rotation.x += 0.005;
                    }
                    renderer.render(scene, camera);
                });
            }
            animateMenu();
            
            // Reflow responsable de WebGL containers
            window.addEventListener('resize', () => {
                scenes.forEach(({ camera, renderer, container }) => {
                    const width = container.clientWidth;
                    const height = container.clientHeight;
                    if (width > 0 && height > 0) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                });
            });
        }
    }
    
    // ---- A├▒o actual din├ímico para el Footer ----
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
