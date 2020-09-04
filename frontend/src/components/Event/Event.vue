<template>
  <div class="entireEvent">
    <v-form @submit.prevent="deleteEvent">
      <v-card-actions>
        <v-btn @click="deleteEvent" class="elevation-5" color="success"
          >Delete event</v-btn
        >
      </v-card-actions>
    </v-form>
    Description: {{ eventDescription }} <br />
    Start Time: {{ startTime }} <br />
    Length: {{ length }} <br />
  </div>
</template>

<script>
export default {
  name: "Event",
  props: ["eventID"],
  data() {
    return {
      eventDescription: "",
      startTime: "",
      length: ""
    };
  },
  created: function() {
    this.loadEvent();
  },
  methods: {
    loadEvent() {
      fetch(
        process.env.VUE_APP_APISERVER + "api/getEvent?eventID=" + this.eventID,
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
              this.eventDescription = response.eventdescription;
              this.startTime = response.starttime;
              this.length = response.length;
            });
          } else {
            console.log("error getting event");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    },
    removeEvent() {
      this.$emit("removeEventEmit", this.eventID);
    },
    deleteEvent() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/deleteEvent" +
          "?eventID=" +
          this.eventID,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            allowEditID: this.$parent.allowEditID
          })
        }
      )
        .then(response => {
          if (response.status === 200) {
            this.removeEvent();
          } else {
            console.log("error deleting event");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    }
  }
};
</script>

<style scoped>
.entireCalendar {
  border: 1px solid black;
  padding: 5px;
  background-color: rgba(199, 227, 245);
  width: 50%;
  margin: 0 auto;
  text-align: left;
}
</style>
