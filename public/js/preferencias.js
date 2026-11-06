// Aplica el tamaño de letra elegido antes de pintar la página (evita saltos).
// Archivo externo para cumplir la CSP (sin scripts en línea).
(function () {
  try {
    var t = localStorage.getItem('clastec:tamano-letra');
    if (t === 'texto-grande' || t === 'texto-muy-grande') document.documentElement.classList.add(t);
  } catch (e) { /* almacenamiento no disponible */ }
})();
