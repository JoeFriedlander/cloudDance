<template>
  <div>
    <form @submit.prevent="newCalendar">
      <button type="submit">New Calendar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "NewCalendar",
  data() {
    return {};
  },
  methods: {
    newCalendar() {
      fetch(process.env.VUE_APP_APISERVER + "api/newCalendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.text())
        .then(response => {
          this.$emit("newCalendarEmit", response);
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  }
};
</script>

<style></style>
