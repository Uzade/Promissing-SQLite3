import { Database, Statement } from "sqlite3"

class PromissingSQLite3{
    db: Database

    constructor(db:Database){
        this.db = db;
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
        return new Promise<Statement>((resolve, reject) => {
            const stmt = this.db.prepare(query, (err) => {
                if(err == null){
                    resolve(stmt)
                }else{
                    reject(err)
                }
            })

        })
    }
}

class PromissingStatement{
    stmt: Statement
    constructor(stmt: Statement){
        this.stmt = stmt
    }

    async run(...params: any[]){
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

    async run(params: any){
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
}