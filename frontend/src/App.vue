<template>
  <v-app>
    <v-app-bar app elevation="2">
      <v-spacer></v-spacer>
      <NewCalendar class="mr-12" />
      <GetCalendar class="mt-6" />
      <v-spacer></v-spacer>
      <a href="https://github.com/JoeFriedlander/ubiKal">
        <img src="@/assets/GitHub-Mark-32px.png" class="mt-1" />
      </a>
      <!-- <v-btn to="/">Home</v-btn>
      <v-btn to="/about">About</v-btn> -->
    </v-app-bar>
    <v-main>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
import NewCalendar from "@/components/Calendar/NewCalendar.vue";
import GetCalendar from "@/components/Calendar/GetCalendar.vue";
export default {
  components: {
    NewCalendar,
    GetCalendar
  }
};
</script>

<style>
/* removes auto-capitalization for button text */
.v-btn {
  text-transform: none !important;
}
</style>
