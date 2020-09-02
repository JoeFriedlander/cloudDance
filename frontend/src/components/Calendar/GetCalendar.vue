<template>
  <div>
    <form @submit.prevent="loadCalendar(calendarID)">
      <label>
        Get existing Calendar:
        <input type="text" v-model="calendarID" />
      </label>
      <button type="submit" :disabled="!calendarID">
        Get Calendar
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "GetCalendar",
  data() {
    return {
      calendarID: ""
    };
  },
  methods: {
    loadCalendar(calendarID) {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/calendarExists?calendarID=" +
          calendarID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {
          if (response.status === 200) {
            this.$emit("calendarIDFoundEmit", calendarID);
          } else {
            this.$emit("CalendarIDNotFoundEmit", calendarID);
          }
          this.calendarID = "";
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  }
};
</script>

<style></style>
