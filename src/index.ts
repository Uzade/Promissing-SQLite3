import { Database, Statement } from "sqlite3"

export class PromissingSQLite3{
    db: Database

    constructor(db:Database){
        this.db = db;
    }

    async execPrep(query: string, ...params: any[]){
        const stmt = await this.prepare(query);
        return stmt.run(params)
    }

    async getPrep(query: string, ...params: any[]){
        const stmt = await this.prepare(query);
        return stmt.get(params)
    }

    async allPrep(query: string, ...params: any[]){
        const stmt = await this.prepare(query);
        return stmt.all(params)
    }

    async exec(query: string){
        return new Promise<void>((resolve, reject) => {
            this.db.exec(query, (err) => {
                if(err == null){
                    resolve()
                }else{
                    reject(err)
                }
            })
        })
    }

    async all(query: string){
        return new Promise<any[]>((resolve, reject) => {
            this.db.all(query, (err, rows) => {
                if(err == null){
                    resolve(rows)
                }else{
                    reject(err)
                }
            })
        })
    }

    async get(query: string){
        return new Promise<any>((resolve, reject) => {
            this.db.get(query, (err, row) => {
                if(err == null){
                    resolve(row)
                }else{
                    reject(err)
                }
            })
        })
    }

    async prepare(query: string){
        return new Promise<PromissingStatement>((resolve, reject) => {
            const stmt = this.db.prepare(query, (err) => {
                if(err == null){
                    resolve(new PromissingStatement(stmt))
                }else{
                    reject(err)
                }
            })

        })
    }
}

export class PromissingStatement{
    stmt: Statement
    constructor(stmt: Statement){
        this.stmt = stmt
    }
    async run(params: any): Promise<void>;
    async run(...params: any[]): Promise<void>;
    async run(params: any[] | any){
        return new Promise<void>((resolve, reject) => {
            this.stmt.run(params, (err) => {
                if(err == null){
                    resolve()
                }else{
                    reject(err)
                }
            })
        })
    }

    async all(params: any): Promise<any[]>;
    async all(...params: any): Promise<any[]>;
    async all(params: any | any[]): Promise<any[]>{
        return new Promise<any[]>((resolve, reject) => {
            this.stmt.all(params, (err, rows) => {
                if(err == null){
                    resolve(rows)
                }else{
                    reject(err)
                }
            })
        })
    }

    async get(params: any): Promise<any>;
    async get(...params: any[]): Promise<any>;
    async get(params: any | any[]): Promise<any>{
        return new Promise<any>((resolve, reject) => {
            this.stmt.get(params, (err, row) => {
                if(err == null){
                    resolve(row)
                }else{
                    reject(err)
                }
            })
        })
    }


    async finalize(){
        return new Promise<void>((resolve, reject) => {
            this.stmt.finalize((err) => {
                if(err == null){
                    resolve()
                }else{
                    reject(err)
                }
            })

        })
    }
}