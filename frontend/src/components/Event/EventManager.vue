<template>
  <div>
    <NewEvent :calendarID="calendarID" @newEventEmit="loadNewEvent"></NewEvent>
    <br />
    <div>List Of Events:</div>
    <br />
    <div v-for="eventID in eventIDs" :key="eventID">
      <Event :eventID="eventID" @removeEventEmit="removeEventID"></Event>
      <br />
    </div>
  </div>
</template>

<script>
//When event manager is created it gets a list of all eventIDs
import Event from "@/components/Event/Event.vue";
import NewEvent from "@/components/Event/NewEvent.vue";

export default {
  name: "EventManager",
  props: ["calendarID", "allowEditID"],
  data() {
    return {
      eventDescription: "",
      eventIDs: []
    };
  },
  created: function() {
    this.loadEventsFromCalendar();
  },
  methods: {
    loadNewEvent(eventID) {
      this.eventIDs.push(eventID);
    },
    removeEventID(eventIDToRemove) {
      this.eventIDs = this.eventIDs.filter(
        eventID => eventID !== eventIDToRemove
      );
    },
    loadEventsFromCalendar() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/loadEventsFromCalendar?calendarID=" +
          this.calendarID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {
          if (response.status === 200) {
            response.json().then(response => {
              for (let eventObject of response) {
                this.loadNewEvent(eventObject.eventid);
              }
            });
          } else {
            console.log("error getting events from calendar");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  },
  components: {
    Event,
    NewEvent
  }
};
</script>

<style></style>
