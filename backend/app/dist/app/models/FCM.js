"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FCM = void 0;
const db_config_1 = require("./db.config");
class FCM extends db_config_1.seq.Model {
}
exports.FCM = FCM;
FCM.init({ id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'User',
            key: 'no'
        }
    },
    created: {
        type: db_config_1.seq.DATE
    },
    token: {
        type: db_config_1.seq.TEXT
    }
}, {
    modelName: 'FCM',
    tableName: 'FCM',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=FCM.js.map