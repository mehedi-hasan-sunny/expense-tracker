<template>
  <v-layout row wrap ma-0>
    <v-flex xs12 v-for="(chart,index) in charts" :key="chart.component">
      <v-card class="mx-3 mt-3 card-rounded" :class="[charts.length-1==index ? 'mb-3' : 'mb-0']">
        <v-card-text>
          <Component :is="chart.component" :data="chart.data"></Component>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import LineChart from '../components/charts/Line';
  import BarChart from '../components/charts/Bar';
  export default {
    name: "Dashboard",
    components:{
      LineChart,
      BarChart
    },
    data(){
      return{
        charts:[
          {
            component:'LineChart',
            data : {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              datasets: [
                {
                  label: 'Line Chart',
                  backgroundColor: '#A56AF8',
                  data: [40, 20, 12, 60, 10]
                }
              ]
            },
          },
          {
            component:'BarChart',
            data : {
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
              datasets: [
                {
                  label: 'Bar Chart',
                  backgroundColor: '#8281F8',
                  data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                }
              ]
            },
          },

        ],
      }
    }
  }
</script>
<style lang="scss">
  .card-rounded {
    border-radius: 10px !important;
  }
</style>
