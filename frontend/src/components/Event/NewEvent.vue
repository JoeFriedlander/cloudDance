<template>
  <div>
    <!--
    <v-form @submit.prevent="newEvent">
      <v-text-field v-model="eventDescription" label="Event Description" />
      <v-text-field v-model="startTime" label="Start Time" />
      <v-text-field v-model="length" label="Length" />
      <v-card-actions>
        <v-btn
          @click="newEvent"
          :disabled="eventDescription.toString().trim().length === 0"
          color="info"
          >Add event</v-btn
        >
      </v-card-actions>
    </v-form> -->
  </div>
</template>

<script>
import { eventBus } from "@/main";
export default {
  name: "NewEvent",
  mounted() {
    eventBus.$on("beginNewEventEmit", args => {
      this.beginNewEvent(args);
    });
  },
  data() {
    return {
      eventDescription: "",
      startTime: "",
      length: ""
    };
  },
  methods: {
    beginNewEvent(args) {
      let calendarID = args.calendarID;
      let allowEditID = args.allowEditID;
      let start = args.mouseDownOn;
      let end = args.mouseUpOn;
      //If mouse dragged right to left for example, start is bigger than end so swap
      if (start > end) {
        let temp = start;
        start = end;
        end = temp;
      }
      console.log(calendarID, allowEditID, start, end);
    },
    newEvent() {
      fetch(process.env.VUE_APP_APISERVER + "api/newEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          calendarID: this.$props.calendarID,
          eventDescription: this.eventDescription,
          startTime: this.startTime,
          length: this.length,
          allowEditID: this.$parent.allowEditID
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
