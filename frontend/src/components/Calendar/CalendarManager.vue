<template>
  <div>
    <div class="CalendarManagerControls">
      <br />
      <NewCalendar @newCalendarEmit="addCalendarIDtoArray"></NewCalendar>
      <br />
      <GetCalendar
        ref="GetCalendar"
        @calendarIDFoundEmit="addCalendarIDtoArray"
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
      <div
        v-for="calendarAndEditID in calendarAndEditIDs"
        :key="calendarAndEditID.calendarID"
      >
        <Calendar
          :calendarID="calendarAndEditID.calendarID"
          :allowEditID="calendarAndEditID.allowEditID"
          @removeCalendarEmit="removeCalendarAndEditID"
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
  props: ["possibleRouteCalendarID"],
  data() {
    return {
      //Array of objects made up of calendarID and allowEditID.
      calendarAndEditIDs: [],
      //Error messages
      errorNotFoundCalendarID: "",
      errorAlreadyAddedCalendarID: ""
    };
  },
  //If there is a routeCalendarID, for example if user browses to ubikal.com/abc123 then try to get it (from GetCalendar component)
  mounted() {
    if (this.$route.params.routeCalendarID) {
      this.$refs.GetCalendar.loadCalendar(this.$route.params.routeCalendarID);
      this.$router.push({ name: "Home" });
    }
  },
  methods: {
    //Checks isCalendarIDUnique() before loading, so no duplicate calendars are added
    addCalendarIDtoArray(calendarAndEditID) {
      this.resetErrors();
      if (this.isCalendarIDUnique(calendarAndEditID.calendarID)) {
        this.resetErrors();
        this.calendarAndEditIDs.push(calendarAndEditID);
      } else {
        this.errorAlreadyAddedCalendarID = calendarAndEditID.calendarID;
      }
    },
    calendarIDNotFound(calendarID) {
      this.errorNotFoundCalendarID = calendarID;
    },
    //Returns true if calendarID has already been added.
    isCalendarIDUnique(calendarID) {
      calendarID = calendarID.toString();
      return !this.calendarAndEditIDs.some(e => e.calendarID === calendarID);
    },
    removeCalendarAndEditID(calendarIDToRemove) {
      this.resetErrors();
      this.calendarAndEditIDs = this.calendarAndEditIDs.filter(
        e => e.calendarID !== calendarIDToRemove
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

<style></style>
