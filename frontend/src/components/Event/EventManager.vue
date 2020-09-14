<template>
  <div id="eventManager" :style="{ position: 'relative' }">
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
    >
      <br />
      {{
        moment(moment.utc(hour).toDate())
          .local()
          .format("h:mm A ddd")
      }}
    </div>
    <v-card
      v-for="event in events"
      class="event"
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
      //box the pointer first brought down on
      pointerDownOn: "",
      //box the pointer brought up on
      pointerUpOn: "",
      //used in menu describing event. Note that 'end' will be one box forward compared to 'pointerUpOn',
      //because 'end' represents the endtime of the box, and pointerUpOn stores the begin time.
      start: "",
      end: "",
      event: "",
      //hours used for schedule
      hours: [],
      //increment in minutes for each slot in the schedule
      minuteIncrement: 5,
      //list of events
      events: [],
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
    //inefficient way to keep events updated :(
    setInterval(this.loadEvents, 1000);
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
    removeEventID() {
      //send delete
    },
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
    //only allow event creation mouse actions if allowEditID exists (will validate on backend that allowEditID matches to calendarID)
    //box the pointer was pressed down on
    pointerDownBox(e) {
      if (this.allowEditID) {
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
        //Note that 'end' will be one box forward compared to 'pointerUpOn',
        //because 'end' represents the endtime of the box, and pointerUpOn stores the begin time.
        this.end = moment
          .utc(this.pointerUpOn)
          .add(this.minuteIncrement, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
        if (this.start > this.end) {
          let temp = this.start;
          this.start = this.end;
          this.end = temp;
        }
        this.show(e);
      }
    },
    //box the pointer was moved over
    pointerOverBox(e) {
      if (this.allowEditID) {
        //highlight only if pointer is down and isn't the pointerdown box
        if (this.pointerDownOn && !this.showMenu) {
          e.currentTarget.classList.add("highlighted");
        }
      }
    },
    //if pointer goes outside event manager then cancel selection
    //pointerOutEventManager() {
    //  this.resetSelection();
    //},
    //resets selected time elements
    resetSelection() {
      this.pointerDownOn = "";
      this.pointerUpOn = "";
      let selectedEls = document.getElementsByClassName("selected");
      while (selectedEls.length) {
        selectedEls[0].classList.remove("selected");
      }
      let highlightedEls = document.getElementsByClassName("highlighted");
      while (highlightedEls.length) {
        highlightedEls[0].classList.remove("highlighted");
      }
    },
    //Get datetime the calendar was created.
    //Then starting at the beginning of the previous hour, add x minute increments
    createHours() {
      let startCalendar = moment(this.dateTimeCreatedUTC).startOf("hour");
      for (let i = 0; i <= 23; i++) {
        this.hours.push(
          moment(startCalendar)
            .add(i * this.minuteIncrement, "minutes")
            .format("YYYY-MM-DD HH:mm:ss")
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
  color: grey;
}
.box {
  text-align: left;
  padding-top: 6vh;
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
  margin-top: 6vh;
  opacity: 0.8;
  background-color: rgba(33, 149, 243, 0.8);
  color: white;
  z-index: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
