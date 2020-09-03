<template>
  <div id="app">
    <div id="wrapper">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <div id="innerApp">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#innerApp {
  grid-area: innerApp;
}

.entireCalendar {
  grid-area: entireCalendar;
}

#nav {
  grid-area: nav;
  padding: 4vh;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#wrapper {
  background-color: rgb(231, 231, 231);
  display: grid;
  grid-template-columns: 9fr 1fr;
  grid-template-areas: 
  "innerApp nav";
  justify-items: center;
}

body,
html {
  background-color: rgb(194, 191, 191);
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100%;
}
</style>
