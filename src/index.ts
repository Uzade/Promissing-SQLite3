import { Database, Statement } from "sqlite3";
import * as fs from "fs"; //no idea why this is needed here, but it works

export class PromissingSQLite3{
    db: Database

    constructor(db:Database){
        this.db = db
    }

    async execFile(path: string) {
        return this.exec(fs.readFileSync(path).toString())
    }

    async getFile(path: string) {
        return this.get(fs.readFileSync(path).toString())
    }

    async allFile(path: string) {
        return this.all(fs.readFileSync(path).toString())
    }

    async execPrepFile(path: string, ...params: any[]){
        return this.execPrep(fs.readFileSync(path).toString(), ...params)
    }

    async getPrepFile(path: string, ...params: any[]){
        return this.getPrep(fs.readFileSync(path).toString(), ...params)
    }

    async allPrepFile(path: string, ...params: any[]){
        return this.allPrep(fs.readFileSync(path).toString(), ...params)
    }

    async execPrep(query: string, ...params: any[]){
        const stmt = await this.prepare(query)
        const result = stmt.run(params)
        await stmt.finalize()
        return result
    }

    async getPrep(query: string, ...params: any[]){
        const stmt = await this.prepare(query)
        const result = stmt.get(params)
        await stmt.finalize()
        return result
    }

    async allPrep(query: string, ...params: any[]){
        const stmt = await this.prepare(query)
        const result = stmt.all(params)
        await stmt.finalize()
        return result
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