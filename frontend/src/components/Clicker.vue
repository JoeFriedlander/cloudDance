<template>
  <div>
    <div>hello {{ count }}</div>
    <button @click="incCount">click</button>
  </div>
</template>

<script>
export default {
  name: "Clicker",
  data() {
    return {
      count: 0
    };
  },
  methods: {
    incCount() {
      this.count++;
    }
  }
};
</script>

<style></style>
