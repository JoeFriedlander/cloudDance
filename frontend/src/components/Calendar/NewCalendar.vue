<template>
  <div>
    <v-form>
      <v-btn @click="newCalendar" class="elevation-2" color="success"
        >new ubiKal<v-icon class="ml-2 mr-n2">mdi-plus-thick</v-icon></v-btn
      >
    </v-form>
  </div>
</template>

<script>
import { calendarBus } from "@/main";
export default {
  name: "NewCalendar",
  data() {
    return {};
  },
  methods: {
    //Reaches out to api to get a new calendar+edit ID
    newCalendar() {
      fetch(process.env.VUE_APP_APISERVER + "api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          //If successful, send calendar and edit ID to calendar manager
          if (response.status === 201) {
            response
              .json()
              .then(response => calendarBus.$emit("newCalendarEmit", response));
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
