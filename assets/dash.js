/* Reemplazo mínimo del motor del tablero para publicarlo como sitio propio.
   Lee los datos de assets/datos.js, corre los dibujos de la página y los repite cuando cambia el ancho. */
(function () {
  var CSV = window.DATOS || {};
  var cache = {};
  var draws = {};
  function visible(el) { return !el.closest('[hidden]'); }
  function run(name) {
    var fn = draws[name]; if (!fn) return;
    document.querySelectorAll('[data-draw="' + name + '"]').forEach(function (el) {
      if (!visible(el)) return;
      try { fn(el); } catch (e) { console.error('Error en el dibujo "' + name + '"', e); }
    });
  }
  function runAll() { Object.keys(draws).forEach(run); }
  window.dash = {
    data: function (id) {
      if (!(id in CSV)) return { status: 'missing', data: [], columns: [] };
      if (!cache[id]) { var d = d3.csvParse(CSV[id]); cache[id] = { status: 'ok', data: d, columns: d.columns, meta: [] }; }
      return cache[id];
    },
    draw: function (name, fn) { if (typeof fn === 'function') draws[name] = fn; else run(name); },
    onData: function (fn) { fn(); },
    setLink: function (name) { try { history.replaceState(null, '', '#' + name); } catch (e) { location.hash = name; } },
    params: function () { return {}; }, setParams: function () {}, resetParams: function () {}, refresh: function () {},
    colors: ['#2f6fb0', '#d8862b', '#2a9d8f', '#5e8bc9', '#8a6cc8', '#c75b7f', '#6b8e23', '#999']
  };
  // primera pasada cuando ya corrió el código de la página
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(runAll, 0); });
  else setTimeout(runAll, 0);
  // redibujar al cambiar el ancho de la ventana
  var t = 0, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return; lastW = window.innerWidth;
    clearTimeout(t); t = setTimeout(runAll, 200);
  });
})();
