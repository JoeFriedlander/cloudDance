<template>
  <div>
    <v-form @submit.prevent="newEvent">
      <v-text-field v-model="eventDescription" label="Event Description" />
      <v-text-field v-model="startTime" label="Start Time" />
      <v-text-field v-model="length" label="Length" />
      <v-card-actions>
        <v-btn
          @click="newEvent"
          :disabled="eventDescription.toString().trim().length === 0"
          class="elevation-5"
          color="info"
          >Add event</v-btn
        >
      </v-card-actions>
    </v-form>
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
