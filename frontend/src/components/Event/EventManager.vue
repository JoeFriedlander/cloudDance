<template>
  <div id="eventManager">
    <v-menu
      v-model="showMenu"
      :close-on-click="menuDelayAllowClose"
      :close-on-content-click="false"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-card>
        <v-form @submit.prevent="showMenu = false">
          <v-list>
            <v-list-item>
              <v-text-field
                v-model="eventDescription"
                autofocus
                placeholder="event"
              ></v-text-field
            ></v-list-item>
            <v-list-item> start: {{ this.mouseUpOn }} ></v-list-item>
            <v-list-item> end: {{ this.mouseDownOn }} ></v-list-item>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showMenu = false">cancel</v-btn>
            <v-btn color="success" text @click="showMenu = false">save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-menu>
    <div
      class="box"
      v-for="hour in hours"
      :key="hour"
      v-bind:id="hour"
      @pointerdown="mouseDownBox"
      @pointerup="mouseUpBox"
      @pointerover="mouseOverBox"
    >
      ok <br />
      {{ hour }}
    </div>
    <NewEvent></NewEvent>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import NewEvent from "@/components/Event/NewEvent.vue";
//When event manager is mounted it gets a list of all eventIDs

export default {
  name: "EventManager",
  props: ["calendarID", "allowEditID"],
  data() {
    return {
      //box the mouse first brought down on
      mouseDownOn: "",
      //box the mouse brought up on
      mouseUpOn: "",
      start: "",
      end: "",
      event: "",
      eventIDs: [],
      hours: [],
      showMenu: false,
      //Prevents menu from closing automatically when pointer lifted up
      menuDelayAllowClose: false,
      x: 0,
      y: 0
    };
  },
  mounted: function() {
    this.createHours();
    this.loadEventsFromCalendar();
  },
  methods: {
    show(e) {
      this.menuDelayAllowClose = false;
      e.preventDefault();
      this.showMenu = true;
      this.x = e.clientX;
      this.y = e.clientY;
      setTimeout(() => {
        this.menuDelayAllowClose = true;
      }, 250);
    },
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
        i < 24 ? this.hours.push(i + ":00") : this.hours.push(i - 24 + ":00");
      }
    },
    //box the mouse was pressed down on
    mouseDownBox(e) {
      this.mouseDownOn = e;
      e.currentTarget.classList.add("selected");
    },
    //box that the mouse was lifted up on, means selection is complete
    mouseUpBox(e) {
      this.mouseUpOn = e;
      this.show(e);
      //emit begin new event
      eventBus.$emit("beginNewEventEmit", {
        calendarID: this.calendarID,
        allowEditID: this.allowEditID,
        mouseDownOn: this.mouseDownOn.target.id,
        mouseUpOn: this.mouseUpOn.target.id
      });
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
    NewEvent
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
.selected {
  background-color: rgb(76, 175, 80);
  color: white;
}
.highlighted {
  background-color: rgb(76, 175, 80, 0.5);
  color: white;
}
</style>
