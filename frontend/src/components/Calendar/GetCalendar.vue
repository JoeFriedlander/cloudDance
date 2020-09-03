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
      calendarID = this.sanitizeCalendarID(calendarID);
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
    },
    sanitizeCalendarID(calendarID) {
      //Checks if a url like ubikal.com/abc123 or https://www.ubikal.com/abc123 is used
      //In addition to supporting regular calendarIDs like abc123
      calendarID = calendarID.toString().trim();
      //remove trailing slash
      if (calendarID[-1] === "/") {
        calendarID = calendarID.splice(-1, 1);
      }
      //If there is a slash / then find the last index of it, and everything after the slash is possibly the calendarID
      let lastSlash = calendarID.lastIndexOf("/");
      if (lastSlash !== -1) {
        calendarID = calendarID.substring(lastSlash + 1, calendarID.length);
      }
      return calendarID;
    }
  }
};
</script>

<style></style>
