// stores/wishlist.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { useAuthStore } from "./auth";
import api from '@/api/axiosConfig'
import { API_ROUTES } from "@/utils/apiRoute";

export const useWishlistStore = defineStore("wishlist", () => {
  // --- state ---
  const items = useStorage("wishlist-items", []); // ✅ persistant
  const syncing = ref(false);
  const error = ref(null);
  const lastSync = ref(null);

  // --- getters (computed) ---
  const count = computed(() => items.value.length);
  const isEmpty = computed(() => items.value.length === 0);
  const itemIds = computed(() => items.value.map((i) => i.product_id));
  const totalValue = computed(() =>
    items.value.reduce((sum, i) => sum + i.price, 0)
  );

  const groupedByCategory = computed(() =>
    items.value.reduce((acc, item) => {
      const category = item.category || "Autres";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {})
  );

  // --- actions ---
  const addItem = async (product) => {
    const exists = items.value.some((i) => i.product_id === product.id);
    if (!exists) {
      items.value.push({
        product_id: product.id,
        name: product.name,
        price: product.final_price,
        image: product.image,
        category: product.category,
        addedAt: new Date().toISOString(),
        variant: product.variant || null,
      });

      await syncWithServer();
    }
  };

  const removeItem = async (product_id) => {
    items.value = items.value.filter((i) => i.product_id !== product_id);
    await syncWithServer();
  };

  const clearWishlist = async () => {
    items.value = [];
    await syncWithServer();
  };

  const isInWishlist = (product_id) => {
    return items.value.some((i) => i.product_id === product_id);
  };

  // ✅ Synchronisation avec le serveur via cookie Sanctum
  const syncWithServer = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    syncing.value = true;
    error.value = null;

    try {
      const response = await api.put(API_ROUTES.wishlists.base, items.value);

      lastSync.value = new Date().toISOString();
      return response.data;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Erreur de synchronisation";
      console.error("❌ Wishlist sync error:", err);
      throw err;
    } finally {
      syncing.value = false;
    }
  };

  const loadFromServer = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return;

    syncing.value = true;
    error.value = null;

    try {
      const response = await api.get(API_ROUTES.wishlists.base);
      items.value = response.data.items || [];
      lastSync.value = new Date().toISOString();
    } catch (err) {
      error.value =
        err.response?.data?.message || "Erreur de chargement de la wishlist";
      console.error("❌ Wishlist load error:", err);
    } finally {
      syncing.value = false;
    }
  };

  const moveToCart = async (product_id, cartStore) => {
    const product = items.value.find((i) => i.product_id === product_id);
    if (!product) return;

    await cartStore.addItem({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });

    await removeItem(product_id);
  };

  const addToFavorite = async (item) => {
    if (!items.value.some((f) => f.product_id === item.id)) {
      items.value.push({
        id: item.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || null,
        inStock: item.stock_quantity > 0,
        slug: item.slug || null,
      });
    }
  };

  const removeFromFavorite = async (id) => {
    items.value = items.value.filter((i) => i.id !== id);
  };

  const toggleFavorite = async (item) => {
    const exists = items.value.some((f) => f.id === item.id);
    exists ? removeFromFavorite(item.id) : addToFavorite(item);
  };

  // --- expose ---
  return {
    // state
    items,
    syncing,
    error,
    lastSync,
    // getters
    count,
    isEmpty,
    itemIds,
    totalValue,
    groupedByCategory,
    // actions
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    syncWithServer,
    loadFromServer,
    moveToCart,
    addToFavorite,
    removeFromFavorite,
    toggleFavorite,
  };
});
