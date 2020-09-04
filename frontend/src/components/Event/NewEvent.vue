<template>
  <div>
    <form @submit.prevent="newEvent">
      <label>
        Event Description:
        <input type="text" v-model="eventDescription" />
        Start Time:
        <input type="text" v-model="startTime" />
        Length:
        <input type="text" v-model="length" />
      </label>
      <button type="submit" :disabled="!eventDescription">Add Event</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "NewEvent",
  props: ["calendarID"],
  data() {
    return {
      eventDescription: "",
      startTime: "",
      length: ""
    };
  },
  methods: {
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
