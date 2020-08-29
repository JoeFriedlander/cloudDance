<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <CalendarManager></CalendarManager>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
//import Clicker from "@/components/Clicker.vue";
//import EnterEvent from "@/components/EnterEvent.vue";
import CalendarManager from "@/components/Calendar/CalendarManager.vue";

export default {
  name: "Home",
  components: {
    //HelloWorld,
    //Clicker,
    //EnterEvent,
    CalendarManager
  }
};
</script>
