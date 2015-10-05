(function () {
    'use strict';

    describe('controllers', function () {
        var vm,
            data;

        beforeEach(module('testWork'));
        beforeEach(inject(function (_$controller_) {
            vm = _$controller_('MainController');
        }));

        it('should have data', function () {
            // Проверим, что данные существуют.
            expect(vm.data).toEqual(jasmine.any(Array));
            expect(vm.data.length).toBeGreaterThan(3);
        });

        it('should be normalized', function () {
            // Для тестов, выберем последний набор данных.
            var dataSet = vm.data[vm.data.length - 1];

            expect(vm.selectSet).toEqual(jasmine.any(Function));
            vm.selectSet(dataSet);
            expect(vm.dataSet).toEqual(dataSet);
            // Сумма всех процетов должны быть равна 100.
            var cnt = vm.dataSet.length,
                percents = 0;
            while (--cnt > -1) {
                percents += vm.dataSet[cnt].Percent;
            }
            expect(Math.round(percents)).toBe(100);
        });
    });
})();
