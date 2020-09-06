<template>
  <v-container>
    <v-row
      v-for="calendarAndEditID in calendarAndEditIDs"
      :key="calendarAndEditID.calendarID"
    >
      <v-col>
        <Calendar
          :calendarID="calendarAndEditID.calendarID"
          :allowEditID="calendarAndEditID.allowEditID"
          @removeCalendarEmit="removeCalendarAndEditID"
        ></Calendar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import NewCalendar from "@/components/Calendar/NewCalendar.vue";
//import GetCalendar from "@/components/Calendar/GetCalendar.vue";
import Calendar from "@/components/Calendar/Calendar.vue";
import { calendarBus } from "@/main";

export default {
  name: "CalendarManager",
  props: ["possibleRouteCalendarID"],
  data() {
    return {
      //Array of objects made up of calendarID and allowEditID.
      calendarAndEditIDs: []
    };
  },
  mounted() {
    //If there is a routeCalendarID, for example if user browses to ubikal.com/abc123 then try to get it (from GetCalendar component)
    //Then go back to Home route, clearing the url of the calendarID
    if (this.$route.params.routeCalendarID) {
      calendarBus.$emit("routeEmit", this.$route.params.routeCalendarID);
      //this.$refs.GetCalendar.loadCalendar(this.$route.params.routeCalendarID);
      this.$router.push({ name: "Home" });
    }
    //listen for emits from calendar buttons
    calendarBus.$on("newCalendarEmit", calendarAndEditID => {
      this.addCalendarIDtoArray(calendarAndEditID);
    });
    calendarBus.$on("calendarIDFoundEmit", calendarAndEditID => {
      this.addCalendarIDtoArray(calendarAndEditID);
    });
    calendarBus.$on("calendarIDNotFoundEmit", calendarAndEditID => {
      this.calendarIDNotFound(calendarAndEditID);
    });
  },
  methods: {
    //Checks isCalendarIDUnique() before loading, so no duplicate calendars are added
    addCalendarIDtoArray(calendarAndEditID) {
      if (this.isCalendarIDUnique(calendarAndEditID.calendarID)) {
        this.calendarAndEditIDs.push(calendarAndEditID);
      } else {
        this.errorAlreadyAddedCalendarID = calendarAndEditID.calendarID;
      }
    },
    calendarIDNotFound(calendarID) {
      calendarBus.$emit("errorCalendarNotFoundEmit", calendarID);
    },
    //checks if calendarID has already been added.
    isCalendarIDUnique(calendarID) {
      calendarID = calendarID.toString();
      if (this.calendarAndEditIDs.some(e => e.calendarID === calendarID)) {
        calendarBus.$emit("errorCalendarAlreadyLoadedEmit", calendarID);
      } else {
        return true;
      }
    },
    removeCalendarAndEditID(calendarIDToRemove) {
      this.calendarAndEditIDs = this.calendarAndEditIDs.filter(
        e => e.calendarID !== calendarIDToRemove
      );
    }
  },
  components: {
    //NewCalendar,
    //GetCalendar,
    Calendar
  }
};
</script>

<style></style>
