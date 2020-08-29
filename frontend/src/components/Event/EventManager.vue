<template>
  <div>
    <form @submit.prevent="CreateEvent">
      <label>
        Event Description:
        <input type="text" v-model="eventDescription" />
      </label>
      <button type="submit" :disabled="!eventDescription">Add Event</button>
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
      eventList: []
    };
  },
  methods: {
    CreateEvent() {
      fetch(process.env.VUE_APP_APISERVER + "api/createEvent", {
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

<script>
export default {
  name: "LoadCalendar",
  data() {
    return {
      calendarID: ""
    };
  },
  methods: {
    loadCalendar() {
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
  }
};
</script>

<style></style>
