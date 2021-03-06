const rollup = require('rollup');
const pkg = require('../../../package');
const getScriptConfig = require('./getScriptConfig');
const getTsFileList = require('./getTsFileList');

module.exports = function() {
    const fileList = getTsFileList('src/' + pkg.name, [/protected/, /.*types\.ts$/, /.*common\/theme\/.*\.less$/, /__tests__/]);

    let tsIdx = 0;
    let tsCount = fileList.components.length;

    /**
     * Здесь идёт сборка тайпскриптовых файлов, но начнётся она только после сборки стилей.
     * Это нужно для того, чтобы были заранее посчитаны хэши по файлам.
     */
    function nextTS() {
        if (tsIdx < tsCount) {
            const currentPath = fileList.components[tsIdx];
            const config = getScriptConfig(currentPath);
            rollup.rollup(config.input).then(function(bundle) {
                bundle.generate(config.output).then(function() {
                    bundle.write(config.output).then(nextTS);
                });
            });
            tsIdx++;
        }
    }

    nextTS();
};
