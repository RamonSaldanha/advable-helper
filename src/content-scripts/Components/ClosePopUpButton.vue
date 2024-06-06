<template>
  <button @click="closePopup" class="close-button">X</button>
</template>

<script>
export default {
  name: "CloseButton",
  methods: {
    closePopup() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
