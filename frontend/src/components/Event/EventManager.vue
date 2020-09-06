<template>
  <div id="eventManager">
    <div
      class="box"
      v-for="hour in hours"
      :key="hour"
      @mousedown="mouseDownBox"
      @mouseup="mouseUpBox"
      @mouseover="mouseOverBox"
    >
      ok <br />
      {{ hour }}
    </div>
    <!--
    <NewEvent :calendarID="calendarID" @newEventEmit="loadNewEvent"></NewEvent>
    <br />
    <div>List Of Events:</div>
    <br />
    <div v-for="eventID in eventIDs" :key="eventID">
      <Event :eventID="eventID" @removeEventEmit="removeEventID"></Event>
      <br />
    </div>
    -->
  </div>
</template>

<script>
//When event manager is mounted it gets a list of all eventIDs
//import Event from "@/components/Event/Event.vue";
//import NewEvent from "@/components/Event/NewEvent.vue";

export default {
  name: "EventManager",
  props: ["calendarID", "allowEditID"],
  data() {
    return {
      //box the mouse first brought down on
      mouseDownOn: "",
      //box the mouse brought up on
      mouseUpOn: "",
      eventDescription: "",
      eventIDs: [],
      hours: []
    };
  },
  mounted: function() {
    this.createHours();
    this.loadEventsFromCalendar();
  },
  methods: {
    loadCalendarCreateDateTime() {
      //fetch calendar create time
    },
    loadNewEvent(eventID) {
      this.eventIDs.push(eventID);
    },
    removeEventID(eventIDToRemove) {
      this.eventIDs = this.eventIDs.filter(
        eventID => eventID !== eventIDToRemove
      );
    },
    loadEventsFromCalendar() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/loadEventsFromCalendar?calendarID=" +
          this.calendarID,
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
              for (let eventObject of response) {
                this.loadNewEvent(eventObject.eventid);
              }
            });
          } else {
            console.log("error getting events from calendar");
          }
        })
        .catch(error => {
          console.log("error: " + error);
        });
    },
    createHours() {
      let currentHour = new Date().getHours();
      for (let i = currentHour; i <= currentHour + 23; i++) {
        i < 24 ? this.hours.push(i) : this.hours.push(i - 24);
      }
    },
    //box the mouse was pressed down on
    mouseDownBox(e) {
      this.mouseDownOn = e;
      e.currentTarget.classList.add("selected");
    },
    //box that the mouse was lifted up on
    mouseUpBox(e) {
      this.mouseUpOn = e;
      //reset selection
      this.resetSelection();
    },
    //box the mouse was moved over
    mouseOverBox(e) {
      //highlight only if mouse is down and isn't the mousedown box
      if (this.mouseDownOn) {
        e.currentTarget.classList.add("highlighted");
      }
    },
    //if mouse goes outside event manager then cancel selection
    //mouseOutEventManager() {
    //  this.resetSelection();
    //},
    resetSelection() {
      this.mouseDownOn = "";
      this.mouseUpOn = "";
      let selectedEls = document.getElementsByClassName("selected");
      while (selectedEls.length) {
        selectedEls[0].classList.remove("selected");
      }
      let highlightedEls = document.getElementsByClassName("highlighted");
      while (highlightedEls.length) {
        highlightedEls[0].classList.remove("highlighted");
      }
    }
  },
  components: {
    //Event,
    //NewEvent
  }
};
</script>

<style>
#eventManager {
  background-color: rgba(206, 187, 187, 0.116);
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  user-select: none;
}
.box {
  border-bottom: 1px solid rgb(158, 158, 158);
  border-right: 1px solid rgb(158, 158, 158);
  text-align: center;
  padding-top: 2vh;
  min-width: 4em;
  height: 100%;
}
.box:last-child {
  border-right: none;
}
.selected {
  background-color: rgb(76, 175, 80);
  color: white;
}
.highlighted {
  background-color: rgb(76, 175, 80, 0.5);
  color: white;
}
</style>
