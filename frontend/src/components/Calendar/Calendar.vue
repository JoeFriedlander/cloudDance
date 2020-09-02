<template>
  <div class="entireCalendar">
    Calendar ID: {{ calendarID }}
    <form @submit.prevent="removeCalendar">
      <button type="submit">
        Remove Calendar From View
      </button>
    </form>
    <form @submit.prevent="deleteCalendar">
      <button type="submit">
        Permanently Delete Calendar
      </button>
    </form>
    <br />
    <EventManager :calendarID="calendarID"> </EventManager>
  </div>
</template>

<script>
import EventManager from "@/components/Event/EventManager.vue";

export default {
  name: "Calendar",
  props: ["calendarID"],
  data() {
    return {};
  },
  methods: {
    removeCalendar() {
      this.$emit("removeCalendarEmit", this.calendarID);
    },
    deleteCalendar() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/deleteCalendar" +
          "?calendarID=" +
          this.calendarID,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(response => {
          if (response.status === 200) {
            this.removeCalendar(this.calendarID);
          } else {
            console.log("error removing calendar");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  },
  components: { EventManager }
};
</script>

<style scoped>
.entireCalendar {
  border: 1px solid black;
  padding: 5px;
  background-color: rgba(199, 227, 245);
  width: auto;
  display: table;
  margin: 0 auto;
  text-align: left;
}
</style>
