<template>
  <div>
    <div class="CalendarManagerControls">
      <br />
      <NewCalendar @newCalendarEmit="loadNewCalendarID"></NewCalendar>
      <br />
      <GetCalendar
        @calendarIDFoundEmit="loadExistingCalendarID"
        @CalendarIDNotFoundEmit="calendarIDNotFound"
      ></GetCalendar>
      <div v-if="errorNotFoundCalendarID">
        Error: Calendar {{ errorNotFoundCalendarID }} not found
      </div>
      <div v-else-if="errorAlreadyAddedCalendarID">
        Error: Calendar {{ errorAlreadyAddedCalendarID }} already loaded
      </div>
      <!-- linebreak so calendar error doesn't push everything else down. fix in css -->
      <div v-else><br /></div>
    </div>
    <ul>
      <div v-for="calendarID in calendarIDs" :key="calendarID">
        <Calendar
          :calendarID="calendarID"
          @removeCalendarEmit="removeCalendarID"
        ></Calendar>
        <br />
      </div>
    </ul>
  </div>
</template>

<script>
import NewCalendar from "@/components/Calendar/NewCalendar.vue";
import GetCalendar from "@/components/Calendar/GetCalendar.vue";
import Calendar from "@/components/Calendar/Calendar.vue";

export default {
  name: "CalendarManager",
  data() {
    return {
      calendarIDs: [],
      errorNotFoundCalendarID: "",
      errorAlreadyAddedCalendarID: ""
    };
  },
  methods: {
    loadNewCalendarID(calendarID) {
      this.resetErrors();
      this.calendarIDs.push(calendarID);
    },
    //Checks isCalendarIDUnique() before loading, so no duplicate calendars are viewed
    loadExistingCalendarID(calendarID) {
      this.resetErrors();
      if (this.isCalendarIDUnique(calendarID)) {
        this.resetErrors();
        this.calendarIDs.push(calendarID);
      } else {
        this.errorAlreadyAddedCalendarID = calendarID;
      }
    },
    calendarIDNotFound(calendarID) {
      this.errorNotFoundCalendarID = calendarID;
    },
    //Returns true if calendarID has already been added.
    isCalendarIDUnique(calendarID) {
      return !this.calendarIDs.includes(calendarID);
    },
    removeCalendarID(calendarIDToRemove) {
      this.resetErrors();
      this.calendarIDs = this.calendarIDs.filter(
        calendarID => calendarID !== calendarIDToRemove
      );
    },
    //Sets all calendar errors back to empty string
    resetErrors() {
      this.errorNotFoundCalendarID = "";
      this.errorAlreadyAddedCalendarID = "";
    }
  },
  components: {
    NewCalendar,
    GetCalendar,
    Calendar
  }
};
</script>

<style>
.CalendarManagerControls {
  border: 1px solid black;
  padding: 5px;
  background-color: rgba(52, 199, 64, 0.116);
  width: 30%;
  margin: 0 auto;
  text-align: left;
}
</style>
