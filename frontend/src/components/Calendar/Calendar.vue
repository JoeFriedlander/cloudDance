<template>
  <div class="entireCalendar">
    {{ calendarID }}
    <button type="button" @click="doCopy">Copy Calendar ID</button>
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
          } else if (response.status === 404) {
            console.log("calender not found, may already be gone");
          } else {
            console.log("error deleting calendar");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    },
    doCopy: function() {
      this.$copyText(process.env.VUE_APP_WEBSERVER + this.calendarID).then(
        function() {
          //alert("Copied");
          //console.log(e);
        },
        function(e) {
          alert("Can not copy");
          console.log(e);
        }
      );
    }
  },
  components: { EventManager }
};
</script>

<style>
.entireCalendar {
  padding-top: 1vh;
  padding-left: 1vw;
  padding-right: 1vw;
  background-color: rgba(199, 227, 245);
  width: auto;
  text-align: left;
}
</style>
