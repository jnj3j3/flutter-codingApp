"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errConfig = void 0;
function errConfig(res, err, message) {
    if (err != null)
        console.log(err + " error occured while " + message);
    return res.status(500).send({
        message: " This error occured while " + message
    });
}
exports.errConfig = errConfig;
//# sourceMappingURL=err.config.js.map