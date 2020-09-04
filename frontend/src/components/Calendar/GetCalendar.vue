<template>
  <div>
    <v-form @submit.prevent="loadCalendar(calendarID)">
      <v-container fluid>
        <v-row>
          <v-col>
            <v-card-actions>
              <v-btn
                @click="loadCalendar(calendarID)"
                :disabled="calendarID.toString().trim().length === 0"
                color="info"
                >GET ubiKal</v-btn
              >
            </v-card-actions>
          </v-col>
          <v-col>
            <v-text-field
              placeholder="ubiKal link"
              v-model="calendarID"
              prepend-inner-icon="mdi-table-arrow-down"
              dense
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import { calendarBus } from "@/main";
export default {
  name: "GetCalendar",
  data() {
    return {
      calendarID: ""
    };
  },
  methods: {
    //Reaches out to api to get an existing calendar and edit ID
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
            calendarBus.$emit("calendarIDFoundEmit", input);
          } else {
            calendarBus.$emit("CalendarIDNotFoundEmit", input.calendarID);
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
        return { calendarID: calendarID, allowEditID: allowEditID };
      }
      return { calendarID: input, allowEditID: "" };
    }
  }
};
</script>

<style></style>
