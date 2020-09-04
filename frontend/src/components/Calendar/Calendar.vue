<template>
  <v-card class="mx-auto mt-5">
    <v-card-text>
      <span v-show="allowEditID && !hoverEditID && !hoverCalendarID">
        {{ webserver + calendarID + "+" + allowEditID }}
      </span>
      <span v-show="allowEditID && hoverEditID && !hoverCalendarID">
        <mark>{{ webserver + calendarID + "+" + allowEditID }}</mark>
      </span>
      <span v-show="allowEditID && !hoverEditID && hoverCalendarID">
        <span
          ><mark>{{ webserver + calendarID }}</mark></span
        >
        <span>{{ "+" + allowEditID }}</span>
      </span>
      <span v-show="!allowEditID && !hoverCalendarID">
        {{ webserver + calendarID }}
      </span>
      <span v-show="!allowEditID && hoverCalendarID">
        {{ webserver + calendarID }}
      </span>
      <v-card-actions>
        <v-container>
          <v-form>
            <v-row>
              <v-col cols="8">
                <v-btn
                  @click="doCopyCalendarID"
                  v-on:mouseover="setHoverCalendarIDTrue"
                  v-on:mouseleave="setHoverCalendarIDFalse"
                  class="mr-10"
                  color="info"
                >
                  <v-icon>mdi-table</v-icon>view only
                </v-btn>
                <v-btn
                  @click="doCopyCalendarAndEditID"
                  v-on:mouseover="setHoverEditIDTrue"
                  v-on:mouseleave="setHoverEditIDFalse"
                  class="mr-10"
                  color="success"
                  :disabled="!this.allowEditID"
                >
                  <v-icon>mdi-pencil</v-icon>full edit
                </v-btn>
              </v-col>
              <v-spacer />
              <v-col cols="4">
                <v-btn @click="removeCalendar" class="mr-10">
                  Hide
                </v-btn>
                <v-btn
                  @click="deleteCalendar"
                  class="mr-10"
                  :disabled="!this.allowEditID"
                >
                  Delete </v-btn
                >'
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-actions>
      <EventManager :calendarID="calendarID" :allowEditID="allowEditID">
      </EventManager>
    </v-card-text>
  </v-card>
</template>

<script>
import EventManager from "@/components/Event/EventManager.vue";

export default {
  name: "Calendar",
  props: ["calendarID", "allowEditID"],
  data() {
    return {
      hoverCalendarID: false,
      hoverEditID: false,
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
    },
    setHoverCalendarIDTrue: function() {
      this.hoverCalendarID = true;
    },
    setHoverCalendarIDFalse: function() {
      this.hoverCalendarID = false;
    },
    setHoverEditIDTrue: function() {
      this.hoverEditID = true;
    },
    setHoverEditIDFalse: function() {
      this.hoverEditID = false;
    }
  },
  components: { EventManager }
};
</script>

<style>
mark {
  background-color: #f8cc46;
}
</style>
