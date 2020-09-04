<template>
  <div>
    <v-card-actions>
      <v-form>
        <v-btn @click="newCalendar" color="success">New Calendar</v-btn>
      </v-form>
    </v-card-actions>
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
              .json()
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
