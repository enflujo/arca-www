export default function (
  elemento: HTMLElement,
  accion: (elemento: Element) => void,
  desconectarInmediatamente = true,
  opciones?: IntersectionObserverInit
) {
  const observador = new IntersectionObserver(([elementoObservado]) => {
    if (elementoObservado && elementoObservado.isIntersecting) {
      accion(elementoObservado.target);

      if (desconectarInmediatamente) {
        observador.unobserve(elementoObservado.target);
      }
    }
  }, opciones);

  observador.observe(elemento);

  return observador;
}
