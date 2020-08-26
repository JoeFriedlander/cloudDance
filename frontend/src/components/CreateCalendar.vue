<template>
  <div>
    <form @submit.prevent="createCalendar">
      <button type="submit">New Calendar</button>
    </form>
    <br />
    <ul>
      <div v-for="calendar in calendars" :key="calendar">
        Calendar Code {{ calendar }}
        <EventManager :calendar="calendar"></EventManager>
        <br />
        <hr />
      </div>
    </ul>
  </div>
</template>

<script>
import EventManager from "@/components/EventManager.vue";

export default {
  name: "CreateCalendar",
  data() {
    return {
      calendars: [],
      apiServer: "http://localhost:3000/"
    };
  },
  methods: {
    createCalendar() {
      fetch(this.apiServer + "api/createCalendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.text())
        .then(response => {
          this.calendars.push(response);
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  },
  components: {
    EventManager
  }
};
</script>

<style></style>
