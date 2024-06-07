<template>
  <button @click="closePopup" class="adble-close-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 7l10 10M7 17L17 7"/></svg>
  </button>
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
.adble-close-button {
  padding: 5px 7px;
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 1px solid #8f8f8f;
  cursor: pointer;
}
</style>
