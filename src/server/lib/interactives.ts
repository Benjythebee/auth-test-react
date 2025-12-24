import {  InteractiveRow } from "../../common/types.js";
import { pg } from "./pg.js";

export class Interactive {
    public id?: number;
    public store_id: string;
    public image: string;
    public metadata: Record<string, any>;
    public created_at?: Date;

    constructor(params: InteractiveRow) {
        this.id = params.id;
        this.store_id = params.store_id;
        this.image = params.image;
        this.metadata = params.metadata;
        this.created_at = params.created_at;
    }


    static async getById(row: InteractiveRow): Promise<Interactive|null> {
        
        const found = await pg.query(
            'SELECT * FROM interactives WHERE id = $1',
            [row.id]
        );

        if(found?.rows[0]){
            return new Interactive(found.rows[0] as InteractiveRow)
        }
        return null
    }

    static async getByStore(store_id: string): Promise<Interactive|null> {

        const found = await pg.query(
            'SELECT * FROM interactives WHERE store_id = $1 LIMIT 1',
            [store_id]
        );

        if(found?.rows[0]){
            return new Interactive(found.rows[0] as InteractiveRow)
        }
        return null
    }

    static async create(params: {
        store_id: string;
        image: string;
        metadata: InteractiveRow['metadata'];
    }): Promise<Interactive> {
        const result = await pg.query(
            `INSERT INTO interactives (store_id, image, metadata) VALUES ($1, $2, $3) RETURNING *`,
            [params.store_id, params.image, JSON.stringify(params.metadata)]
        );
        if(!result){
            throw new Error('Failed to create Interactive');
        }

        return new Interactive(result.rows[0] as InteractiveRow);
    }


    update=async (data:Pick<InteractiveRow, 'image' | 'metadata'>):Promise<boolean>=>{
        if(!this.id){
            throw new Error('Cannot update Interactive without ID');
        }

        if(!data.image && !data.metadata){
            return false
        }

        const newData = {
            image: data.image || this.image,
            metadata: data.metadata || this.metadata,
        }

        const result = await pg.query(
            `UPDATE interactives SET image = $1, metadata = $2 WHERE id = $3 RETURNING *`,
            [newData.image, JSON.stringify(newData.metadata), this.id]
        );
        if(!result){
            throw new Error('Failed to update Interactive');
        }
        this.image = result.rows[0].image;
        this.metadata = result.rows[0].metadata;

        return true;
    }
}