<template>
  <div>
    <v-form @submit.prevent="loadCalendar(calendarID)">
      <v-tooltip v-model="activeError" bottom>
        <template v-slot:activator="{ attrs }">
          <v-text-field
            v-bind="attrs"
            v-model="calendarID"
            append-icon="mdi-download"
            @click:append="loadCalendar(calendarID)"
            placeholder="get ubiKal"
          />
        </template>
        <span>{{ errorMessage }}</span>
      </v-tooltip>
    </v-form>
  </div>
</template>

<script>
import { calendarBus } from "@/main";
export default {
  name: "GetCalendar",
  data() {
    return {
      calendarID: "",
      errorMessage: "",
      //need a seperate bool so error message renders correctly with vuetify
      activeError: false
    };
  },
  mounted() {
    calendarBus.$on("routeEmit", calendarAndEditID => {
      this.loadCalendar(calendarAndEditID);
    });
    //listen for emits from calendar manager
    calendarBus.$on("errorCalendarNotFoundEmit", calendarAndEditID => {
      this.setErrorCalendarNotFoundTrue(calendarAndEditID);
    });
    calendarBus.$on("errorCalendarAlreadyLoadedEmit", calendarAndEditID => {
      this.setErrorCalendarAlreadyLoadedTrue(calendarAndEditID);
    });
  },
  methods: {
    //Reaches out to api to get an existing calendar and edit ID
    //if input includes editID, also check that matches up
    loadCalendar(input) {
      input = this.extractCalendarID(input);
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/calendar?calendarID=" +
          input.calendarID +
          "&allowEditID=" +
          input.allowEditID,
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
            calendarBus.$emit("calendarIDNotFoundEmit", input.calendarID);
          }
          this.calendarID = "";
        })
        .catch(error => {
          console.log("error: " + error);
        });
    },
    extractCalendarID(input) {
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
    },
    setErrorCalendarNotFoundTrue: function() {
      this.errorMessage = "error 82015 - ubiKal not found";
      this.activeError = true;
      setTimeout(this.setErrorCalendarNotFoundFalse, 2500);
    },
    setErrorCalendarNotFoundFalse: function() {
      this.activeError = false;
    },
    setErrorCalendarAlreadyLoadedTrue: function() {
      this.errorMessage = "error 49148.2(b) - ubiKal already loaded";
      this.activeError = true;
      setTimeout(this.setErrorCalendarAlreadyLoadedFalse, 4000);
    },
    setErrorCalendarAlreadyLoadedFalse: function() {
      this.activeError = false;
    }
  }
};
</script>

<style></style>
