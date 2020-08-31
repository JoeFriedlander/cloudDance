<template>
  <div>
    <NewEvent :calendarID="calendarID" @newEventEmit="loadAllEvents"></NewEvent>
    <br />
    <div>List Of Events:</div>
    <div v-for="event in eventList" :key="event">
      {{ event }}
    </div>
  </div>
</template>

<script>
import NewEvent from "@/components/Event/NewEvent.vue";

export default {
  name: "EventManager",
  props: ["calendarID"],
  data() {
    return {
      eventDescription: "",
      eventList: []
    };
  },
  methods: {
    loadAllEvents() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/loadCalendar?calendarID=" +
          this.calendarID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => response.json())
        .then(response => {
          console.log(response);
          response
            ? this.$emit("loadCalendarEmit", response)
            : console.log("empty response");
          this.calendarID = "";
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  },
  components: {
    NewEvent
  }
};
</script>

<style></style>
