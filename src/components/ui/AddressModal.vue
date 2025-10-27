<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="closeModal">
      <div class="address-modal">
        <button class="close-button" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <h2>{{ address.id ? 'Modifier' : 'Ajouter' }} une adresse</h2>
        
        <form @submit.prevent="saveAddress" class="address-form">
          <div class="form-group">
            <label for="label">Libellé de l'adresse *</label>
            <input 
              type="text" 
              id="label" 
              v-model="address.label" 
              placeholder="Ex: Domicile, Bureau..." 
              required
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom *</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="address.firstName" 
                required
              >
            </div>
            <div class="form-group">
              <label for="lastName">Nom *</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="address.lastName" 
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="street">Adresse *</label>
            <input 
              type="text" 
              id="street" 
              v-model="address.street" 
              placeholder="Rue et numéro" 
              required
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">Ville *</label>
              <input 
                type="text" 
                id="city" 
                v-model="address.city" 
                required
              >
            </div>
            <div class="form-group">
              <label for="region">Région *</label>
              <input 
                type="text" 
                id="region" 
                v-model="address.region" 
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="country">Pays *</label>
            <select id="country" v-model="address.country" required>
              <option value="">Sélectionnez un pays</option>
              <option value="Bénin">Bénin</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Sénégal">Sénégal</option>
              <option value="Togo">Togo</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label for="phone">Téléphone *</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="address.phone" 
              placeholder="Ex: +229 52 01 04 42" 
              required
            >
          </div>

          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="isDefault" 
              v-model="address.isDefault"
            >
            <label for="isDefault">Définir comme adresse par défaut</label>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeModal">
              Annuler
            </button>
            <button type="submit" class="save-btn">
              {{ address.id ? 'Mettre à jour' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AddressModal',
  props: {
    address: {
      type: Object,
      default: () => ({
        label: '',
        firstName: '',
        lastName: '',
        street: '',
        city: 'Cotonou',
        region: 'Littoral',
        country: 'Bénin',
        phone: '',
        isDefault: false
      })
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    saveAddress() {
      this.$emit('save', { ...this.address });
      this.closeModal();
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.address-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: #3498db;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-group input {
  width: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: none;
  border: 1px solid #ddd;
  color: #666;
}

.cancel-btn:hover {
  background: #f5f5f5;
}

.save-btn {
  background: #3498db;
  border: 1px solid #3498db;
  color: white;
}

.save-btn:hover {
  background: #2980b9;
}

/* Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .address-modal {
    padding: 1.5rem;
  }
}
</style>