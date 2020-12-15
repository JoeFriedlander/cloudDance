<template>
  <v-app>
    <v-app-bar app elevation="2">
      <v-spacer></v-spacer>
        <GetCalendar class="ml-12 mr-12 mt-7" />
        <NewCalendar class="mt-1" />
      <v-spacer></v-spacer>
      <v-img src="@/assets/cloudDanceLogo.png"
        class ="mr-12 mt-1"
        max-height="90%"
        max-width="20%" 
        contain
      />
      <a href="https://github.com/JoeFriedlander/cloudDance" title="github.com/JoeFriedlander/cloudDance">
        <v-img src="@/assets/GitHub-Mark-32px.png" class="mt-1" contain />
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
