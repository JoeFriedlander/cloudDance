<template>
  <v-card class="mt-5" elevation="2">
    <v-toolbar dense elevation="2" color="#e0e0e0">
      <v-spacer></v-spacer>
      <v-toolbar-title class="mr-8">
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
          <mark>{{ webserver + calendarID }}</mark>
        </span>
      </v-toolbar-title>
      <!--
      <v-btn v-show="!allowEditID" color="indigo" dark class="mr-8">
        Warning: BASIC ubiKal detected - Click here to upgrade<v-icon
          class="ml-1 mr-n1"
          >mdi-arrow-up-bold</v-icon
        > 
      </v-btn> -->
      <v-tooltip v-model="copiedTooltipCalendarID" top>
        <template v-slot:activator="{ attrs }">
          <v-btn
            v-bind="attrs"
            @click="
              () => {
                doCopyCalendarID();
                setCopiedTooltipCalendarIDTrue();
              }
            "
            v-on:mouseover="setHoverCalendarIDTrue"
            v-on:mouseleave="setHoverCalendarIDFalse"
            class="mr-8"
            color="info"
          >
            share view<v-icon class="ml-1 mr-n1">mdi-table</v-icon>
          </v-btn>
        </template>
        <span>copied</span>
      </v-tooltip>

      <v-tooltip v-model="copiedTooltipEditID" top>
        <template v-slot:activator="{ attrs }">
          <v-btn
            v-bind="attrs"
            @click="
              () => {
                doCopyCalendarAndEditID();
                setCopiedTooltipEditIDTrue();
              }
            "
            v-on:mouseover="setHoverEditIDTrue"
            v-on:mouseleave="setHoverEditIDFalse"
            class="mr-8"
            color="info"
            :disabled="!allowEditID"
          >
            share edit<v-icon class="ml-1 mr-n1">mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>copied</span>
      </v-tooltip>

      <v-btn @click="deleteCalendar" class="mr-8" :disabled="!allowEditID">
        delete<v-icon class="ml-1 mr-n1">mdi-trash-can-outline</v-icon>
      </v-btn>

      <v-btn @click="removeCalendar" class="mr-n2">
        close<v-icon class="ml-1 mr-n1">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <EventManager
      :calendarID="calendarID"
      :allowEditID="allowEditID"
      :dateTimeCreatedUTC="dateTimeCreatedUTC"
    >
    </EventManager>
  </v-card>
</template>

<script>
import EventManager from "@/components/Event/EventManager.vue";

export default {
  name: "Calendar",
  props: ["calendarID", "allowEditID", "dateTimeCreatedUTC"],
  data() {
    return {
      show: false,
      hoverCalendarID: false,
      hoverEditID: false,
      copiedTooltipCalendarID: false,
      copiedTooltipEditID: false,
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
          "api/calendar" +
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
      this.$copyText(this.webserver + this.calendarID);
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
          //alert("Can not copy");
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
    },
    setCopiedTooltipCalendarIDTrue: function() {
      this.copiedTooltipCalendarID = true;
      setTimeout(this.setCopiedTooltipCalendarIDFalse, 1000);
    },
    setCopiedTooltipCalendarIDFalse: function() {
      this.copiedTooltipCalendarID = false;
    },
    setCopiedTooltipEditIDTrue: function() {
      this.copiedTooltipEditID = true;
      setTimeout(this.setCopiedTooltipEditIDFalse, 1000);
    },
    setCopiedTooltipEditIDFalse: function() {
      this.copiedTooltipEditID = false;
    }
  },
  components: { EventManager }
};
</script>

<style scoped>
mark {
  background-color: #f8cc46;
}
/*@import url("https://fonts.googleapis.com/css2?family=Space+Mono&display=swap");
.v-toolbar__title {
  font-family: "Space Mono", monospace;
  font-size: 1em;
}*/
</style>
