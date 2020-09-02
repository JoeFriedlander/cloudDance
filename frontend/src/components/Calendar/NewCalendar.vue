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
        .then(response => {
          if (response.status === 201) {
            response
              .text()
              .then(response => this.$emit("newCalendarEmit", response));
          } else {
            console.log("Could not create new calendar");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  }
};
</script>

<style></style>
