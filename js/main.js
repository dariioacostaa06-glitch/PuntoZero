/* =========================================================================
   PUNTOZERO - MAIN JS
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Año en el footer de Desktop
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- MODAL LOGIC ---
    const modalBackdrop = document.getElementById('service-modal-backdrop');
    const modalImg = document.getElementById('modal-img');
    const modalDesc = document.getElementById('modal-desc');
    const modalBtnWA = document.getElementById('modal-wa');
    const modalClose = document.getElementById('modal-close');
    const modalBtns = document.querySelectorAll('.service-modal-btn');

    // Mapeo dinámico de datos conceptuales
    const modalData = {
        'llaveros': {
            img: 'ejemplo_impresion.png',
            desc: 'Llaveros y merchandising técnico exclusivo para empresas.',
            planName: 'Merchandaising y llaveros personalizados'
        },
        'qrs': {
            img: 'ejemplo_qr_3d.jpg',
            desc: 'Códigos QR extruidos funcionales para señalética y control.',
            planName: 'QRs de todo tipo'
        },
        'otro': {
            img: null,
            desc: 'Modelado CAD de precisión y creación de piezas técnicas a medida.',
            planName: 'Cualquier otro diseño'
        }
    };

    function openModal(serviceKey) {
        if (!modalBackdrop) return;
        const data = modalData[serviceKey];
        if (data) {
            if (data.img) {
                modalImg.src = data.img;
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none'; // Sin ilustración fotorrealista
            }
            modalDesc.textContent = data.desc;
            modalBtnWA.setAttribute('data-plan', data.planName);

            modalBackdrop.classList.add('is-open');
        }
    }

    function closeModal() {
        if (modalBackdrop) {
            modalBackdrop.classList.remove('is-open');
        }
    }

    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceKey = btn.getAttribute('data-service');
            openModal(serviceKey);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
    }

    /* =========================================================================
       INICIALIZACIÓN CONDICIONAL (Responsividad Extrema)
       Aseguramos ahorro de recursos en móviles. El 3D no arrancará debajo de 1024px.
       ========================================================================= */
    if (window.innerWidth >= 1024) {
        initDesktop3DScene();
    }
});

/* =========================================================================
   ROUTER MÓVIL (HASH ROUTING NATIVO)
   ========================================================================= */
function navigate(targetId) {
    window.location.hash = targetId;
}

// Alias para soportar el nombre de función 'Maps'
function Maps(targetId) {
    navigate(targetId);
}

// Escuchar los cambios en el hash
function handleRouting() {
    // Obtener el hash sin el '#' (si está vacío, por defecto es 'view-home')
    const hash = window.location.hash.substring(1) || 'view-home';

    // Ocultar todas las vistas
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active-view');
    });

    // Mostrar la vista objetivo
    const targetView = document.getElementById(hash);
    if (targetView) {
        targetView.classList.add('active-view');
        window.scrollTo(0, 0); // Subir arriba al cambiar de vista
    } else {
        // Fallback de seguridad si el ID no existe
        const homeView = document.getElementById('view-home');
        if (homeView) homeView.classList.add('active-view');
    }
}

// Escuchar cuando el usuario pulsa botones (UI o Hardware)
window.addEventListener('hashchange', handleRouting);

// Ejecutar al cargar la página por primera vez
window.addEventListener('DOMContentLoaded', handleRouting);

function initDesktop3DScene() {
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('canvas-container');
    if (!container) return;

    // 1. ESCENA Y CAMARA
    const scene = new THREE.Scene();

    // El aspect ratio coincide directamente con las dimensiones del contenedor right
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. CREACIÓN DEL LOGOTIPO (Geometría Base)
    const logoGroup = new THREE.Group();
    const logoMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.15
    });

    // Anillo
    const ringGeometry = new THREE.TorusGeometry(2.5, 0.4, 32, 100);
    const ring = new THREE.Mesh(ringGeometry, logoMaterial);
    logoGroup.add(ring);

    // Eje diagonal
    const shaftGeometry = new THREE.CylinderGeometry(0.25, 0.25, 8, 32);
    const shaft = new THREE.Mesh(shaftGeometry, logoMaterial);
    shaft.rotation.z = -Math.PI / 4;
    logoGroup.add(shaft);

    // Flecha
    const arrowHeadGeometry = new THREE.ConeGeometry(0.8, 1.5, 32);
    const arrowHead = new THREE.Mesh(arrowHeadGeometry, logoMaterial);
    arrowHead.position.set(2.8, 2.8, 0);
    arrowHead.rotation.z = -Math.PI / 4;
    logoGroup.add(arrowHead);

    // Anillo Base
    const baseRingGeometry = new THREE.TorusGeometry(0.5, 0.25, 32, 50);
    const baseRing = new THREE.Mesh(baseRingGeometry, logoMaterial);
    baseRing.position.set(-2.8, -2.8, 0);
    logoGroup.add(baseRing);

    scene.add(logoGroup);

    // 3. ILUMINACIÓN
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 4. INTERACTIVIDAD MOUSE
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Obtenemos coordenadas para la inercia (calculada como -1 a 1 para viewport)
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
    });

    // 5. RESPONSIVE RESIZE
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });

    // 6. LOOP ANIMACIÓN
    function animate() {
        requestAnimationFrame(animate);

        // Multiplicador de fuerza
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Smooth Lerp (Rotación sutil y líquida)
        logoGroup.rotation.y += (targetX - logoGroup.rotation.y) * 0.05;
        logoGroup.rotation.x += (targetY - logoGroup.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }

    // Iniciar
    animate();
}

/* =========================================================================
   CONTACTO DIRECTO (WhatsApp API)
   ========================================================================= */
function enviarWhatsApp(elemento) {
    // 1. Definir el número de teléfono (Formato internacional sin el +)
    const telefono = "34643605384"; // Reemplazar con el número real de PuntoZero

    // 2. Extraer el nombre del plan del botón que se ha pulsado
    const plan = elemento.getAttribute('data-plan');

    // 3. Crear el mensaje personalizado
    const mensaje = `¡Hola PuntoZero! Vengo de vuestra web y estoy interesado en solicitar un presupuesto para: *${plan}*. ¿Podemos hablar?`;

    // 4. Codificar el texto para que la URL sea válida (espacios, tildes, etc.)
    const textoCodificado = encodeURIComponent(mensaje);

    // 5. Construir la URL de WhatsApp y abrirla en una pestaña nueva
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${textoCodificado}`;
    window.open(urlWhatsApp, '_blank');
}
