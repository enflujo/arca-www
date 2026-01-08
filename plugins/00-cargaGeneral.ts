import { usarGeneral } from '~/cerebros/general';

export default defineNuxtPlugin(async () => {
  const general = usarGeneral();
  if (!general.datosCargados) {
    await general.cargarGeneral();
  }
});
