/**
 * Scroll de la portada.
 *
 * Hace dos cosas y nada más:
 *
 *   1. Publica en window.pzAvanceScroll el progreso del recorrido (0 a 1).
 *      Lo lee js/main.js para girar y alejar el logo 3D del fondo: sin esto,
 *      el fondo se quedaría quieto.
 *   2. En escritorio, scroll suave con Lenis, y las dos ayudas que necesita
 *      NavDesk: bajar hasta una sección y frenar el fondo al abrir un panel.
 *
 * No se usa ScrollTrigger a propósito: aquí no hay animaciones enganchadas al
 * scroll, solo una cifra de progreso, y un listener normal basta.
 *
 * En móvil no se activa Lenis: el scroll suave por JS pelea con el táctil del
 * sistema y se siente pastoso; el nativo de iOS y Android ya va fino.
 */
(function () {
    'use strict';

    var escritorio = window.matchMedia('(min-width: 1024px)').matches;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function avance() {
        var alto = document.documentElement.scrollHeight - window.innerHeight;
        var v = alto > 0 ? window.scrollY / alto : 0;
        window.pzAvanceScroll = v < 0 ? 0 : (v > 1 ? 1 : v);
    }

    window.addEventListener('scroll', avance, { passive: true });
    window.addEventListener('resize', avance);
    window.addEventListener('load', avance);
    avance();

    if (!escritorio) return;

    /* Lenis mueve el scroll real (no transforma la página), así que los paneles
       de detalle y el canvas 3D, que son position:fixed, siguen comportándose
       con normalidad. Con ScrollSmoother de GSAP se romperían. */
    var lenis = null;
    if (window.Lenis && !reducido) {
        lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on('scroll', avance);
        (function bucle(t) {
            lenis.raf(t);
            requestAnimationFrame(bucle);
        })(0);
    }

    // NavDesk baja hasta la sección con esto.
    window.pzScrollA = function (destino) {
        if (lenis) lenis.scrollTo(destino, { offset: -70, duration: 1.2 });
        else destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    /* Y frena el fondo con esto al abrir un panel. Hace falta de verdad: Lenis
       escucha la rueda y mueve el scroll él mismo, así que el overflow:hidden
       del body no le afecta y la portada seguiría desplazándose por debajo. */
    window.pzScrollFondo = function (activo) {
        if (!lenis) return;
        if (activo) lenis.start();
        else lenis.stop();
    };
})();
