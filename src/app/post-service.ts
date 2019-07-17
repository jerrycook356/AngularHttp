import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Post} from './post';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })


export class PostService {

  error = new Subject<string>();
  constructor(private http: HttpClient) {}

  createAndStorePost(title: string , content: string) {
    const postData: Post = {title, content};

    this.http.post <{name: string}>('https://angulartestproject-a7ca4.firebaseio.com/posts.json',
      postData).subscribe(
      responseData => {
        console.log(responseData);
      }, error => {

          this.error.next(error.message);
      });

  }

  fetchPosts() {
    const postsArray: Post[] = [];
    return this.http.get<{[key: string]: Post}>('https:angulartestproject-a7ca4.firebaseio.com/posts.json',
      {headers: new HttpHeaders({'custom-header': 'Hello'})}).
    pipe(map(responseData => {
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postsArray.push({...responseData[key], id: key});
        }
      }
      return postsArray;
    }));

  }
  deleteAllPosts() {
    return this.http
      .delete('https://angulartestproject-a7ca4.firebaseio.com/posts.json');
  }

}
