(function() {
  'use strict';

  angular
    .module('testWork')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
