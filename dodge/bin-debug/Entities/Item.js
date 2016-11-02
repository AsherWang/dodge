//道具
var dodge;
(function (dodge) {
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(textures) {
            _super.call(this, textures);
        }
        var d = __define,c=Item,p=c.prototype;
        return Item;
    }(dodge.GameObject));
    dodge.Item = Item;
    egret.registerClass(Item,'dodge.Item');
})(dodge || (dodge = {}));
//# sourceMappingURL=Item.js.map