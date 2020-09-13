<template>
  <v-container fluid>
    <v-row v-for="calendar in calendars" :key="calendar.calendarID">
      <v-col>
        <Calendar
          :calendarID="calendar.calendarID"
          :allowEditID="calendar.allowEditID"
          :dateTimeCreatedUTC="calendar.dateTimeCreatedUTC"
          @removeCalendarEmit="removeCalendar"
        ></Calendar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Calendar from "@/components/Calendar/Calendar.vue";
import { calendarBus } from "@/main";

export default {
  name: "CalendarManager",
  props: ["possibleRouteCalendarID"],
  data() {
    return {
      //Array of objects made up of calendarID, allowEditID, and dateTimeCreatedUTC.
      calendars: []
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
    calendarBus.$on("newCalendarEmit", calendar => {
      this.addCalendarToArray(calendar);
    });
    calendarBus.$on("calendarIDFoundEmit", calendar => {
      this.addCalendarToArray(calendar);
    });
    calendarBus.$on("calendarIDNotFoundEmit", calendar => {
      this.calendarIDNotFound(calendar);
    });
  },
  methods: {
    //Checks isCalendarIDUnique() before loading, so no duplicate calendars are added
    addCalendarToArray(calendar) {
      if (this.isCalendarIDUnique(calendar.calendarID)) {
        this.calendars.push(calendar);
      } else {
        this.errorAlreadyAddedCalendarID = calendar.calendarID;
      }
    },
    calendarIDNotFound(calendarID) {
      calendarBus.$emit("errorCalendarNotFoundEmit", calendarID);
    },
    //checks if calendarID has already been added.
    isCalendarIDUnique(calendarID) {
      calendarID = calendarID.toString();
      if (this.calendars.some(e => e.calendarID === calendarID)) {
        calendarBus.$emit("errorCalendarAlreadyLoadedEmit", calendarID);
      } else {
        return true;
      }
    },
    removeCalendar(calendarIDToRemove) {
      this.calendars = this.calendars.filter(
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
