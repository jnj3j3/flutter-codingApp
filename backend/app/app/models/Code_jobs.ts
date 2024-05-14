import { sequelize, seq } from "./db.config";

interface Code_jobsAttributes {
    id : number,
    language : string,
    code : string,
    status : string,
    error : Date,
    status_updated : Date,
    output: string,
    last_read_line: number,
}

export class Code_jobs extends seq.Model<Code_jobsAttributes> implements Code_jobsAttributes{
    public readonly id!: number;
    public language!: string;
    public code!: string;
    public status!: string;
    public error!: Date;
    public status_updated!: Date;
    public output: string;
    public last_read_line: number;
}

Code_jobs.init(
    {
        id : {
            type: seq.INTEGER,
            primaryKey: true,
            autoIncrement : true
        },
        language:{
            type: seq.STRING
        },
        code:{
            type: seq.TEXT
        },
        status:{
            type: seq.STRING
        },
        error:{
            type: seq.TEXT
        },
        status_updated:{
            type: seq.DATE
        },
        output:{
            type: seq.TEXT
        },
        last_read_line:{
            type: seq.INTEGER
        },
    },{
        modelName: 'Code_jobs',
        tableName: 'Code_jobs',
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export interface Code_jobsReq {
    language : string,
    code : string,
}
