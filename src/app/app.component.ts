import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Post} from './post';
import {PostService} from './post-service';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  errorSub: Subscription;
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      // this.error = error.message;
      this.error = error.message;
    });
  }

  onCreatePost(postData: { title: string; content: string }) {
    this.postService.createAndStorePost(postData.title, postData.content);

  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(post => {
      this.isFetching = false;
      this.loadedPosts = post;
    }, error => {
      this.error = error.message;
    });

  }

  onClearPosts() {
    // Send Http request
    this.postService.deleteAllPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

}
