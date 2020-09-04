<template>
  <div class="entireCalendar">
    <span v-if="allowEditID">{{
      webserver + calendarID + "+" + allowEditID
    }}</span>
    <span v-else> {{ webserver + calendarID }} </span>
    <div />
    <button type="button" @click="doCopyCalendarID">Copy Read Only Link</button>
    <span v-if="allowEditID">
      <button type="button" @click="doCopyCalendarAndEditID">
        Copy Read And Edit Link
      </button>
    </span>
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
    <EventManager :calendarID="calendarID" :allowEditID="allowEditID">
    </EventManager>
  </div>
</template>

<script>
import EventManager from "@/components/Event/EventManager.vue";

export default {
  name: "Calendar",
  props: ["calendarID", "allowEditID"],
  data() {
    return {
      //process.env.VUE_APP_WEBSERVER didnt work in template section so defined it here
      webserver: process.env.VUE_APP_WEBSERVER
    };
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
          },
          body: JSON.stringify({
            allowEditID: this.allowEditID
          })
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
    doCopyCalendarID: function() {
      this.$copyText(this.webserver + this.calendarID).then(
        function() {
          //alert("Copied");
          //console.log(e);
        },
        function(e) {
          alert("Can not copy");
          console.log(e);
        }
      );
    },
    doCopyCalendarAndEditID: function() {
      this.$copyText(
        this.webserver + this.calendarID + "+" + this.allowEditID
      ).then(
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

<style></style>
