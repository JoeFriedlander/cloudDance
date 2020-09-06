<template>
  <div id="eventManager">
    <v-menu
      v-model="showMenu"
      :close-on-click="menuDelayAllowClose"
      :close-on-content-click="false"
      :position-x="x + 25"
      :position-y="y - 25"
      absolute
      offset-y
    >
      <v-card>
        <v-form
          @submit.prevent="
            () => {
              newEvent();
              showMenu = false;
            }
          "
        >
          <v-list dense>
            <v-list-item>
              <v-text-field
                class="mt-n1"
                v-model="event"
                autofocus
                color="grey"
                placeholder="event"
              ></v-text-field
            ></v-list-item>
            <v-list-item class="mt-n4">
              {{ moment(this.start).format("h a dddd") }} -
              {{ moment(this.end).format("h a dddd") }}
            </v-list-item>
          </v-list>
          <v-card-actions class="mt-n4">
            <v-spacer></v-spacer>
            <v-btn text @click="showMenu = false">cancel</v-btn>
            <v-btn
              color="success"
              text
              @click="
                () => {
                  newEvent();
                  showMenu = false;
                }
              "
              >save</v-btn
            >
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
      <br />
      {{ moment(hour).format("h a dddd") }}
    </div>
    <NewEvent></NewEvent>
  </div>
</template>

<script>
import { eventBus } from "@/main";
import NewEvent from "@/components/Event/NewEvent.vue";
import moment from "moment";

export default {
  name: "EventManager",
  props: ["calendarID", "allowEditID", "dateTimeCreatedUTC"],
  data() {
    return {
      //box the mouse first brought down on
      mouseDownOn: "",
      //box the mouse brought up on
      mouseUpOn: "",
      //used in menu describing event
      start: "",
      end: "",
      event: "",
      //hours used for schedule
      hours: [],
      //list of events
      eventIDs: [],
      //show menu bool
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
  watch: {
    //when showMenu changes to false (menu closes) then reset the selected elements
    showMenu() {
      if (this.showMenu === false) {
        this.resetSelection();
      }
    }
  },
  methods: {
    //shows menu
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
    //box the mouse was pressed down on
    mouseDownBox(e) {
      this.mouseDownOn = e.target.id;
      e.currentTarget.classList.add("selected");
    },
    //box that the mouse was lifted up on, means date/time selection is complete and open menu
    mouseUpBox(e) {
      this.mouseUpOn = e.target.id;
      this.event = "";
      this.start = this.mouseDownOn;
      this.end = this.mouseUpOn;
      if (this.start > this.end) {
        let temp = this.start;
        this.start = this.end;
        this.end = temp;
      }
      this.show(e);
    },
    //box the mouse was moved over
    mouseOverBox(e) {
      //highlight only if mouse is down and isn't the mousedown box
      if (this.mouseDownOn && !this.showMenu) {
        e.currentTarget.classList.add("highlighted");
      }
    },
    //if mouse goes outside event manager then cancel selection
    //mouseOutEventManager() {
    //  this.resetSelection();
    //},
    //resets selected time elements
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
    },
    dateTimeCreatedLocal() {
      return moment.utc(this.dateTimeCreatedUTC).local();
    },
    createHours() {
      for (let i = 0; i <= 23; i++) {
        this.hours.push(
          moment(this.dateTimeCreatedLocal())
            .add(i, "hours")
            .startOf("hour")
            .format()
        );
      }
    },
    //when form is submitted emit new event
    newEvent() {
      //emit new event
      eventBus.$emit("newEventEmit", {
        calendarID: this.calendarID,
        event: this.event,
        allowEditID: this.allowEditID,
        start: this.start,
        end: this.end
      });
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
  color: grey;
}
.selected {
  background-color: rgb(76, 175, 80);
  color: white;
}
.highlighted {
  background-color: rgba(76, 175, 79, 0.637);
  color: white;
}
</style>
