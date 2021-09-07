import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { from } from "rxjs/internal/observable/from";
import { environment } from "src/environments/environment";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AppImg } from "../model/appImg";

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supbaseKey);
    }

    getAllAppImgIds(): Observable<any> {
        const query = this.supabase.from('appImg').select('id');

        return from(query).pipe(
            map(res => res['body'])
        );
    }

    getAppImgById(id: number): Observable<any> {
        const query = this.supabase.from('appImg').select('*').filter('id', 'eq', id);

        return from(query).pipe(
            map(res => res['body'])
        );
    }

    /**
     * First, upload the img file into the supabase bucket.
     * Then create an appImg object in the supabase db and use the path of the previously 
     * uploaded img in the new db object.
     * @param img 
     * @param tags 
     * @returns 
     */
    postAppImg(img: File, tags: string[], url: string): Observable<any> {


        let tagsInString: string = "";

        tags.forEach(tag => {
            tagsInString += ',' + tag;
        })

        if (tagsInString.charAt(0) === ',') {
            tagsInString = tagsInString.slice(1, tagsInString.length - 1)
        }

        const query = this.supabase.from('appImg').insert({ data: url, tags: tagsInString });

        return from(query).pipe(
            map(res => res['body'])
        );
    }

}