<template>
  <div class="navegacion">
    <v-toolbar color="#09814A" dark prominent>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>.DLG</v-toolbar-title>
      <v-text-field
        v-model="searchQuery"
        dense
        floating
        prepend-icon="mdi-magnify"
        hide-details
        single-line
        placeholder="Buscar productos"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon @click="showCart = !showCart">
        <v-icon>mdi-cart</v-icon>
        <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
      </v-btn>
    </v-toolbar>
    <div>
      <v-card>
        <v-tabs bg-color="teal-darken-3" slider-color="teal-lighten-3" show-arrows>
          <v-tab
            v-for="categoria in json.categorias"
            :key="categoria.id"
            @click="selectCategory(categoria.id)"
          >
            {{ categoria.nombre }}
          </v-tab>
        </v-tabs>
      </v-card>
    </div>
  </div>

  <v-container v-if="filteredProducts.length > 0">
    <h2>{{ json.categorias.find((cat) => cat.id === selectedCategoryId)?.nombre }}</h2>
    <v-row>
      <v-col>
        <div class="card" v-for="producto in filteredProducts" :key="producto.id">
          <div class="image-container">
            <img :src="producto.imagen" />
            <div class="price">${{ producto.precio }}</div>
          </div>

          <div class="content">
            <div class="product-name">{{ producto.nombre }}</div>
          </div>

          <div class="button-container">
            <button class="cart-button button" @click="addToCart(producto)">
              <v-icon>mdi-cart-plus</v-icon>
            </button>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showCart" max-width="600">
    <v-card>
      <v-card-title>Carrito de Compras</v-card-title>
      <v-card-text>
        <div v-if="cart.length === 0">El carrito está vacío.</div>
        <div v-else>
          <v-list>
            <v-list-item v-for="item in cart" :key="item.id">
              <v-list-item-content>
                <v-list-item-title>{{ item.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  ${{ item.precio }} x {{ item.cantidad }} = ${{ item.precio * item.cantidad }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="updateQuantity(item, -1)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <v-btn icon @click="updateQuantity(item, 1)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="removeFromCart(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <div class="cart-total">Total: ${{ cartTotal }}</div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="green" @click="proceedToOrder" :disabled="cart.length === 0">
          Realizar Pedido
        </v-btn>
        <v-btn color="red" @click="showCart = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showForm" max-width="500">
    <v-card>
      <v-card-title>Datos del Pedido</v-card-title>
      <v-card-text>
        <v-text-field v-model="form.nombre" label="Nombre" required></v-text-field>
        <v-text-field v-model="form.apellido" label="Apellido" required></v-text-field>
        <v-text-field v-model="form.direccion" label="Dirección" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue" @click="sendOrder">Enviar Pedido</v-btn>
        <v-btn color="red" @click="showForm = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import dataJson from "@/assets/data.json"; // Importar el archivo JSON

const json = ref(dataJson);
const selectedCategoryId = ref(null);
const searchQuery = ref("");
const cart = ref([]);
const showCart = ref(false);
const showForm = ref(false);
const form = ref({ nombre: "", apellido: "", direccion: "" });

const filteredProducts = computed(() => {
  if (!selectedCategoryId.value) return [];
  const categoria = json.value.categorias.find(
    (cat) => cat.id === selectedCategoryId.value
  );
  const productos = categoria ? categoria.productos : [];
  return productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => total + item.precio * item.cantidad, 0);
});

const cartItemCount = computed(() => {
  return cart.value.reduce((count, item) => count + item.cantidad, 0);
});

const selectCategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
};

const addToCart = (producto) => {
  const existingItem = cart.value.find((item) => item.id === producto.id);
  if (existingItem) {
    existingItem.cantidad++;
  } else {
    cart.value.push({ ...producto, cantidad: 1 });
  }
};

const updateQuantity = (item, amount) => {
  item.cantidad += amount;
  if (item.cantidad <= 0) removeFromCart(item);
};

const removeFromCart = (item) => {
  cart.value = cart.value.filter((cartItem) => cartItem.id !== item.id);
};

const proceedToOrder = () => {
  if (cart.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de realizar el pedido.");
    return;
  }
  showForm.value = true;
};

const sendOrder = () => {
  if (!form.value.nombre || !form.value.apellido || !form.value.direccion) {
    alert("Por favor, completa todos los campos del formulario.");
    return;
  }

  const orderText = `Pedido:\n${cart.value
    .map(
      (item) => `${item.nombre} x${item.cantidad} = $${item.cantidad * item.precio}`
    )
    .join("\n")}\n\nTotal: $${cartTotal.value}\n\nDatos del Cliente:\nNombre: ${form.value.nombre}\nApellido: ${form.value.apellido}\nDirección: ${form.value.direccion}`;

  const whatsappUrl = `https://wa.me/55725921?text=${encodeURIComponent(orderText)}`;
  window.open(whatsappUrl, "_blank");
  showForm.value = false;
  showCart.value = false;
};

onMounted(() => {
  if (json.value.categorias.length > 0) {
    selectedCategoryId.value = json.value.categorias[0].id;
  }
});
</script>




<style>
.navegacion{
  position: fixed;
  z-index: 10;
  width: 100%;
 
}

.cart-badge {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
}

/* From Uiverse.io by Smit-Prajapati */ 
.card {
  --accent-color: #ffd426;
  position: relative;
  width: 240px;
  background: white;
  border-radius: 1rem;
  padding: 0.3rem;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 50px 30px -20px;
  transition: all 0.5s ease-in-out;
  display: inline-block;
  margin-top: 5%;
  
}

.card .image-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0.7rem;
  border-top-right-radius: 4rem;
  margin-bottom: 1rem;
  

}

.card .image-container img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: inherit;
}

.card .image-container .svg {
  height: 100%;
  width: 100%;
  border-radius: inherit;
}

.card .image-container .price {
  position: absolute;
  right: 0.7rem;
  bottom: -1rem;
  background: white;
  color: var(--accent-color);
  font-weight: 900;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 1rem 1rem 2rem 2rem;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 0px 15px 0px;
}

.card .favorite {
  position: absolute;
  width: 19px;
  height: 19px;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.card .favorite input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.card .favorite input:checked ~ svg {
  animation: bouncing 0.5s;
  fill: rgb(255, 95, 95);
  filter: drop-shadow(0px 3px 1px rgba(53, 53, 53, 0.14));
}

.card .favorite svg {
  fill: #a8a8a8;
}

.card .content {
  padding: 0px 0.8rem;
  margin-bottom: 1rem;
}

.card .content .brand {
  font-weight: 900;
  color: #a6a6a6;
}

.card .content .product-name {
  font-weight: 700;
  color: #666666;
  font-size: 0.7rem;
  margin-bottom: 1rem;
}

.card .content .color-size-container {
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  color: #a8a8a8;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.card .content .color-size-container > * {
  flex: 1;
}

.card .content .color-size-container .colors .colors-container {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
  font-size: 0.5rem;
  margin-top: 0.2rem;
}

.card .content .color-size-container .colors .colors-container .color {
  height: 14px;
  position: relative;
}

.card .content .color-size-container .colors .colors-container .color:hover .color-name {
  display: block;
}

.card .content .color-size-container .colors .colors-container .color a {
  display: inline-block;
  height: 100%;
  aspect-ratio: 1;
  border: 3px solid black;
  border-radius: 50%;
}

.card .content .color-size-container .colors .colors-container .color .color-name {
  display: none;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  background: black;
  padding: 0.2rem 1rem;
  border-radius: 1rem;
  text-align: center;
}

.card .content .color-size-container .colors .colors-container .color:first-child a {
  border-color: #ffd426;
}

.card .content .color-size-container .colors .colors-container .color:nth-child(2) a {
  background: #144076;
}

.card .content .color-size-container .colors .colors-container .color:nth-child(3) a {
  border-color: #00b9ff;
}

.card .content .color-size-container .colors .colors-container .color:nth-child(4) a {
  border-color: #ff6ba1;
}

.card .content .color-size-container .colors .colors-container .active {
  border-color: black;
}

.card .content .color-size-container .sizes .size-container {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.2rem;
}

.card .content .color-size-container .sizes .size-container .size {
  height: 14px;
}

.card .content .color-size-container .sizes .size-container .size .size-radio {
  cursor: pointer;
}

.card .content .color-size-container .sizes .size-container .size .size-radio input {
  display: none;
}

.card .content .color-size-container .sizes .size-container .size .size-radio input:checked ~ .name {
  background: var(--accent-color);
  border-radius: 2rem 2rem 1.5rem 1.5rem;
  color: white;
}

.card .content .color-size-container .sizes .size-container .size .size-radio .name {
  display: grid;
  place-content: center;
  height: 100%;
  aspect-ratio: 1.2/1;
  text-decoration: none;
  color: #484848;
  font-size: 0.5rem;
  text-align: center;
}

.card .content .rating {
  color: #a8a8a8;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card .content .rating svg {
  height: 12px;
}

.card .button-container {
  display: flex;
  gap: 0.3rem;
}

.card .button-container .button {
  border-radius: 1.4rem 1.4rem 0.7rem 0.7rem;
  border: none;
  padding: 0.5rem 0;
  background: var(--accent-color);
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.card .button-container .button:hover {
  background: orangered;
}

.card .button-container .buy-button {
  flex: auto;
}

.card .button-container .cart-button {
  display: grid;
  place-content: center;
  width: 50px;
}

.card .button-container .cart-button svg {
  width: 15px;
  fill: white;
}

.card:hover {
  transform: scale(1.03);
}

@keyframes bouncing {
  from, to {
    transform: scale(1, 1);
  }

  25% {
    transform: scale(1.5, 2.1);
  }

  50% {
    transform: scale(2.1, 1.5);
  }

  75% {
    transform: scale(1.5, 2.05);
  }
}
</style>