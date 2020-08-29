<template>
  <div>
    <form @submit.prevent="removeCalendar">
      <button type="submit">
        Remove Calendar From View
      </button>
    </form>
    Calendar ID: {{ calendarID }}
  </div>
</template>

<script>
export default {
  name: "Calendar",
  props: ["calendarID"],
  methods: {
    removeCalendar() {
      this.$emit("removeCalendarEmit", this.calendarID);
    },
    deleteCalendar() {}
  }
};
</script>

<style></style>
