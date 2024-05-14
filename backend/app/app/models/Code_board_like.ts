import { sequelize, seq } from "./db.config";

interface Code_board_likeAttributes {
    code_board_id: number,
    user_id: number,
    created: Date,
    state: number
}

export class Code_board_like extends seq.Model<Code_board_likeAttributes> implements Code_board_likeAttributes{
    public code_board_id: number;
    public user_id: number;
    public created: Date;
    public state: number;
}

Code_board_like.init(
    {
        code_board_id : {
            type: seq.INTEGER,
            primaryKey: true,
            references: {
                model: 'Code_board',
                key: 'id'
            }
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
        state:{
            type: seq.INTEGER
        }
    },{
        modelName: 'Code_board_like',
        tableName: 'Code_board_like',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export interface code_board_likeReq{
    code_board_id: number,
    user_id: number,
}