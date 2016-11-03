var dodge;
(function (dodge) {
    var Utils = (function () {
        function Utils() {
        }
        var d = __define,c=Utils,p=c.prototype;
        Utils.pad = function (num, n) {
            var len = num.toString().length;
            var ret = num.toString();
            while (len < n) {
                ret = "0" + ret;
                len++;
            }
            return ret;
        };
        Utils.timeFormat = function (second) {
            var min = Math.floor(second / 60);
            var sec = second - min * 60;
            return Utils.pad(min, 2) + ":" + Utils.pad(sec, 2);
        };
        Utils.getRandomValue = function (sum, num) {
            return sum * Math.floor(Math.random() * (num - 1)) / num;
        };
        return Utils;
    }());
    dodge.Utils = Utils;
    egret.registerClass(Utils,'dodge.Utils');
})(dodge || (dodge = {}));
//# sourceMappingURL=Utils.js.map