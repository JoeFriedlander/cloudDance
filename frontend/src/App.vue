<template>
  <v-app>
    <!-- <v-app-bar app>
      <v-btn to="/">Home</v-btn>
      <v-btn to="/about">About</v-btn>
    </v-app-bar> !-->
    <v-main>
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-main>
  </v-app>
</template>
