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

    /**
     * 
     * @returns Object[] with  field id:number
     */
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
     * 
     * @param tags 
     * @param url 
     * @returns AppImg[]
     */
    postAppImg(tags: string[], url: string): Observable<any> {

        let tagsInString: string = "";

        tags.forEach(tag => {
            tagsInString = tagsInString + tag + ',';
        })

        console.log("tags eee", tagsInString)

        if (tagsInString.charAt(tagsInString.length - 1) === ',') {
            tagsInString = tagsInString.slice(0, tagsInString.length - 1)
        }
        console.log("tags here", tagsInString)
        const query = this.supabase.from('appImg').insert({ data: url, tags: tagsInString });

        return from(query).pipe(
            map(res => res['body'])
        );
    }

}