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
      console.log("new event");
      let calendarID = args.calendarID;
      let event = args.event;
      let allowEditID = args.allowEditID;
      let startUTC = moment(args.start)
        .utc()
        .format("YYYY-MM-DD H:mm:ss");
      let endUTC = moment(args.end)
        .utc()
        .format("YYYY-MM-DD H:mm:ss");
      fetch(process.env.VUE_APP_APISERVER + "api/newEvent", {
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
          if (response.status === 201) {
            response.text().then(response => {
              this.$emit("newEventEmit", response);
              this.eventDescription = "";
              this.startTime = "";
              this.length = "";
            });
          } else {
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
