<template>
  <div>
    <p class="title">{{ singleExpenseData ? 'Edit' : 'Add'}}</p>
    <v-form>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field v-model="monthlyExpense.title"  label="Expense title"></v-text-field>
        </v-flex>

        <v-flex xs12>
          <v-text-field v-model="monthlyExpense.bill" label="Bill" required></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-switch v-model="monthlyExpense.status" :label="`Bill is ${[monthlyExpense.status ? 'paid' : 'due']}`" color="success" class="text-xs-Left"></v-switch>
          <!--<v-text-field v-model="monthlyExpense.status" label="Bill" required></v-text-field>-->
        </v-flex>

      </v-layout>
    </v-form>
    <v-btn fab fixed right dark color="#8281F8" @click="saveMonthlyExpenseData()" class="fab-done-btn">
      <v-icon dark>done</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import Storage from '../services/storage';

  const storage = new Storage();
  export default {
    name: "AddorEditMonthlyExpense",
    props:['singleExpenseData'],
    data() {
      return {
        monthlyExpense: {
          id: null,
          title: null,
          bill: null,
          status: false,
        }
      }
    },
    created(){

      //console.log('hi')
    },
    mounted() {
      let instance = this;
      //instance.monthlyExpense = instance.singleExpenseData;
      console.log(this.singleExpenseData)
      if(this.singleExpenseData){
        this.$nextTick(function () {
          instance.monthlyExpense = instance.singleExpenseData;
        })
        console.log(this.singleExpenseData)

      }
      // M.AutoInit();
      // M.updateTextFields();
      // document.addEventListener('DOMContentLoaded', function() {
      //   var elems = document.querySelectorAll('.timepicker');
      //   var instances = M.Timepicker.init(elems);
      // });

      // document.addEventListener("backbutton", onBackKeyDown, false);
      //
      // function onBackKeyDown() {
      //   let modal = M.Modal.getInstance(document.querySelector('.modal'));
      //   modal.close();
      // }
    },
    methods: {
      saveToStorage(data){
        storage.set('monthlyExpenseData', JSON.stringify(data)).then((value)=>{
          if(!this.singleExpenseData){
            this.$emit('update:posts', JSON.parse(value));
          }
          this.$emit('update:dialog',false);
        });
      },
      saveMonthlyExpenseData() {
        let previousData = [];
        storage.get('monthlyExpenseData').then((value) => {
          if (value != null) {
            let data = JSON.parse(value);
            console.log(data,'data')
            if (data.length > 0) {
              previousData = data;
            }
            else {
              previousData.push(data);
            }
            if(!this.monthlyExpense.id)
            {
              this.monthlyExpense.id = previousData[previousData.length - 1].id + 1;
            }
            else{
              let index = _.findIndex(previousData, {id: this.monthlyExpense.id});

              previousData.splice(index, 1, this.monthlyExpense);
            }
          }
          else{
            this.monthlyExpense.id = 1;
            console.log(value,'value')
          }
          if(!this.singleExpenseData){
            previousData.push(this.monthlyExpense)
          }
          this.saveToStorage(previousData);
        });

      },
      // updateTitleProperty(value) {
      //   this.monthlyExpense[value] = this.$refs[value].value
      //
      //
      //   console.log(value, this.$refs[value].value)
      //   console.log(this.$name)
      // },
    }
  }
</script>

<style lang="scss">
  .fab-done-btn{
    bottom: 25px;
  }
</style>
