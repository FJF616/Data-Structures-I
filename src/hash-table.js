/* eslint-disable no-unused-vars */
const { LimitedArray, getIndexBelowMax } = require('./hash-table-helpers');

class HashTable {
  constructor() {
    this.limit = 8;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }
  insert(key, value) {
    let count = 0;
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index) || [];
    let foundPair = false;
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        foundPair = true;
      }
    }
    if (!foundPair) {
      bucket.push([key, value]);
      this.storage.set(index, bucket);
      count++;
    }
    // part of extra credit attempt
    // count items that get inserted and when the count is 75% of limit call resize
    if ((count / this.limit) >= this.limit * 0.75) {
      this.storage.resize(this.limit * 2);
      count = 0;
    }
  }
  // extra credit attempt
  resize(newLimit) {
    let oldStorage = this.storage;
    this.limit = newLimit;
    this.storage = new LimitedArray(this.limit);
    oldStorage = oldStorage.each((bucket) => {
      if (!bucket) return;
      for (let i = 0; i < bucket.length; i++) {
        const tuple = bucket[i];
        this.insert(tuple[0], tuple[1]);
      }
    });
  }
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    let bucket = this.storage.get(index);
    if (bucket) {
      bucket = bucket.filter(pair => pair[0] !== key);
      this.storage.set(index, bucket);
    }
  }
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    let retrieved;
    if (bucket) {
      retrieved = bucket.filter(pair => pair[0] === key)[0];
    }
    return retrieved ? retrieved[1] : undefined;
  }
}
module.exports = HashTable;
 /* extra credit solution
  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each(bucket => {
      if (!bucket) return;
      bucket.forEach((pair) => {
        this.insert(pair[0], pair[1]);
      })
    })
  }
 capacityIsFull() {
   let fullCells = 0;
   this.storage.each(bucket => {
    if(bucket !== undefined) fullCells++;
   });
   return fullCells / this.limit >= 0.75;
 } //returns boolean */
