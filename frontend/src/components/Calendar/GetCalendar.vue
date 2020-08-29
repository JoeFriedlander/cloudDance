<template>
  <div>
    <form @submit.prevent="loadCalendar">
      <label>
        Calendar ID:
        <input type="text" v-model="calendarID" />
      </label>
      <button type="submit" :disabled="!calendarID">
        Get Existing Calendar
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
    loadCalendar() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/calendarExists?calendarID=" +
          this.calendarID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => response.text())
        .then(response => {
          // change from string 'true' / 'false' to bool true / false
          // eslint-disable-next-line prettier/prettier
          response = (response === "true" ? true : false);
          if (response === true) {
            this.$emit("calendarIDFoundEmit", this.calendarID);
          } else {
            this.$emit("CalendarIDNotFoundEmit", this.calendarID);
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
