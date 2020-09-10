<template>
  <v-container fluid class="home">
    <CalendarManager
      routeCalendarID="this.$route.params.routeCalendarID"
    ></CalendarManager>
  </v-container>
</template>

<script>
// @ is an alias to /src
import CalendarManager from "@/components/Calendar/CalendarManager.vue";

export default {
  name: "Home",
  components: {
    CalendarManager
  }
};
</script>
