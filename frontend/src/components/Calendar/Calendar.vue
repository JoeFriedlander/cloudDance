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
        <mark>{{ webserver + calendarID }}</mark>
      </span>
      <v-card-actions>
        <v-form>
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
                class="mr-10"
                color="info"
              >
                <v-icon>mdi-table</v-icon>view only
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
                class="mr-10"
                color="success"
                :disabled="!allowEditID"
              >
                <v-icon>mdi-pencil</v-icon>full edit
              </v-btn>
            </template>
            <span>copied</span>
          </v-tooltip>

          <v-btn @click="removeCalendar" class="mr-10">
            Hide
          </v-btn>

          <v-btn @click="deleteCalendar" class="mr-10" :disabled="!allowEditID">
            Delete
          </v-btn>
        </v-form>
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

<style>
mark {
  background-color: #f8cc46;
}
</style>
