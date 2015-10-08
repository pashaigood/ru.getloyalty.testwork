(function () {
    'use strict';

    angular
        .module('testWork')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($filter, data) {
        var vm = this,
            orderBy = $filter('orderBy');


        function init() {
            vm.data = data;
            if (data.length) {
                vm.selectSet(data[data.length - 1]);
            }
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

        function finalizeElement(elem) {
            elem.Percent = Math.round(elem.Percent * 100) / 100;
            elem._Percent = elem.Percent;
        }

        /**
         * Метод нормализует набор данных.
         * При передачи второго параметра, нормализация
         * происходит относительно переданного элемента.
         *
         * @example
         * // В Наборе есть данные процентов: [20, 30, 50, 0]
         * // Пользователь изменил 4 параметр на 90
         * normalize(vm.dataSet, vm.dataSet[2]);
         * // В этом случаи значение 4 параметра останется 90,
         * // а в общем значения будут выглядеть как [4, 6, 0, 90].
         *
         * @param {Array<Object>} dataSet
         * @param {Object} element
         */
        function normalize(dataSet, element) {
            var sum = 0,
                coeff,
                normalizedPart = element ? 100 - element.Percent : 100;

            // Найдём всё количество процентов.
            angular.forEach(dataSet, function (elem) {
                if (element !== elem) {
                    sum += elem.Percent;
                }
            });


            if (normalizedPart === sum) {
                return;
            }
            // Найдём коэффицент.
            coeff = sum > 0 ? normalizedPart / sum : 0;

            // Приведём общее значение к 100.
            angular.forEach(dataSet, function (elem) {
                if (element !== elem) {
                    elem.Percent *= coeff;
                }
                finalizeElement(elem);
            });
        }

        /**
         * Метод выбирает набор данных.
         * @param {Array<Object>} dataSet
         */
        vm.selectSet = function (dataSet) {
            vm.dataSet = dataSet;
            angular.forEach(dataSet, function (elem) {
                format(elem);
            });
            normalize(vm.dataSet);
        };

        /**
         * Метод обрабатывает изменение процентов в моделе.
         * @param {Object} elem
         */
        vm.change = function (elem) {
            format(elem);
            recalculate(elem);
            normalize(vm.dataSet, elem);
        };

        /**
         * Метод перерасчитывает текущий набор данных, так чтобы их значение не привышало 100
         */
        function recalculate(elem) {
            elem.Percent = elem.Percent > 0 ? elem.Percent : 0;
            elem.Percent = elem.Percent < 100 ? elem.Percent : 100;

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


            var cnt = order.length;
            while ((cnt -= 1) > -1) {

                while ((changedElement = order.shift()) === elem) {
                    // Убедимся, что элемент не являеться сам сабой.
                }

                if (changedElement) {
                    var newValue = changedElement.Percent + (oldValue - value);

                    // Если значение получиться меньше нуля,
                    // То отнимаем только то, что до нуля.
                    // Перём следующий элемент из сортировки и проделываем тоже самое с ним.

                    if (newValue < 0) {
                        // Найдём количество процентов,
                        // которые ещё не компенсировали.
                        // И компенсируем его у следующего элемента.
                        oldValue = value + newValue;
                        changedElement.Percent = 0;
                        finalizeElement(changedElement);
                        continue;

                    }
                    else if (newValue > 100) {
                        changedElement.Percent = 100;
                    }
                    else {
                        changedElement.Percent = newValue;
                    }

                    finalizeElement(changedElement);
                    finalizeElement(elem);
                    break;

                }

            }

        }


        init();
    }
})();
