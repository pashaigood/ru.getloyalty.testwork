(function () {
    angular
        .module('testWork')
        .directive('keypressMaskerade', keypress);

    /** @ngInject */
    function keypress() {
        var directive = {
            restrict: 'A',
            link: function ($scope, $element) {
                $element.on('keypress', function (event) {
                    if (String.fromCharCode(event.which) == ',') {
                        if (! /\./.test($element.val())) {
                            $element.val($element.val() + '.');
                        }
                        event.preventDefault();
                    }
                });
            }
        };

        return directive;
    }
})();