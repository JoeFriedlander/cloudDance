<template>
  <span></span>
</template>

<script>
import { eventBus } from "@/main";
import moment from "moment";
export default {
  name: "NewEvent",
  mounted() {
    eventBus.$on("newEventEmit", args => {
      this.newEvent(args);
    });
  },
  data() {
    return {};
  },
  methods: {
    newEvent(args) {
      let calendarID = args.calendarID;
      let event = args.event;
      let allowEditID = args.allowEditID;
      let startUTC = moment(args.start).format("YYYY-MM-DD HH:mm:ss");
      let endUTC = moment(args.end).format("YYYY-MM-DD HH:mm:ss");
      fetch(process.env.VUE_APP_APISERVER + "api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          calendarID: calendarID,
          eventDescription: event,
          startTime: startUTC,
          endTime: endUTC,
          allowEditID: allowEditID
        })
      })
        .then(response => {
          if (response.status != 201) {
            console.log("Could not create new event");
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
