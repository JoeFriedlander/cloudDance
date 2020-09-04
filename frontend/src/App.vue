<template>
  <v-app>
    <v-app-bar app elevation="2">
      <v-container fluid>
        <v-row justify="center" align="center">
          <v-toolbar-items>
            <v-col>
              <NewCalendar />
            </v-col>
            <v-col>
              <GetCalendar />
            </v-col>
          </v-toolbar-items>
        </v-row>
      </v-container>
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
