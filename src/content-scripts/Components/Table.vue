<template>
  <div class="table-responsive">
    <table>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td class="column-label">{{ row.column }}</td>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    rows: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.column-label {
  font-weight: bold;
}
</style>