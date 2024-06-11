<template>
  <a :href="href" :target="target">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    target: {
      type: String,
      default: "_blank"
    },
    href: {
      type: String,
      required: true
    },
  }
};
</script>

<style scoped>
a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-block;
  padding: 8px 3px;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>