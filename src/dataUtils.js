var _ = require('lodash');
var moment = require('moment');
var _module;


    var DEBUG = true,
        ALPHA = "QWERTYUIOPASDFGHJKLZXCVBNM",
        NUMERIC = "0123456789",
        BOOLS = [false, true, false],
        MONTHS = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"],
        MonthFormat = function (date) {
            var rawMonth = date.getMonth() + 1;

            var formattedMonth = parseInt(rawMonth) < 10 ? '0' + rawMonth : rawMonth;
            return formattedMonth;
        },
        TimeFormat = function (date) {
            var rawHour = date.getHours(),
                rawMinute = date.getMinutes(),
                parsableHour = parseInt(rawHour),
                timezone = 'EST',
                amPm;

            var formattedMinutes = parseInt(rawMinute) < 10 ? '0' + rawMinute : rawMinute;

            if (parsableHour >= 12){
                amPm = 'PM';
                if (parsableHour > 12){
                    rawHour -= 12;
                }
            } else if (parsableHour < 12){
                amPm = 'AM';
                if (parsableHour === 0){
                    rawHour = 12;
                }
            }

            var formattedHours = parseInt(rawHour) < 10 ? '0' + rawHour : rawHour;

            return formattedHours + ":" + formattedMinutes + amPm + " " + timezone;
        },
        DayFormat = function(date){
            var rawDate = date.getDate();
            var formattedDate = parseInt(rawDate) < 10 ? '0' + rawDate : rawDate;
            return formattedDate;
        };

module.exports = _module =  {

   crypto : {
        // not cryptographically sound, but good
        // enough for random data

        old_rand: Math.random,
        seed: function ( seed ) {
            if (seed) {
                 Math.random = function ( ) {
                    var x = 10000 * Math.sin(seed++);
                    return x - Math.floor(x);
                };
            } else {
                Math.random = _module.crypto.old_rand;
            }
        }
    },
    sample: function(data, size ){
        var results=[];
        if(!size){
            size = 1;
        }
        for (var i = 0; i < size; i++){
            results.push(data[Math.floor(Math.random()*data.length)]);
        }

        if(typeof results[0] === "boolean"){
            return results.join('') === 'true';
        }
        return results.join('');
    },
    make_id: function ( ) {

        var id = _module.sample(ALPHA, 2) + '' + _module.sample(NUMERIC, 4);

        return id;
    },
    make_numeric_id: function () {
      return _module.sample(NUMERIC, 6);
    },
    make_success: function ( ) {
        return { Status: 'SUCCESS' };
    },
    randomDate : function(start, end) {
        if(!start){
            start = new Date(2012, 0, 1);
            start.setHours(0,0,0,0);
        }
        if(!end){
            var now  = new Date();
            end = new Date(now.getYear(),now.getMonth(),now.getDate());
            end.setHours(0,0,0,0);
        }
        var newDate = new Date(start.getTime() + Math.random()
                     * (end.getTime() - start.getTime()));
        return newDate;
    },
    make_tr: function (baseDate, force) {

        var dueDate = moment(baseDate).add(1, 'y'),
            today = moment();

        if (force) today = moment("2/28/16");

        var hourGlass = dueDate.diff(today, 'months');

        return hourGlass + 1;
    },
    randomInt : function(min, max){
        if (!max) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat: function(min, max) {
       if (!max) {
            max = min;
            min = 0;
        }
        return Math.random() * (max - min + 1) + min;
    },
    randomWords : function(numberofWords){

        var words = 'Epsum factorial non deposit quid pro quo hic escorol. Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum. Defacto lingo est igpay atinlay. Marquee selectus non provisio incongruous feline nolo contendre. Gratuitous octopus niacin, sodium glutimate. Quote meon an estimate et non interruptus stadium. Sic tempus fugit esperanto hiccup estrogen. Glorious baklava ex librus hup hey ad infinitum. Non sequitur condominium facile et geranium incognito. Epsum factorial non deposit quid pro quo hic escorol. Marquee selectus non provisio incongruous feline nolo contendre Olypian quarrels et gorilla congolium sic ad nauseum. Souvlaki ignitus carborundum e pluribus unum.'.split(' ');

        // assumes words < numberofwords
        return words.splice(0, numberofWords).join(' ');
    },
    toDateString : function(date){
        if ((typeof date.getMonth !== 'function')){
            console.error('formatDate takes a date object');
        }
        var monthOffset = 1; // Month to string is off by 1 month
        return (date.getMonth() + monthOffset).toString() + '/' + date.getDate().toString() + '/' + date.getFullYear().toString();
    },
    // finds matches and replaces values,
    // if the replacement value was not found, it leaves it
    // this is the difference between this and mustache.
    // Mustache will remove the not found matches.
    formatText: function(text, values) {
        var matches = text.match(/{{([^{}]+)}}/g),
            returnText = text;
        if(!matches) return text;
        matches.forEach(function (match) {
            var prop = match.slice(2, match.length-2);
            returnText = returnText.replace(match, values[prop]);
        });
        return returnText;
    }


};
