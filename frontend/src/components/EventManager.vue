<template>
  <div>
    <div>Enter Event</div>
    <form @submit.prevent="CreateEvent">
      <label>
        Event Description:
        <input type="text" v-model="eventDescription" />
      </label>
      <button type="submit" :disabled="!eventDescription">Submit</button>
    </form>
    <br />
    <div>List Of Events:</div>
    <div v-for="event in eventList" :key="event">
      {{ event }}
    </div>
  </div>
</template>

<script>
export default {
  name: "EventManager",
  props: {
    calendar: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      eventDescription: "",
      eventList: [],
      apiServer: "http://localhost:3000/"
    };
  },
  methods: {
    CreateEvent() {
      fetch(this.apiServer + "api/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          calendarID: this.$props.calendar,
          eventDescription: this.eventDescription
        })
      })
        .then(response => response.json())
        .then(response => {
          this.eventList.push(response.eventDescription);
          this.eventDescription = "";
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  }
};
</script>

<style></style>
