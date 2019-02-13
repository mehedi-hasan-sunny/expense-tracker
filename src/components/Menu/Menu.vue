<template>
  <v-card :color="settingsData.darkMode ? '#414345' : '#ffffff'" :dark="settingsData.darkMode" class="modal-form">
    <h5 class="subheading text-xs-center pa-3">Home Expense Manager</h5>

    <v-list class="py-0 menu-items">
      <v-list-tile @click="menuAction('Notifications')" v-ripple>
        <v-list-tile-action class="justify-center">
          <v-icon>notifications</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title> Notifications</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="menuAction('Settings')" v-ripple>
        <v-list-tile-action class="justify-center">
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title> Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action class="justify-center">
          <v-icon>help_outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title> Help & feedback</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    name: "Menu",
    props:['settingsData'],
    data(){
      return{
        checkSettingsModalOpen: false,
      }
    },
    created(){
      let instance = this;
      this.$eventHub.$on('checkSettingsModalOpen', function (value) {
        instance.checkSettingsModalOpen = value;
      });
    },
    mounted(){
      let instance = this;
      document.addEventListener("backbutton", function () {
        if(!instance.checkSettingsModalOpen)
        {
          instance.$emit('update:menu', false);
        }
      },false);
    },
    methods:{
      menuAction(action){
        this.$emit('update:settingsModal', true)
        this.$emit('update:menuComponent', action)
        this.checkSettingsModalOpen = true;
      },
    }
  }
</script>

<style scoped>

</style>
