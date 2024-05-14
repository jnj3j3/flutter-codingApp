import { sequelize, seq } from "./db.config";

interface  Code_board_reverse_wordAttributes {
    id: number,
    word_id: number,
    code_board_id: number,
    count: number
    weight: number
}    

export class Code_board_reverse_word extends seq.Model<Code_board_reverse_wordAttributes> implements Code_board_reverse_wordAttributes{
    public readonly id: number;
    public word_id: number;
    public code_board_id: number;
    public count: number;
    public weight: number;
}

Code_board_reverse_word.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        word_id:{
            type: seq.INTEGER,
            references: {
                model: 'Code_board_word',
                key: 'id'
            }
        },
        code_board_id:{
            type: seq.INTEGER,
            references: {
                model: 'Code_board',
                key: 'id'
            }
        },
        count:{
            type: seq.INTEGER
        },
        weight:{
            type: seq.DOUBLE
        }
    },{
        modelName: 'Code_board_reverse_word',
        tableName: 'Code_board_reverse_word',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);
