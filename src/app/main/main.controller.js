(function () {
    'use strict';

    angular
        .module('testWork')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $filter, data, _) {
        var vm = this,
            orderBy = $filter('orderBy');


        function init() {
            vm.data = data;
            vm.selectSet(data[3]);
        }

        /**
         * Метод формтаирует проценты элемента, преобразует для работы.
         * @param {Object} elem
         */
        function format(elem) {
            if (angular.isString(elem.Percent)) {
                elem.Percent = elem.Percent.replace(',', '.');
                elem.Percent = parseFloat(elem.Percent);
            }
        }

        /**
         * Метод нормализует набор данных.
         * @param {Array<Object>} dataSet
         */
        function normalize(dataSet) {
            var sum = 0,
                coeff;

            // Найдём всё количество процентов.
            angular.forEach(dataSet, function(elem) {
                format(elem);
                sum += elem.Percent;
            });

            // Найдём коэффицент.
            coeff = 100 / sum;

            // Приведём общее значение к 100.
            angular.forEach(dataSet, function(elem) {
                elem.Percent *= coeff;
                elem.Percent = Math.round(elem.Percent*100)/100;
                elem._Percent = elem.Percent;
            });
        }

        /**
         * Метод выбирает набор данных.
         * @param {Array<Object>} dataSet
         */
        vm.selectSet = function (dataSet) {
            vm.dataSet = dataSet;
            normalize(vm.dataSet);
        };

        /**
         * Метод обрабатывает изменение процентов в моделе.
         * @param {Object} elem
         */
        vm.change = function (elem) {
            format(elem);
            recalculate(elem);
        };

        /**
         * Метод перерасчитывает текущий набор данных, так чтобы их значение не привышало 100
         */
        function recalculate(elem) {
            var value = elem.Percent,
                oldValue = elem._Percent,
                changedElement,
                order = [];

            // Если значение уменьшилось,
            if (value < oldValue) {

                // то это количество передается первому элементу,
                // с наименьшим количеством.
                order = orderBy(vm.dataSet, ['Percent', 'Name']);

            }
            else
            // Если значение увеличилось,
            if (value > oldValue) {
                // то это количество компенсируется первым
                // элементом с наибольшим количеством.
                order = orderBy(vm.dataSet, ['-Percent', 'Name']);
            }
            else {
                return;
            }


            while ((changedElement = order.shift()) === elem) {
                // Убедимся, что элемент не являеться сам сабой.
            }

            if (changedElement) {
                var newValue = changedElement.Percent + (oldValue - value);

                if (newValue < 0) {
                    changedElement.Percent = 0;
                }
                else
                if(newValue > 100){
                    changedElement.Percent = 100;
                }
                else {
                    changedElement.Percent = newValue;
                }

                normalize(vm.dataSet);

            }
        }

        init();
    }
})();
