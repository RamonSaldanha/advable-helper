<template>
  <button :type="type" :class="`adble-button btn-${color}`" :disabled="loading" @click="handleClick">
    <div v-if="loading">
      <span role="status">Carregando...</span>
    </div>
    <div v-else-if="confirming">
      <span class="lh-1">Tem certeza?</span>
    </div>
    <div v-else>
      <i :class="`bx bx-fw ${icon} pt-1 me-1`" v-if="icon"></i>
      <span class="lh-1">{{ label }}</span>
    </div>
  </button>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'button',
    },
    color: {
      type: String,
      default: 'primary',
    },
    label: {
      required: true,
      type: String,
      default: 'Button',
    },
    icon: {
      required: false,
      type: String,
    },
    loading: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const confirming = ref(false);

    const handleClick = () => {
      if(props.type === 'submit') return;
      if (confirming.value) {
        confirming.value = false;
        emit('confirm'); // Use emit em vez de this.$emit
      } else {
        confirming.value = true;
      }
    };

    return {
      confirming,
      handleClick,
    };
  },
})
</script>
<style>
.adble-button {
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.adble-button:hover {
  background-color: #0056b3;
}
</style>