<template>
  <v-layout row wrap ma-0>
   <v-flex xs12>
     <v-list>
       <v-list-tile v-if="index!='id'" v-for="(data,index) in singleExpense" :key="index">
         <!--<v-list-tile-action>-->
         <!--<v-icon v-if="item.icon" color="pink">star</v-icon>-->
         <!--</v-list-tile-action>-->

         <v-list-tile-content>
           <v-list-tile-title >{{data===true ? 'Paid' : data===false ? 'Due' : data}}</v-list-tile-title>
         </v-list-tile-content>

       </v-list-tile>
     </v-list>
   </v-flex>
    <v-flex xs12>
      <v-layout row style="margin: 0 -16px -16px">
        <v-flex class="single-expense-details-button"  v-ripple :class="[index==1 ? 'xs6' : 'xs3']"
                @click.prevent="action(expenseBottomNav.func)" v-for="(expenseBottomNav,index) in expenseBottomNavs" :key="expenseBottomNav.title">
          <v-layout column fill-height justify-center align-center>
            <v-flex>
              <v-icon>{{expenseBottomNav.icon}}</v-icon>
            </v-flex>
            <v-flex>
              <small>{{expenseBottomNav.title}}</small>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <!--<div class="row" style="margin:0 -24px -24px">-->
        <!--<a @click.prevent="" class="col s3 waves-effect single-expense-details-button" href="#">-->
          <!--&lt;!&ndash;<ion-icon name="trash"></ion-icon>&ndash;&gt;-->
          <!---->
        <!--</a>-->
        <!--<a @click.prevent="" class="col s6 waves-effect single-expense-details-button" href="#">-->
         <!---->
        <!--</a>-->
        <!--<a  class="col s3 waves-effect single-expense-details-button modal-trigger" href="#">-->
         <!---->
        <!--</a>-->
      <!--</div>-->
    </v-flex>
  </v-layout>
</template>

<script>
  import Storage from '../services/storage';

  const storage = new Storage();
  export default {
    name: "SingleExpenseDetails",
    props: ['singleExpenseData','posts'],
    data() {
      return {
        expenseBottomNavs: [
          {icon:'delete', title:'Delete', func: 'delete'},
          {icon:'attach_money', title:'Paid', func: 'paid'},
          {icon:'edit', title:'Edit', func: 'update'},
        ],
        monthlyExpenseData:[],
        singleExpense:{}
      }
    },
    mounted(){
      this.monthlyExpenseData = this.posts;
      this.singleExpense = this.singleExpenseData;

    },
    methods: {
      action(func){
        if(func == 'update'){
          this.update();
        }
        else if(func == 'paid'){
          if(!this.singleExpense.status){
            this.paid();
          }
        }
        else {
          this.delete();
        }
      },
      update()
      {
        this.$emit('update:component','AddorEditMonthlyExpense')
      },
      paid(){
        this.singleExpense.status = true;
        let index = _.findIndex(this.monthlyExpenseData, {id: this.singleExpense.id});

        this.monthlyExpenseData.splice(index, 1, this.singleExpense);
        this.setData(this.monthlyExpenseData);


      },
      delete(){
        let index = _.findIndex(this.monthlyExpenseData, {id: this.singleExpense.id});

        this.monthlyExpenseData.splice(index, 1);
        this.setData(this.monthlyExpenseData);
      },
      setData(data){
        storage.set('monthlyExpenseData', JSON.stringify(data)).then((value)=>{
          this.$emit('update:posts', JSON.parse(value));
          this.$emit('update:dialog',false);
        });
      }
    }
  }
</script>

<style lang="scss">
  .single-expense-details-button {
    color: #767691;
    // display: flex;
    //justify-content: center;
    padding-top: 7px !important;
    /*padding-bottom: 10px !important;*/
    height: 60px;
  }
</style>
