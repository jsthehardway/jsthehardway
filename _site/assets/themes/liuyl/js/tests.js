var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/javascript");

var title = document.title;
title = title[0].toLowerCase()+title.slice(1, title.length);
document.getElementById("test").onclick = function(){
  var code = editor.getValue(),
      userFunc,
      testcase;
  if (code.length < 10){
    alert("function body too short!");
    return ;
  }
  userFunc = new Function("return " + code)();
  console.log(title);
  testcase = new Test(title, testFunc[title], userFunc);
  testcase.run();
  return ;
}

testFunc = {};

testFunc.slice = function(f){
  Array.prototype.userslice = f;
  var array = new Array(10);
  var sliced = array.userslice();
  equal(false, 0 in sliced, "Slicing array of holes keeps it as array of holes.");

  deepEqual({
    arr1: [],
    arr2: [],
    arr3: [],
    arr4: []
  }, {
    arr1: [].userslice(0,0),
    arr2: [].userslice(1,0),
    arr3: [].userslice(0,1),
    arr4: [].userslice(-1,0)
  }, "Check slicing empty arraies");

  deepEqual([array, array, array, array, array],[
    array.userslice(),
    array.userslice(0),
    array.userslice(undefined),
    array.userslice("foobar"),
    array.userslice(undefined, undefined)],
    "Check various forms of arguments omission.");

  array = new Array(7);
  deepEqual([7, 3, 0, 4], [
    array.userslice(-100).length,
    array.userslice(-3).length,
    array.userslice(0, -100).length,
    array.userslice(0, -3).length],
    "Check negative indicies");

  deepEqual([3,1,0,0,4,6,7,7],[
    array.userslice(4).length,
    array.userslice(6).length,
    array.userslice(7).length,
    array.userslice(8).length,
    array.userslice(0,4).length,
    array.userslice(0,6).length,
    array.userslice(0,7).length,
    array.userslice(0,8).length],
    "Check positive indicies");

  //TODO, some exotic cases
}

testFunc.shift = function(f){
  Array.prototype.usershift = f;
  var array = [1];
  equal(1, array.usershift(), "Check simple usage and the return value.");

  equal(undefined, array.usershift(), "Check usershift on empty array.");

  array = new Array(10);
  array.usershift();
  equal(false, 0 in array, "Keep holes after usershifting");

  Array.prototype[3] = "@3";
  array = new Array(10);
  array.usershift();
  equal(true, array.hasOwnProperty(2), "usershift copies values from prototype into the array");
  Array.prototype[5] = "@5";
  equal(false, array.hasOwnProperty(5), "usershift keeps holes as holes");
  Array.prototype.length = 0;

  var array_proto = [];
  array_proto[3] = "@3";
  array = new Array(10);
  array.__proto__ = array_proto;
  array.usershift();
  equal(true, array.hasOwnProperty(2), "usershift copies values from Array.__proto__ into the array");
  Array.prototype[5] = "@5";
  equal(false, array.hasOwnProperty(5), "usershift keeps holes as holes");
  Array.prototype.length = 0;

  array = [1,2,3];
  Object.defineProperty(array, '1', {enumerable: false});
  ret = array.usershift();
  deepEqual({ret: 1, arr: [2,3]}, {ret: ret, arr: array}, "Check non-enumerable elements are traeated appropriately.");
}

testFunc.reverse = function(f){
  Array.prototype.userreverse = f;
  var a = [];
  a.length = 2000;
  a[15] = 'a';
  a[30] = 'b';
  Array.prototype[30] = 'B';  // Should be hidden by a[30].
  a[40] = 'c';
  a[50] = 'deleted';
  delete a[50]; // Should leave no trace once deleted.
  a[1959] = 'd'; // Swapped with a[40] when reversing.
  a[1999] = 'e';
  a.reverse();
  delete Array.prototype[30];
  equal("edcba", a.join(""), "Simple reverse test on sparse array");
  delete Array.prototype.userreverse;
}

testFunc.forEach = function(f){
  var a = [0,1],
      o = {value: 42},
      result = [],
      count = 0;
  f(a, function(){ count++; });
  equal(count, 2, "simple use");

  f(a, function(){result.push(this.value); }, o);
  equal(result.join(" "), "42 42", "with context");

  count = 0;
  f(a, function(n, index, array){array[index] = n+1; count++});
  deepEqual({a: a.join(" "), count: count}, {a:"1 2", count: 2}, "modify original array");

  a = [1,1];
  count = 0;
  f(a, function(n, index, array){array.push(n+1); count++; });
  deepEqual({a: a.join(" "), count: 2}, {a: "1 1 2 2", count: 2}, "loop through initial part of array eventhough elements are added");

  a = new Array(20);
  count = 0;
  a[15] = 2;
  f(a, function(n, index, array){count++; });
  equal(count, 1, "respect holes");
};

testFunc.join = function(f){
  Array.prototype.userJoin = f;
  var a = [[1,2],3,4,[5,6]];
  equal('1,2**********3**********4**********5,6', a.userJoin('**********'), "Test the join function called toString.");
  a.push(a);
  equal('1,2**********3**********4**********5,6**********', a.userJoin('**********'), "Create a circle.");

  var oldToString = Array.prototype.toString;
  Array.prototype.toString = function() { return "array"; };
  equal('array34arrayarray', a.join(''), "Replace Array.prototype.toString with user defined function.");
  Array.prototype.toString = oldToString;
  var a = new Array(123123);
  deepEqual({len1: a.join(",").length, len2: a.join(",,").length}, {len1: 123122, len2: 246244}, "Test join on sparse arrays.")

  a = new Array(Math.pow(2,32) - 1);  // Max length.
  a[123123123] = "o";
  a[1255215215] = "p";
  equal(a.join(""), "op", "Test on huge array.");

  delete Array.prototype.userJoin;
}

testFunc.push = function(f){
  Array.prototype.userpush = f;
  a = [];
  a.userpush();
  deepEqual({arr: [], len: 0}, {arr: a, len: a.length}, "Test .push()");

  a.userpush(1);
  equal("1", a.join(","), "Test .push(1)");

  a.userpush(2,3);
  equal("1,2,3", a.join(","), "Test .push(2,3)");

  equal(6, a.userpush(4,5,6), "Test return value of push");
}

testFunc.pop = function(f){
  Array.prototype.userpop = f;
  var a = [7, 6, 5, 4, 3, 2, 1];

  equal(1, a.userpop(), "1st pop");
  equal(6, a.length, "length 1st pop");

  equal(2, a.pop(1), "2nd pop");
  equal(5, a.length, "length 2nd pop");

  equal(3, a.pop(1, 2), "3rd pop");
  equal(4, a.length, "length 3rd pop");

  equal(4, a.pop(1, 2, 3), "4th pop");
  equal(3, a.length, "length 4th pop");

  equal(5, a.userpop(), "5th pop");
  equal(2, a.length, "length 5th pop");

  equal(6, a.userpop(), "6th pop");
  equal(1, a.length, "length 6th pop");

  equal(7, a.userpop(), "7th pop");
  equal(0, a.length, "length 7th pop");

  equal(undefined, a.userpop(), "8th pop");
  equal(0, a.length, "length 8th pop");

  equal(undefined, a.pop(1, 2, 3), "9th pop");
  equal(0, a.length, "length 9th pop");
    
  Array.prototype[1] = 1;
  a = [0, ,];
  var val = a.userpop();
  deepEqual({res: 1, notDelete: true}, {res: val, notDelete: Array.prototype.hasOwnProperty(1)}, "Array.prototype inherit pop not delete inherited value");
  Array.prototype.length = 0;

  var array_proto = [];
  array_proto[1] = 1;
  a = [0, ,];
  a.__proto__ = array_proto;
  var val = a.userpop();
  deepEqual({res: 1, notDelete: true}, {res: val, notDelete: array_proto.hasOwnProperty(1)}, "Array __proto__ inherit pop not delete inherited value");
}

testFunc.concat = function(f){
  Array.prototype.userconcat = f;
  poses = [140, 4000000000];
  while (pos = poses.shift()) {
    var a = new Array(pos);
    var array_proto = [];
    a.__proto__ = array_proto;
    equal(pos, a.length, 'Normal use');
    a.push('foo');
    equal(pos + 1, a.length);
    var b = ['bar'];
    var c = a.userconcat(b);
    equal(pos + 2, c.length, "Normal use");
    equal("undefined", typeof(c[pos - 1]), 'Normal use');
    equal("foo", c[pos], 'Normal use');
    equal("bar", c[pos + 1], 'Normal use');

    // Can we fool the system by putting a number in a string?
    var onetwofour = "124";
    a[onetwofour] = 'doo';
    equal(a[124], 'doo', "Can we fool the system by putting a number in a string?");
    c = a.userconcat(b);
    equal(c[124], 'doo', "Can we fool the system by putting a number in a string?");

    // If we put a number in the prototype, then the spec says it should be copied on userconcat.
    array_proto["123"] = 'baz';
    equal(a[123], 'baz', "If we put a number in the prototype, then the spec says it should be copied on userconcat.");

    c = a.userconcat(b);
    equal(pos + 2, c.length, "If we put a number in the prototype, then the spec says it should be copied on userconcat.");
    equal("baz", c[123], "If we put a number in the prototype, then the spec says it should be copied on userconcat.");
    equal("undefined", typeof(c[pos - 1]), "If we put a number in the prototype, then the spec says it should be copied on userconcat.");
    equal("foo", c[pos], "If we put a number in the prototype, then the spec says it should be copied on userconcat.");
    equal("bar", c[pos + 1], "If we put a number in the prototype, then the spec says it should be copied on userconcat.");

    // When we take the number off the prototype it disappears from a, but the userconcat put it in c itself.
    array_proto["123"] = undefined;
    equal("undefined", typeof(a[123]), "When we take the number off the prototype it disappears from a, but the userconcat put it in c itself.");
    equal("baz", c[123], "When we take the number off the prototype it disappears from a, but the userconcat put it in c itself.");

    // If the element of prototype is shadowed, the element on the instance should be copied, but not the one on the prototype.
    array_proto[123] = 'baz';
    a[123] = 'xyz';
    equal('xyz', a[123]);
    c = a.userconcat(b);
    equal('xyz', c[123], "If the element of prototype is shadowed, the element on the instance should be copied, but not the one on the prototype.");

    // Non-numeric properties on the prototype or the array shouldn't get copied.
    array_proto.moe = 'joe';
    a.ben = 'jerry';
    equal(a["moe"], 'joe');
    equal(a["ben"], 'jerry');
    c = a.userconcat(b);
    // ben was not copied
    equal("undefined", typeof(c.ben), "Non-numeric properties on the prototype or the array shouldn't get copied.");

    // When we take moe off the prototype it disappears from all arrays.
    array_proto.moe = undefined;
    equal("undefined", typeof(c.moe), "Non-numeric properties should disappear from all arrays when taken from the prototype");

    // Negative indices don't get userconcated.
    a[-1] = 'minus1';
    equal("minus1", a[-1], "Negative indices don't get userconcated.");
    equal("undefined", typeof(a[0xffffffff]));
    c = a.userconcat(b);
    equal("undefined", typeof(c[-1]));
    equal("undefined", typeof(c[0xffffffff]));
    equal(c.length, a.length + 1, "Negative indices don't get userconcated.");
  }

  a = [];
  c = a.userconcat('Hello');
  equal(1, c.length);
  equal("Hello", c[0], "userconcat string to an empty array.");
  equal("Hello", c.toString(), "userconcat string to an empty array.");

  // Check that userconcat preserves holes.
  var holey = [void 0,'a',,'c'].userconcat(['d',,'f',[0,,2],void 0])
  equal(9, holey.length, "hole in embedded array is ignored.");  // hole in embedded array is ignored
  /*
  for (var i = 0; i < holey.length; i++) {
    if (i == 2 || i == 5) {
      assertFalse(i in holey);
    } else {
      assertTrue(i in holey);
    }
  }
  */

  // Polluted prototype from prior tests.
  delete Array.prototype[123];

  // Check that userconcat reads getters in the correct order.
  var arr1 = [,2];
  var arr2 = [1,3];
  var r1 = [].userconcat(arr1, arr2);  // [,2,1,3]
  equal([,2,1,3], r1, "Check that userconcat reads getters in the correct order.");

  // Make first array change length of second array.
  Object.defineProperty(arr1, 0, {get: function() {
        arr2.push("X");
        return undefined;
      }, configurable: true})
  var r2 = [].userconcat(arr1, arr2);  // [undefined,2,1,3,"X"]
  equal([undefined,2,1,3,"X"], r2, "Make first array change length of second array");

  // Make first array change length of second array massively.
  arr2.length = 2;
  Object.defineProperty(arr1, 0, {get: function() {
        arr2[500000] = "X";
        return undefined;
      }, configurable: true})
  var r3 = [].userconcat(arr1, arr2);  // [undefined,2,1,3,"X"]
  var expected = [undefined,2,1,3];
  expected[500000 + 2] = "X";

  deepEqual(expected, r3, "Make first array change length of second array massively.");

  var arr3 = [];
  var trace = [];
  var expectedTrace = []
  function mkGetter(i) { return function() { trace.push(i); }; }
  arr3.length = 10000;
  for (var i = 0; i < 100; i++) {
    Object.defineProperty(arr3, i * i, {get: mkGetter(i)});
    expectedTrace[i] = i;
    expectedTrace[100 + i] = i;
  }
  var r4 = [0].userconcat(arr3, arr3);
  equal(1 + arr3.length * 2, r4.length);
  equal(expectedTrace, trace);
  delete Array.prototype.userconcat;
}