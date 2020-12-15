<template>
  <div
    id="eventManager"
    @pointerleave="pointerOutEventManager"
    :style="{ position: 'relative' }"
  >
    <v-menu
      v-model="showMenu"
      :close-on-click="menuDelayAllowClose"
      :close-on-content-click="false"
      :position-x="x + 25"
      :position-y="y"
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
              {{
                moment(moment.utc(start).toDate())
                  .local()
                  .format("h:mm A dddd")
              }}
              -
              {{
                moment(moment.utc(end).toDate())
                  .local()
                  .format("h:mm A dddd")
              }}
            </v-list-item>
          </v-list>
          <v-card-actions class="mt-n4">
            <v-spacer></v-spacer>
            <v-btn text @click="showMenu = false">cancel</v-btn>
            <v-btn
              color="success"
              text
              @click.stop="
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
      v-for="hour in hours"
      class="box"
      :key="hour"
      v-bind:id="hour"
      @pointerdown="pointerDownBox"
      @pointerup="pointerUpBox"
      @pointerover="pointerOverBox"
      @pointerleave="pointerLeaveBox"
    >
      {{
        moment(moment.utc(hour).toDate())
          .local()
          .format("h:mm A ddd")
      }}
    </div>
    <v-card
      v-for="event in events"
      class="event elevation-8"
      color="info"
      dark
      :key="event.eventid"
      v-bind:id="event.eventid"
      :style="{
        left: getEventLeft(event),
        width: getEventWidth(event),
        position: 'absolute'
      }"
    >

        <v-spacer />
        <v-btn
          @click="deleteCalendar"
          class="deleteButton"
          :disabled="!allowEditID"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>

      {{ event.eventdescription }}
    </v-card>
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
      // -----------------------------------
      // Event variables
      // -----------------------------------
      //box the pointer first brought down on
      pointerDownOn: "",
      //box the pointer brought up on
      pointerUpOn: "",
      //used in menu describing event. Note that 'end' will be one box forward compared to 'pointerUpOn',
      //because 'end' represents the endtime of the box, and pointerUpOn stores the begin time.
      start: "",
      end: "",
      event: "",
      //when mouse is moved out of a box
      pointerJustLeft: "",
      //list of events
      events: [],
      //show menu bool
      showMenu: false,
      //Prevents menu from closing automatically when pointer lifted up
      menuDelayAllowClose: false,
      //Menu positioning
      x: 0,
      y: 0,
      // -----------------------------------
      // Time variables
      // -----------------------------------
      //hours used for schedule
      hours: [],
      //increment in minutes for each slot in the schedule
      minuteIncrement: 5
    };
  },
  mounted: function() {
    this.createHours();
    //inefficient way to keep events updated :(
    setInterval(this.loadEvents, 1000);
    //Issue with event element position not being recalculated on window resize
    //Possibly each event element's position should be a computed property instead
    window.addEventListener("resize", () => {
      this.$forceUpdate();
    });
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
    // -----------------------------------
    // Clicking and Dragging Methods
    // Only allow event creation mouse actions if allowEditID exists (will also validate on backend that allowEditID matches to calendarID)
    // -----------------------------------
    //
    //box the pointer was pressed down on
    pointerDownBox(e) {
      if (this.allowEditID) {
        this.resetSelection();
        this.pointerDownOn = e.target.id;
        e.currentTarget.classList.add("selected");
      }
    },
    //box that the pointer was lifted up on, means date/time selection is complete and open menu
    pointerUpBox(e) {
      if (this.allowEditID) {
        this.pointerUpOn = e.target.id;
        this.event = "";
        this.start = this.pointerDownOn;
        this.end = this.pointerUpOn;
        if (this.start <= this.end) {
          this.start = this.pointerDownOn;
          this.end = this.pointerUpOn;
          //If cursor is dragged back instead of forward, switch start and end
        } else {
          let temp = this.start;
          this.start = this.end;
          this.end = temp;
        }
        //Note that 'end' will be one box forward compared to 'pointerUpOn',
        //because 'end' represents the endtime of the box, and pointerUpOn stores the begin time.
        this.end = moment
          .utc(this.end)
          .add(this.minuteIncrement, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
        //show menu only if there is a start. fixes issue if mousedown outside event manager and mouseup inside it
        if (this.start) this.show(e);
      }
    },
    //box the pointer was moved over while being dragged
    pointerOverBox(e) {
      if (this.allowEditID) {
        //highlight only if the box isn't the pointerdown box (don't overwrite existing pointerdown select class)
        if (
          this.pointerDownOn &&
          !this.showMenu &&
          e.target.id != this.pointerDownOn
        ) {
          e.currentTarget.classList.add("highlighted");
        }
        //If this box is closer to pointerDownBox than the one the mouse just exited, remove that other box's highlight
        let currentBoxDistance = Math.abs(
          moment(this.pointerDownOn).diff(e.target.id, "minutes")
        );
        let justLeftBoxDistance = Math.abs(
          moment(this.pointerDownOn).diff(this.pointerJustLeft, "minutes")
        );
        if (currentBoxDistance < justLeftBoxDistance && !this.showMenu) {
          document
            .getElementById(String(this.pointerJustLeft))
            .classList.remove("highlighted");
        }
      }
    },
    pointerLeaveBox(e) {
      this.pointerJustLeft = e.target.id;
    },
    //if pointer goes outside event manager and menu isn't active then reset selection
    pointerOutEventManager() {
      if (!this.showMenu) this.resetSelection();
    },
    //resets selected time elements
    resetSelection() {
      this.pointerDownOn = "";
      this.pointerUpOn = "";
      this.dragDirection = "none";
      let selectedEls = document.getElementsByClassName("selected");
      while (selectedEls.length) {
        selectedEls[0].classList.remove("selected");
      }
      let highlightedEls = document.getElementsByClassName("highlighted");
      while (highlightedEls.length) {
        highlightedEls[0].classList.remove("highlighted");
      }
    },
    // -----------------------------------
    // Menu and event submission
    // -----------------------------------
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
    },
    // -----------------------------------
    // Event loading, deleting, and rendering
    // -----------------------------------
    loadEvents() {
      fetch(
        process.env.VUE_APP_APISERVER +
          "api/events?calendarID=" +
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
              if (JSON.stringify(response) == JSON.stringify(this.events)) {
                // local events same as server, no update
              } else {
                // if local events different from server, re-initialize local list of events and load from server
                this.events = [];
                for (let eventObject of response) {
                  this.events.push(eventObject);
                }
              }
            });
          } else {
            console.log("error getting events from calendar");
          }
        })
        .then(() => {
          //
        })
        .catch(error => {
          console.log("error: " + error);
        });
    },
    // todo get all style variables in one loop
    // Matches event starttime to corresponding time element to get the initial css left
    getEventLeft(event) {
      for (let hour of this.hours) {
        if (String(hour) == String(event.starttime)) {
          return (
            document.getElementById(String(hour)).getBoundingClientRect().left -
            24 +
            "px"
          );
        }
      }
    },
    //Gets width by subtracting endtime from starttime for total time.
    //Then divides by the minute increment to find how many boxes forward it should go
    getEventWidth(event) {
      let totalEventTime = moment(event.endtime).diff(
        event.starttime,
        "minutes"
      );
      let totalEventBoxes = totalEventTime / this.minuteIncrement;
      for (let hour of this.hours) {
        if (String(hour) == String(event.starttime)) {
          return (
            document.getElementById(String(hour)).getBoundingClientRect()
              .width *
              totalEventBoxes +
            "px"
          );
        }
      }
    },
    removeEventID() {
      //send delete
    },
    // -----------------------------------
    // Time Creation
    // -----------------------------------
    //Get datetime the calendar was created.
    //Then starting at the floor of the nearest 5 minutes, add x minute increments
    createHours() {
      let minute = moment(this.dateTimeCreatedUTC).minutes()
      let startMinute = 0;
      if (minute < 5) {
        startMinute = 0;
      } 
      else if (minute < 10) {
        startMinute = 5;
      }
      else if (minute < 15) {
        startMinute = 10;
      }
      else if (minute < 20) {
        startMinute = 15;
      }
      else if (minute < 25) {
        startMinute = 20;
      }
      else if (minute < 30) {
        startMinute = 25;
      }
      else if (minute < 35) {
        startMinute = 30;
      }
      else if (minute < 40) {
        startMinute = 35;
      }
      else if (minute < 45) {
        startMinute = 40;
      }
      else if (minute < 50) {
        startMinute = 45;
      }
      else if (minute < 55) {
        startMinute = 50;
      }
      else if (minute < 60) {
        startMinute = 55;
      }

      console.log("minute" + minute)
      console.log("startminute" + startMinute)
      let startCalendar = moment(this.dateTimeCreatedUTC).set({minute: startMinute});
      for (let i = 0; i <= 23; i++) {
        this.hours.push(
          moment(startCalendar)
            .add(i * this.minuteIncrement, "minutes")
            .format("YYYY-MM-DD HH:mm:ss")
        );
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
  color: grey;
}
.box {
  text-align: left;
  padding-top: 8vh;
  min-width: 4em;
  height: 100%;
  z-index: 2;
  opacity: 0.5;
  font-size: 0.9em;
}
.selected {
  background-color: rgb(76, 175, 80);
  color: white;
}
.highlighted {
  background-color: rgba(76, 175, 79, 0.637);
  color: white;
}
.hasEvent {
  background-color: "blue";
}
.event {
  margin-top: 2vh;
  opacity: 0.8;
  background-color: rgba(33, 149, 243, 0.8);
  color: white;
  z-index: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
