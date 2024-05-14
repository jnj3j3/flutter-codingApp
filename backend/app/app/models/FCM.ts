import { sequelize, seq } from "./db.config";

interface  FCMAttributes {
    id: number,
    user_id: number,
    created: Date,
    token: string
}

export class FCM extends seq.Model<FCMAttributes> implements FCMAttributes{
    public id: number;
    public user_id: number;
    public created: Date;
    public token: string;
}

FCM.init(
    {id : {
        type: seq.INTEGER,
        primaryKey: true,
        autoIncrement : true
    },
        user_id:{
            type: seq.INTEGER,
            references: {
                model: 'User',
                key: 'no'
            }
        },
        created:{
            type: seq.DATE
        },
        token:{
            type: seq.TEXT
        }
    },{
        modelName: 'FCM',
        tableName: 'FCM',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);