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
            img: 'llaveros_3d.png',
            desc: 'Llaveros y merchandising técnico exclusivo para empresas.',
            planName: 'Merchandaising y llaveros personalizados'
        },
        'figuras': {
            img: 'Gato_3d.png',
            desc: 'Figuras decorativas y coleccionismo con acabados de alta calidad.',
            planName: 'Figuras y Coleccionables'
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

    // 2. CARGADOR Y GEOMETRÍA COLOSAL (GLTF)
    let logoModel = null;
    const baseRotX = -Math.PI / 2; // Corrección de Eje

    if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        loader.load('Logo_PuntoZero.GLB', function (gltf) {
            logoModel = gltf.scene;

            // Centrado de pivote estricto
            const box = new THREE.Box3().setFromObject(logoModel);
            const center = box.getCenter(new THREE.Vector3());
            logoModel.position.sub(center);

            // Escala Masiva/Colosal (Ajustado agresivo)
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 16 / maxDim; // Muy inmersivo de fondo
            logoModel.scale.set(scale, scale, scale);

            // Orientación nativa vertical (frente cámara)
            logoModel.rotation.x = baseRotX;

            // Material oscuro metálico
            logoModel.traverse(function (child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x111111,
                        metalness: 0.8,
                        roughness: 0.15
                    });
                }
            });

            scene.add(logoModel);
        });
    }

    // 3. ILUMINACIÓN TEATRAL
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Luz Frontal blanca (resalta bordes)
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    // Luz lateral azul suave (Rim light dramático)
    const blueLight = new THREE.PointLight(0x4488ff, 3, 50);
    blueLight.position.set(-8, 5, 2);
    scene.add(blueLight);

    // 4. INTERACTIVIDAD MOUSE INERCIAL
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Obtenemos coordenadas para inercia (-1 a 1)
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

        // Limitamos rotación inercial al 15 grados (~0.26 radianes)
        const rotLimit = 0.26;
        targetX = Math.max(-rotLimit, Math.min(rotLimit, mouseX * rotLimit));
        targetY = Math.max(-rotLimit, Math.min(rotLimit, mouseY * rotLimit));

        if (logoModel) {
            // Rotación constante mínima para vida cuando el ratón para
            logoModel.rotation.z += 0.001;

            // Lerp Ultra Inercial (giro pesado y colosal)
            logoModel.rotation.y += (targetX - logoModel.rotation.y) * 0.02;

            // Aplicado al X con el desfase de baseRotX
            const targetRotationX = baseRotX + targetY;
            logoModel.rotation.x += (targetRotationX - logoModel.rotation.x) * 0.02;
        }

        renderer.render(scene, camera);
    }

    // Iniciar
    animate();
}

/* =========================================================================
   CONTACTO DIRECTO (WhatsApp API)
   ========================================================================= */
function enviarWhatsApp(elemento) {
    const telefono = "34643605384";
    const plan = elemento.getAttribute('data-plan');
    const mensaje = `¡Hola PuntoZero! Vengo de vuestra web y estoy interesado en solicitar un presupuesto para: *${plan}*. ¿Podemos hablar?`;
    const textoCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${textoCodificado}`;

    if (window.innerWidth < 1024) {
        window.location.href = urlWhatsApp; // Evitar cuelgue PWA Apple/Android
    } else {
        window.open(urlWhatsApp, '_blank');
    }
}
