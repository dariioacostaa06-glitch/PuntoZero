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
    // Si no está bajado Three.js o el contenedor no se encuentra, abandonamos.
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('hero-3d-logo');
    if (!container) return;

    // 1. ESCENA Y CÁMARA
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. CARGADOR DE MODELOS GLTF/GLB
    let logoModel = null;
    
    // 2. CARGADOR DE MODELOS GLTF/GLB
    let logoModel = null;
    
    // Almacenamos la rotación base deseada para "levantar" el modelo del eje X
    const baseRotX = -Math.PI / 2;

    if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        
        loader.load('Logo_PuntoZero.GLB', function (gltf) {
            logoModel = gltf.scene;
            
            // Asegurar que el pivote sea el centro geométrico del objeto
            const box = new THREE.Box3().setFromObject(logoModel);
            const center = box.getCenter(new THREE.Vector3());
            logoModel.position.sub(center);
            
            // Escalar para que sea gigante tras las letras
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 14 / maxDim; // Masivo
            logoModel.scale.set(scale, scale, scale);

            // Aplicar la rotación para levantarlo (compensar exportación)
            logoModel.rotation.x = baseRotX;

            scene.add(logoModel);
        });
    }

    // 3. ILUMINACIÓN DINÁMICA
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 10); 
    scene.add(directionalLight);
    
    // Luz de relleno rebotada
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Luz trasera tipo "Rim light" azulada u oscura
    const rimLight = new THREE.DirectionalLight(0x4488ff, 2);
    rimLight.position.set(0, 5, -10);
    scene.add(rimLight);

    // 4. INTERACTIVIDAD DE RATÓN
    let mouseX = 0;
    let mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Rango de -1 a 1 basado en la pantalla completa (Parallax)
        mouseX = (event.clientX - windowHalfX) / windowHalfX;
        mouseY = (event.clientY - windowHalfY) / windowHalfY;
    });

    // 5. RESPONSIVE (Reproyectar WebGL si la ventana cambia de tamaño)
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });

    let targetX = 0;
    let targetY = 0;

    // 6. LOOP ANIMACIÓN
    function animate() {
        requestAnimationFrame(animate);

        // Fuerza del giro reactivo al seguir el ratón (inercia pura, sin base sumada al objetivo)
        targetX = mouseX * 0.8;
        targetY = mouseY * 0.8;

        if (logoModel) {
            // El modelo base está levantado en el eje X (-90 grados). 
            // Aplicamos interpolación (Lerp) de la rotación para un seguimiento extremadamente suave
            // EJE Y: Rotación izquierda-derecha sobre su nueva vertical
            logoModel.rotation.y += (targetX - logoModel.rotation.y) * 0.05;
            
            // EJE X: Rotación arriba-abajo sumada a su base permanente de -90 grados (-Math.PI/2)
            const targetRotationX = baseRotX + targetY;
            logoModel.rotation.x += (targetRotationX - logoModel.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
    }

    // Encender motores
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

    // 5. Construir la URL de WhatsApp (En móvil/PWA a veces window.open es bloqueado, usamos location.href)
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${textoCodificado}`;
    
    // Si es móvil redirigimos directo para evitar bloqueos de popup, si es escritorio usamos open
    if (window.innerWidth < 1024) {
        window.location.href = urlWhatsApp;
    } else {
        window.open(urlWhatsApp, '_blank');
    }
}

