<template>
  <div class="layout">
    <div class="content">
      <!-- Aquí va el contenido principal de tu aplicación -->
      <slot></slot>
    </div>
    <v-footer
      class="footer bg-teal-darken-3 text-center d-flex flex-column"
    >
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4"
          variant="text"
        ></v-btn>
      </div>

      <div class="pt-0">
        <p>Sobre .DLG</p>

<p>.DLG es una tienda online dedicada a ofrecer una experiencia de compra única y conveniente. Nos especializamos en brindar productos de alta calidad a precios competitivos, con un enfoque en la satisfacción del cliente. Nuestra amplia variedad de productos está diseñada para satisfacer las necesidades de todos nuestros usuarios, desde tecnología hasta artículos para el hogar.

Comprometidos con la excelencia, DLG asegura un proceso de compra sencillo, seguro y rápido. Trabajamos con los mejores proveedores para ofrecerte lo último en tendencias, con envíos rápidos y atención al cliente personalizada.

Gracias por elegirnos, ¡y disfruta de tu experiencia de compra en .DLG!</p>
      </div>

      <v-divider></v-divider>

      <div>
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </div>
    </v-footer>
  </div>
</template>

<script>
export default {
  data: () => ({
    icons: [
      "mdi-facebook",
      "mdi-twitter",
      "mdi-linkedin",
      "mdi-instagram",
    ],
  }),
};
</script>

<style>
/* Configuración de layout para asegurar que el footer esté al final */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que la página ocupe toda la altura de la ventana */
}

.content {
  flex: 50; /* El contenido principal crece para llenar el espacio disponible */
}

.footer {
  flex-shrink: 0; /* El footer no se encoge y permanece al final */
}
</style>
