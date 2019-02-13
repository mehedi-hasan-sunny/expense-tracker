<template>
  <v-card :color="settings.darkMode ? '#212121' : '#ffffff'" :dark="settings.darkMode" flat height="100vh">
    <v-toolbar :color="settings.darkMode ? '#212121' : '#ffffff'">
      <div :dark="settings.darkMode" @click="$emit('update:settingsModal', false)" icon v-ripple>
        <v-icon>arrow_back</v-icon>
      </div>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-list subheader two-line>
      <v-subheader>Notification</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Daily</v-list-tile-title>
          <v-list-tile-sub-title>Notifies you to enter your daily expense</v-list-tile-sub-title>
          <v-list-tile-sub-title class="caption">Default: At 10.01pm</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action class="min-w-auto">
          <v-checkbox v-model="settings.dailyNotifications"></v-checkbox>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Monthly</v-list-tile-title>
          <v-list-tile-sub-title>Notifies you to pay your monthly bills/ expenses</v-list-tile-sub-title>
          <v-list-tile-sub-title class="caption">Default: Every 5th of month at 10.01am</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action class="min-w-auto">
          <v-checkbox v-model="settings.monthlyNotifications"></v-checkbox>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list subheader>
      <v-subheader>Theme</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-list-tile-title>Dark Mode</v-list-tile-title>
          <v-list-tile-sub-title>Applies dark theme</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action class="min-w-auto">
          <v-switch color="success" v-model="settings.darkMode"></v-switch>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <!--<v-divider></v-divider>-->
    <v-snackbar :timeout="snackbar.timeout" v-model="snackbar.value">{{snackbar.text}}</v-snackbar>
  </v-card>
</template>

<script>
  import Storage from '../../services/storage';

  const storage = new Storage();

  export default {
    name: "Settings",
    data() {
      return {
        settings: {
          dailyNotifications: true,
          monthlyNotifications: true,
          darkMode: false,
        },
        dataReceivedCounter: 0,
        snackbar: {
          text: '',
          value: false,
          timeout: 1800,
        },
        notification: {},
      }
    },
    created() {
      this.getSettingsData();
      let checkMobilePlatform = (navigator.userAgent.match(/mobile/i)) ? true : false;
      console.log(checkMobilePlatform);
      if (checkMobilePlatform) {
        this.notification = cordova.plugins.notification.local;
      }
    },
    mounted() {
      let instance = this;
      document.addEventListener("backbutton", function () {
        instance.$emit('update:settingsModal', false);
        instance.$eventHub.$emit('resetCounter', 0);
      }, false);
    },
    methods: {
      saveSettingsData() {
        storage.set('settingsData', JSON.stringify(this.settings));
      },
      getSettingsData() {
        storage.get('settingsData').then((value) => {
          if (value != null) {
            this.settings = JSON.parse(value);
          } else {
            this.dataReceivedCounter++;
          }
        });
      }
    },
    watch: {
      settings: {
        handler(val) {
          if (this.dataReceivedCounter > 0) {
            this.saveSettingsData();
            //  console.log('hi'+ this.dataReceivedCounter,val);
          }
          this.dataReceivedCounter++;
        },
        deep: true
      },
      'settings.dailyNotifications'(val) {
        if (val) {
          this.notification.schedule({
            id: 1,
            // title: "",
            text: 'Have you entered today\'\s expense? ',
            smallIcon: 'res://icon',
            icon: "res://icon",
            color: '#ff0000',
            trigger: {every: {hour: 22, minute: 1, second: 0}},
            foreground: true
          });
        } else {
          let instance = this;
          instance.snackbar.value = false;
          this.notification.cancel(1, function () {
            instance.snackbar.text = 'You will not get daily notifications';
            instance.snackbar.value = true;
          });
        }
      },
      'settings.monthlyNotifications'(val) {
        if (val) {
          this.notification.schedule({
            id: 2,
            title: "Time to pay your monthly bills",
            smallIcon: 'res://icon',
            icon: "res://icon",
            color: '#ff0000',
            trigger: {every: {day: 5, hour: 10, minute: 1, second: 0}},
            foreground: true
          });

        } else {
          let instance = this;
          instance.snackbar.value = false;
          this.notification.cancel(2, function () {
            instance.snackbar.text = 'You will not get any monthly notifications';
            instance.snackbar.value = true;
          });
        }
      },
      'settings.darkMode'(val) {
        if (val) {
          setTimeout(function () {
            StatusBar.backgroundColorByHexString('#212121');
            StatusBar.styleBlackOpaque();
            NavigationBar.backgroundColorByHexString('#212121');
          }, 65)
        } else {
          setTimeout(function () {
            StatusBar.backgroundColorByHexString('#ffffff');
            StatusBar.styleDefault();
            NavigationBar.backgroundColorByHexString('#ffffff');
          }, 65)
        }
      }
    }
  }
</script>

<style scoped>
  .min-w-auto {
    min-width: auto;
  }


</style>
