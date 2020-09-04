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
    loadCalendar(input) {
      input = this.sanitizeCalendarID(input);
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/calendarExists?calendarID=" +
          input.calendarID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {
          if (response.status === 200) {
            this.$emit("calendarIDFoundEmit", input);
          } else {
            this.$emit("CalendarIDNotFoundEmit", input.calendarID);
          }
          this.calendarID = "";
        })
        .catch(error => {
          console.log("error: " + error);
        });
    },
    sanitizeCalendarID(input) {
      let calendarID = "";
      let allowEditID = "";
      //Checks if a url like ubikal.com/abc123 or https://www.ubikal.com/abc123 is used
      //In addition to supporting regular calendarIDs like abc123
      input = input.toString().trim();
      //remove trailing slash e.g https://www.ubikal.com/abc123/
      if (input.slice(-1) === "/") {
        input = input.slice(0, -1);
      }
      //If there is a slash / then find the last index of it, and everything after the slash is possibly the calendarID + editID
      let lastSlashIndex = input.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        input = input.substring(lastSlashIndex + 1, input.length);
      }
      //Check if there is an editID abc123+def321
      let plusIndex = input.indexOf("+");
      if (plusIndex !== -1) {
        calendarID = input.substring(0, plusIndex);
        allowEditID = input.substring(plusIndex + 1);
        console.log({ calendarID: calendarID, allowEditID: allowEditID });
        return { calendarID: calendarID, allowEditID: allowEditID };
      }
      console.log({ calendarID: calendarID, allowEditID: "" });
      return { calendarID: input, allowEditID: "" };
    }
  }
};
</script>

<style></style>
